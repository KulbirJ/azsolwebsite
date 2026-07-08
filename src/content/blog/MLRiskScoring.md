---
title: "Building a Production-Ready CVE Risk Scoring System with XGBoost and Multi-Tier Data Enrichment – Full Project Walkthrough"
date: "2026-03-01T17:30:00.000Z"
excerpt: "Introduction/Executive Summar In 2026, many small-to-medium-sized organizations still struggle with vulnerability management. The key pain point remai…"
image: "/uploads/image_1773334161358_99ebd850_7f70f5b40f.png"
---
## Introduction/Executive Summar

In 2026, many small-to-medium-sized organizations still struggle with vulnerability management. The key pain point remains the prioritization of thousands of vulnerabilities. While security teams are equipped with automated scanners capable of discovering thousands of vulnerabilities within minutes, operational and technical teams often require days or months to apply fixes. I developed this project to prioritize vulnerabilities beyond standard CVE risk ratings by using machine learning to learn from over 15 open-source data sources and enrich these vulnerabilities in real time.

## Project Overview

The core focus of this project is to build upon traditional CVSS scores. I am in the 10th year of my cybersecurity career; since day one, I have worked with CVSS scores, and it is now widely understood that these scores are too simplistic and do not reflect real-world risk accurately. I always enjoy using a non-technical analogy to explain this: CVSS is like a "storm strength" meter that only measures wind speed, not whether the storm is heading for your town, how strong your buildings are, or if people are currently outdoors. It provides a number (like 9.8) that appears precise, but that number often fails to match how dangerous the vulnerability actually is for a specific company or system. 

## he Problem with CVSS scoring

 No Real Context: CVSS scores are based on "in-theory" impact rather than how your own systems are configured, exposed, or protected. Consequently, the same bug can be high-risk in one environment and low-risk in another while retaining the same score.

Severity, Not Likelihood: They primarily measure the potential impact if exploited, rather than the likelihood of an attacker utilizing it. As a result, rare, hard-to-exploit flaws can outrank common, weaponized ones.

Ignores Business Impact: CVSS does not distinguish between a system running a bank, a hospital, or a test lab. Therefore, it cannot determine the actual stakes regarding finances, safety, or reputation. 

Static and Over-trusted: Scores often remain unchanged when new exploits appear or defenses are added. Yet, many tools and policies still mandate "fix everything above X," treating CVSS as a final answer instead of a starting point.

## How This Project Solves It 

This project is designed to be flexible, providing an ML-powered risk score for each CVE. The XGBoost model is trained on real-world data derived from multiple open-source projects. It is trained based on a system-level understanding of your environment, real-world activity, and the types of exploits currently available for that specific or similar CVEs. 

## System Architecture 

Multi-Tier Data Enrichment Pipeline. The system flows through a well-defined pipeline: 

###  Data Collection (TIER 1-3):

*    TIER 1: CISA KEV, Exploit-DB, OSV Database (8 features) 
*    TIER 2: NVD CPE Data, GitHub Advisories, AlienVault OTX (10 features) 
*   TIER 3: Metasploit Modules, Censys, CVSS Severity (9 features)  

### Processing Pipeline:

*   enhance\_cves\_tier1.py → 500 CVEs × 14 columns
*    enhance\_cves\_tier2.py → 500 CVEs × 24 columns 3. 
*   enhance\_cves\_tier3.py → 500 CVEs × 33 columns 

### Feature Engineering & Model Training: 

*   Data cleaning & normalization 
*   Categorical encoding (attack\_vector, ecosystem, rank) 
*   Feature selection (28 most predictive features) 
*   Train/Test split (80/20) 
*   XGBRegressor for risk scoring + XGBClassifier for severity 
*   Output: FastAPI REST endpoint for real-time predictions 

### End-to-End Deployment: 

*   FastAPI Server with Swagger UI, health checks, and batch prediction endpoints 
*   Integration points: Security dashboards, SOAR platforms, ticket systems, compliance tools, automation frameworks

### Model Training & Results 

The Power of XGBoost in Vulnerability Scoring. Think of our ML system as having two jobs:

 **Job 1 (Regressor):** Predict the exact risk score (0.0 to 1.0) for each CVE—"How risky is this vulnerability?"

 **Job 2 (Classifier):** Predict the severity band—"Is this Critical, High, Medium, or Low risk?" 

XGBoost excels at both by building an "ensemble" (forest) of smart decision trees. Each tree learns from the mistakes of the previous ones, progressively getting better at capturing complex patterns that raw CVSS scores miss—like the relationship between exploitability, real-world attacks, and your specific threat landscape. 

