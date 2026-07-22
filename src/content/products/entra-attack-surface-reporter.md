---
title: "Entra ID Identity Attack-Surface Reporter"
date: "2026-07-22T00:00:00.000Z"
excerpt: "A read-only tool that scans a Microsoft Entra ID tenant for the identity misconfigurations attackers actually use — and produces a prioritized, framework-mapped report an executive can act on."
image: "/uploads/EntraA.jpg"
tag: "Identity Security"
github: "https://github.com/KulbirJ/Entra-Attack-Surface-Reporter"
language: "Python 3.12"
license: "MIT"
stats:
  - value: "5"
    label: "Attack-surface checks"
  - value: "Read-only"
    label: "By design"
  - value: "MIT"
    label: "License"
---

Most free security scanners are happy to tell you *what failed*. Very few tell you *what to fix first*. That gap is exactly why I built the **Entra ID Identity Attack-Surface Reporter** — a read-only assessment tool that scans a Microsoft Entra ID tenant for the identity misconfigurations attackers actually exploit, ranks them by exploitability and business impact, maps each to a recognized control framework, and ships an executive summary you could hand to a CISO tomorrow.

> The deliverable format of a consulting engagement, not a compliance printout.

The tool is free, open source (MIT), and available on GitHub. This post walks through what it checks, how it prioritizes, and how to run it.

## The Problem It Solves

Identity is the new perimeter, and Entra ID is where most modern breaches begin — a stale guest account, an admin with no MFA, an over-privileged app consent. Plenty of tools will enumerate these. What they rarely do is answer the question a busy security lead actually asks: *of these forty findings, which three will get me breached this quarter?*

This tool is built around that question. Every finding is ranked **Critical-first**, with **blast radius** (the number of affected objects) breaking ties, and every finding carries specific remediation text and a framework mapping. The output looks like the artifact a security consultant would produce — because that's the standard it was designed to.

## The Five Checks (v1)

| # | Check | Why it matters |
|---|-------|----------------|
| 1 | **Stale guest accounts** | Forgotten B2B guests are unmonitored footholds (no sign-in > 180 days; never-redeemed invites aged from creation) |
| 2 | **Dormant privileged accounts** | Unused admin = pure attack surface, zero business value (role holders, no sign-in > 30 days) |
| 3 | **Legacy authentication exposure** | Legacy protocols bypass MFA entirely |
| 4 | **MFA gaps on privileged users** | The single highest-impact identity control |
| 5 | **Risky app consents** | Over-privileged service principals are the modern backdoor |

A couple of these encode real attacker economics rather than a naive checkbox. MFA findings are **tiered**: a privileged user with *no* usable MFA is Critical, while a phone/SMS-only method is High — because SMS still defeats commodity password spray, but provides approximately nothing against real-time adversary-in-the-middle phishing. Risky app consents use a **two-tier permission model**: Tier 0 is directory-takeover permissions (`RoleManagement.ReadWrite.Directory`, `Application.ReadWrite.All`, `Directory.ReadWrite.All`), Tier 1 is tenant-wide data access (`Mail.Read`, `Files.ReadWrite.All`, `User.ReadWrite.All`).

## Prioritized, Framework-Mapped Output

Every finding is mapped to **Microsoft Cloud Security Benchmark (MCSB)**, **CIS Microsoft 365 Foundations**, and the **ACSC Essential Eight** — with one honest exception: stale guests carry no forced Essential Eight mapping, because a forced mapping costs credibility with auditors. The report leads with an executive summary (severity count cards, top-3 risks, a plain-English narrative) and closes with a **methodology and scope-limits section** where the tool states its own blind spots. Configuration is intent; only observed behavior is proof — so the report is explicit about what it can and cannot see.

## Design Principles

**Read-only by design.** It never writes to the tenant. Full stop.

**Least privilege.** It reads MFA state via the reports endpoint under `AuditLog.Read.All` rather than the more sensitive `UserAuthenticationMethod.Read.All`, and uses `RoleManagement.Read.Directory` instead of the broad `Directory.Read.All`.

**Fails loudly, never partial.** If you're holding a report, every check ran to completion on complete data. A missing permission or license produces a hard error with remediation guidance — never a silently undercounted report.

> An availability failure is recoverable — an integrity failure (a report that silently undercounts) is not.

## Quick Start

```bash
git clone https://github.com/KulbirJ/Entra-Attack-Surface-Reporter
cd Entra-Attack-Surface-Reporter
pip install -e ".[dev]"
cp .env.example .env       # fill in tenant ID + app registration details
entra-asr report --output report.html
```

It's Python 3.12, built on `msal` (auth), `httpx` (HTTP), and `jinja2` (report templating). The output is a single self-contained HTML file — inline CSS, no external assets, XSS-safe.

## Required Graph Permissions

Application (read-only) permissions, consented once by a tenant admin:

| Scope | Used for |
|-------|----------|
| `User.Read.All` | Guest + user enumeration |
| `AuditLog.Read.All` | Sign-in activity + MFA registration report |
| `RoleManagement.Read.Directory` | Privileged role holders |
| `Policy.Read.All` | Conditional Access + Security Defaults |
| `Application.Read.All` | Service principals & app-role assignments |

Reading sign-in activity requires an Entra ID **P1/P2** license; the tool fails loudly with remediation guidance if a permission or license is missing.

> **Credential note:** client-secret auth is for dev/lab use. For client engagements, use certificate auth with the private key in Key Vault or an HSM.

## What the Report Looks Like

The bundled sample report (generated from fixture "Contoso Demo Tenant" data) produces headline numbers of **2 Critical, 4 High, 1 Medium, 0 Low — 7 finding types across 12 affected objects**. The top risk: a privileged user without any usable MFA method. Each finding renders as a card with framework badges, an affected-object table, and a remediation box.

## What's Next

v1 draws a deliberate scope boundary. On the roadmap: PIM-eligible role holders, admin-consented delegated grants, sign-in log traffic analysis (filtered on `clientAppUsed`), PDF export, scheduling, and multi-tenant batching.

The code is on [GitHub](https://github.com/KulbirJ/Entra-Attack-Surface-Reporter) — clone it, run it against a lab tenant, and open an issue if a check misfires on your environment.
