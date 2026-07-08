---
title: "Beyond Tool Comparison: The IAM Architecture Decision Matrix"
date: "2026-05-28T06:00:00.000Z"
excerpt: "Last year I was asked to review the identity architecture for a mid-size enterprise. About 3,000 employees, a solid Azure footprint, Oracle HCM for HR…"
image: "/uploads/Identity_7e82dbce13.jpg"
---
Last year I was asked to review the identity architecture for a mid-size enterprise. About 3,000 employees, a solid Azure footprint, Oracle HCM for HR, and a growing list of SaaS tools the business had picked up over time.

When I got in the room, I asked a simple question: "Which system is your source of truth for user identity?"

Silence.

After a few minutes, the IT lead said: "Entra ID, I think. But Oracle has its own users too." The security architect on the call said they'd been meaning to consolidate. The Oracle admin wasn't sure if deprovisioning in Entra actually removed access in Oracle.

They had two parallel identity systems running side by side. Neither team had flagged it as a problem because each system worked fine on its own.

That moment stuck with me. Not because it was unusual, it wasn't, but because it was the fourth time in a year I'd seen the same thing. Two identity systems, no clear authority, and a lot of manual process quietly holding things together.

I spent the months after that thinking about why this keeps happening. And the short answer is: organizations pick IAM tools before they figure out their architecture. The tool works. The architecture doesn't. And by the time the gaps show up, changing course is expensive.

This is the first in a series where I'm sharing what I've found not a vendor comparison, but a way of thinking about identity architecture before you start the RFP.

## The problem with the spreadsheet

The standard IAM evaluation goes something like this. You build a comparison matrix SAML support, SCIM provisioning, MFA options, app gallery size, access reviews, conditional access, licensing cost. Vendors fill in their columns. You score them. You pick a winner.

The problem isn't that the spreadsheet is wrong. The problem is that it's answering the wrong question.

"Does this vendor support Salesforce?" is a useful question. But it doesn't tell you:

*   Whether Salesforce provisioning should sit in your IAM hub at all
    
*   What happens when that provisioning breaks at 3am
    
*   Who owns Salesforce's permission sets and profiles, you or SalesforceIf your IAM system fails, can users still log in anywhere
    

These are architectural questions. And they matter more than the feature list, because they determine whether the tool you picked actually fits the environment you're running it in.

I've seen organizations run a perfect evaluation process and still end up ripping things out 18 months later. Not because the tool failed; because the tool was solving for the wrong problem.

## Identity fabric vs. a collection of tools

The first thing I look at when reviewing an identity architecture is whether the organization is building a fabric or just collecting tools.

These sound like the same thing. They're not.

**Point solutions** are optimized per platform. Entra ID handles Azure and Microsoft 365. AWS IAM handles AWS. Oracle IAM handles Oracle apps. Each tool does its job well inside its own domain. The problem shows up at the edges where someone leaves the company and three separate systems each need to be updated. Or where an auditor asks for a complete access certification and the answer lives in four different places.

**An identity fabric** thinks differently. The governance layer policy, access reviews, lifecycle management sits above the individual platforms. The tools become connectors, not authorities. The question shifts from "which tool handles this?" to "how does policy flow through all of these?"

Most organizations don't start with a fabric. They start with point solutions and grow toward fabric thinking after something breaks. The trigger is usually one of three things:

*   A compliance audit that asks for cross-platform access certification and finds no clean answer.
    
*   An offboarding incident where a departed employee still had access somewhere a month later.
    
*   Or a security review that finds inconsistent access policies across platforms.
    

The question I ask now when reviewing an architecture is: "What would it take to deprovision a user from every system in under an hour?" If the answer involves manual steps across separate tools, the organization is in point-solution territory whether they realize it or not.