Performance: Numbers That Matter

 | Metric | Our Model | What It Means | |---|---|---| 

 MAE (Mean Absolute Error) | 0.0058 points | On average, predictions are off by less than 1% on a 0-1 scale | | R² Score | 0.9806 (98%) | Model explains 98% of all variance in risk prediction | | Severity Accuracy | 100% | Zero misclassifications (Low/Med/High/Critical) | 

### Why This Beats Standard CVSS

 **Data Source** 

CVSS: Only looks at published information about the vulnerability itself (like how it's technically described)

 Our Model: Uses 28 different real-world intelligence sources—exploit availability, active attacks in the wild, GitHub reports, threat actor activity, weaponized exploits, etc. Much richer picture.

 **Learning**

CVSS: Uses the same formula it's always used. If new exploits appear tomorrow, CVSS still gives the same score. It never learns or adapts. 

Our Model: Learns from actual patterns in the data. It understands "when vulnerabilities have X and Y characteristics, attackers usually exploit them quickly." It gets smarter over time.

 **Context Awareness**

CVSS: Treats all CVEs the same way. A bug in Windows gets the same scoring treatment as a bug in an obscure open-source library nobody uses. 

Our Model: Understands YOUR environment. It learns which vulnerabilities actually matter in real-world attacks—adapts to what's happening right now. 

 **Likelihood vs Impact**

CVSS: Obsessed with "how bad would it be if exploited?" Biases everything toward high scores. A hard-to-exploit vulnerability but catastrophic impact? Still gets flagged as critical. 

Our Model: Asks TWO questions: "How bad is it?" AND "How likely is someone actually going to exploit it?" Balances both. A hard-to-exploit flaw gets a lower score than an easily-weaponized flaw with the same impact. 

**Real-World Example**

 CVSS: Sees a CVE with high CVSS (9.0+) → Automatically flags as CRITICAL (even if nobody's actually exploiting it) 

Our Model: Sees the same CVE, but checks: "Wait, are there zero public exploits? Has it been attacked in the wild? Is it weaponized?" → Scores it as MEDIUM (saves your team time) 

**How Enrichment Powers Accuracy**

Each CVE passes through three enrichment tiers:

 TIER 1: Basic facts (is it in CISA's actively exploited list? Are exploits public?) 

TIER 2: Context (which software ecosystems affected? GitHub advisories? Threat intelligence from OTX?) 

TIER 3: Intelligence (Metasploit data, CVSS vectors, attack sophistication, weaponization trends) 

This multi-layered enrichment creates 28 features that feed into XGBoost—far richer than CVSS's 8 base metrics. The result? A dynamic risk score that reflects reality, not theory. 

### Production API & FastAPI Deployment

**From Model to API in Minutes** 

The trained XGBoost model isn't just a .json file sitting on disk—it lives as a production-ready REST API powered by FastAPI. This means your security tools, dashboards, and automation platforms can request risk predictions in real-time via HTTP. 

**The Interface: Swagger UI** 

When you start the API, you get an interactive documentation interface at http://localhost:8000/docs. This is Swagger UI—think of it as your API's control panel. You can: - View all available endpoints - Click "Try it out" to test predictions directly in the browser - See request/response formats in real-time - No code or curl commands needed 

**Quick Usage Examples**

Point your API at any CVE ID and get back a complete risk assessment. Review Readme.md available under project repo on github: [GitHub-cyber-risk-ml-training](https://github.com/KulbirJ/cyber-risk-ml-training) 

**For Production:** 

The codebase is Docker-ready—containerization makes it trivial to deploy across cloud environments (AWS, GCP, Azure, Kubernetes). Key deployment features:

 - Stateless Design: Each API call is independent (no session dependencies) 

\- Zero External Dependencies: Model and data bundled in the container 

\- Fast Startup: API ready in less than 2 seconds

 - Horizontal Scaling: Spin up multiple instances behind a load balancer for high-traffic scenarios 

Why Uvicorn? 

It's an ASGI server designed for async Python apps. FastAPI uses it because it handles hundreds of concurrent predictions efficiently—perfect for security operations that might receive thousands of API calls per minute from your SOAR, ticket systems, or continuous scanning platforms.

### Conclusion and Call to Action

In practice, this system serves as a mid-layer component that fits seamlessly within a broader automated risk assessment platform. If you consider a traditional multi-tier architecture consisting of presentation, application, and data layers, the FastAPI endpoint makes this a perfect fit for your application tier. This is a concrete example of how software and security engineers can transform public threat data into actionable intelligence. 

\*\*Resources:\*\* 

Full GitHub Repository:[Cyber-risk-ml-training](https://github.com/KulbirJ/cyber-risk-ml-training) 

LinkedIn Series: [Link to LinkedIn](https://www.linkedin.com/in/kulbirjaglan/)

Contact for Consulting: Reach out via LinkedIn