A real example from my own work: CyberArk PIM alongside Entra ID is a step toward fabric thinking. PAM sits above the individual platforms and governs privileged access regardless of whether the target is Azure, on-prem, or Oracle. That's one control domain with unified visibility. But if Oracle HCM is running its own access governance separately, you have a fabric in one lane and a point solution in another in the same organization.

![image1.png](/uploads/image1_13e2e4519c.png)

## Not all identity is the same

The second thing that changes my analysis is the ratio of workload identity to human identity.

Human identity is what most IAM tools are built for. An employee logs in, accesses apps, requests access, gets approved. Classic case, well-handled.

Workload identity is different. A Kubernetes pod reads from storage. A Lambda function writes to a database. An API gateway validates tokens. These don't log in they authenticate continuously at machine speed. And they're invisible in most identity governance tools.

Why does this matter for tool selection? Because if your organization runs significant cloud-native workloads, human identity in Entra ID might be the smaller problem. AWS IAM, Kubernetes IRSA, and workload federation are where the real architectural complexity sits.

If you're 5,000 office workers using Azure and Salesforce, AWS IAM's workload capabilities are mostly irrelevant. Entra is where everything lives and that's fine.

The mixed case (which is almost everyone now) is where it gets interesting. You need one approach for human identity and a different approach for workload identity, and they don't always come from the same vendor.

The mistake I see: organizations buy an enterprise IAM tool designed around human identity (reasonable), and then their engineering team quietly sets up AWS IAM for workloads because the enterprise tool doesn't fit. Now you have two separate identity control planes with no integration and different audit trails. Not because anyone made a bad decision, because nobody asked the question upfront.

## Five questions before you start evaluating vendors

Based on what I've seen across a range of environments, here are five questions that matter more than anything on the comparison spreadsheet.

**1\. Is your architecture hub-and-spoke or mesh?**

Hub-and-spoke means one system is authoritative. Everything syncs through it. Simpler to govern, easier to audit. The risk: if the hub has a problem, the downstream impact is wide.

Mesh means identity is distributed each platform has some authority, synchronized across systems. More resilient, but operationally complex. Sync conflicts happen. Audit trails get fragmented. Deprovisioning requires coordination across systems that don't naturally talk to each other.

Most organizations default to hub-and-spoke without consciously choosing it. The question is whether the hub you've picked can actually handle the load in terms of integrations, provisioning volume, and governance coverage.

**2\. Who owns app-level authorization?**

This one surprises people. Entra ID can authenticate a user to Salesforce. But Salesforce's permission sets, profiles, and object-level security are owned by Salesforce.

If Entra provisions a user to a "Sales" group, does that automatically map to the right Salesforce profile? Who manages that mapping? What happens when Salesforce releases a new permission set that doesn't exist in Entra?

Every SaaS app has an authorization layer that lives inside the app. Your IAM system controls the front door. But what happens once users are inside is often invisible to your identity governance tools.

This is one of the most consistent gaps I find. Access reviews that cover IAM roles but miss the SaaS authorization layer underneath.

**3\. What's your deprovisioning SLA?**

Provisioning gets attention. Deprovisioning is where architectures fail quietly.

If a contractor's 90-day access expired today, how long until they actually lose access to Salesforce? To Oracle HCM? To the AWS console?

The answer tells you what your architecture actually is and not what you think it is. "Immediately across all systems" means full provisioning with tight automation. "Within 24 hours" means federation with batch sync. "Within a few days" means there are gaps.

**4\. Can your governance layer see authorization, not just authentication?**

Your IAM system knows which groups a user belongs to. It probably doesn't know what those groups actually allow inside each SaaS app.

The gap between "what IAM knows" and "what apps enforce" is real and often wide. Quarterly access certifications that only review IAM roles are leaving the SaaS layer unchecked.

**5\. What's your identity RTO?**

If your identity infrastructure went down for two hours, what would stop working?

Most organizations don't have a clear answer to this until after an incident. And by then, the architectural decisions that created the problem are already baked in.

## Three scenarios from the field

**CyberArk + Entra ID in a hybrid environment**

This is one of the cleaner integrations I've worked with. Entra handles the broad identity layer users, groups, Conditional Access, SaaS federation. CyberArk sits above that for privileged access, covering both Azure and on-prem targets through a single vault.

It works because the responsibilities don't overlap. Entra does authentication and standard access. CyberArk does elevated access, session recording, and credential rotation.

The gap: Oracle HCM runs separately. Approvals, role grants, and access reviews in Oracle don't flow through either system. You have strong fabric thinking in the PAM lane and point-solution thinking in the enterprise app lane; same organization, different maturity levels.

**AWS IAM and Salesforce**

AWS IAM doesn't natively integrate with Salesforce. If you need federated AWS users to also access Salesforce, you need either a bridge (Entra ID, Okta) or custom SAML work.

This isn't a flaw in AWS IAM. It's a design choice, AWS IAM is optimized for cloud resource authorization, not SaaS federation. If SaaS integration is a significant requirement, AWS IAM alone isn't the right answer for that layer.

**Entra ID + Oracle IAM running in parallel**

Back to the scenario from the opening. Two identity systems, both authoritative, nobody sure which one wins in a conflict.

The architectural question is simple: which system governs what? If Entra updates a user and Oracle doesn't sync for four hours, what access does that user have in the interim?

In practice, the answer is usually "whichever system someone remembered to update last." Which is a manual process dressed up as an architecture.

## Start with one SaaS, not all of them

If you're building or rebuilding an identity architecture, the best advice I can offer is to pilot with one SaaS app before you try to connect everything.

SaaS integrations look simpler than they are. Salesforce expects attributes formatted a specific way. ServiceNow has custom fields that don't map cleanly to standard SCIM. Oracle Fusion's provisioning model works differently from Oracle EBS.

A pilot with one app tells you the actual provisioning complexity and what doesn't map cleanly, where exceptions live, what the sync failure rate looks like. It also tests your deprovisioning SLA under real conditions, and tells you whether your governance layer can actually see what's happening inside the app.

Pick the app that's highest-risk or most business-critical. Learn there first. The lessons will change how you approach everything else.

## The cost conversation nobody has upfront

One more thing worth saying before you starts.

IAM licensing costs are visible. Entra ID Premium P2, Okta Workforce, Oracle IAM; those are the numbers in the vendor comparison matrix.

Operational costs are usually larger and rarely in the spreadsheet.

A custom SaaS integration that's not in your vendor's app gallery: roughly 80-120 hours to build, 15-20 hours per year to maintain as APIs change. Multiply that by the number of custom integrations.

Sync conflict resolution: every distributed identity architecture generates sync conflicts. Someone needs to review and resolve them. At scale, that's a real FTE commitment.

Access review labor: quarterly certification across eight systems, if done manually, takes time. If automated, someone needs to build and maintain the automation.

A rough breakdown I use

![image2.png](/uploads/image2_1b06a258df.png)

The operational percentage goes up every time you add a new platform or SaaS app. That's worth knowing before you commit to an architecture that requires six custom integrations.

**What's coming next**

Over the next few weeks I'm working through the rest of this topic specifically the five identity architecture patterns I keep seeing across organizations, and how to figure out which one you're actually in (versus which one you think you're in).

After that I want to get into how Entra ID, AWS IAM, and Oracle IAM each approach cross-platform integration differently not a feature comparison, but an honest look at where each one works well and where it hits limits.

The goal across all of it is the same: architecture-first thinking, before the vendor demos start.

If any of this maps to something you're working through, I'd genuinely like to hear what's tricky about it in your environment. That conversation shapes where this series goes.

\--

Disclosure : _This is part of a series on IAM architecture across multi-cloud and SaaS environments. Views are my own, and expanded on what I have learned with practical field experience and ongoing technical research . To structure this content and optimize my learning workflow, I utilized Claude as an AI research and organization assistant_
