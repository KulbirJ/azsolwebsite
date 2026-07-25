---
title: "Conditional Access Policy Linter"
date: "2026-07-25T00:00:00.000Z"
excerpt: "Conditional Access as code: a read-only linter and drift detector for Microsoft Entra that tells you whether your policies actually enforce what you think they enforce, and what changed since your last review."
image: "/uploads/locksauth_cab8d231f1.jpg"
tag: "Identity Security"
github: "https://github.com/KulbirJ/ca-policy-linter"
language: "Python 3.12"
license: "MIT"
stats:
  - value: "16"
    label: "Prioritized rules"
  - value: "Read-only"
    label: "By design"
  - value: "MIT"
    label: "License"
---

You've opened the Conditional Access blade, counted forty-odd policies, and felt reassured, right up until someone asked which of them actually enforce MFA on your admins. That pause is the whole problem. A policy you can see in the portal but that enforces nothing is a lock with no bolt: it looks like security, and it holds nothing shut.

Here is the flat truth most Entra tenants are living with. **Your Conditional Access policies do not enforce what the portal implies they enforce, and you have no reliable record of what changed since your last review.** The Conditional Access Policy Linter closes both gaps, read-only, in one HTML report an executive can read before an engineer touches it.

It's free, MIT-licensed, and on GitHub. Here's the case for it.

## Why can't I just read the policies in the portal?

Because the portal shows you *configuration*, and configuration is not enforcement. A policy left in **report-only** looks active and enforces nothing. A grant control that reads "MFA OR hybrid-joined" looks like MFA and hands a stale domain-joined machine a clean bypass. An enabled policy scoped to a group that has since emptied out protects exactly no one.

The linter treats that gap as the point, not a footnote. **It reads the policy JSON the way an attacker reads your tenant**, hunting the path of least resistance, and evaluates 16 prioritized rules against it. Legacy auth in report-only is reported as *not blocking*, and the finding says so in plain language.

## What does it actually check?

Sixteen rules, each carrying a severity, the affected policies, a control-framework mapping, and a remediation, by construction rather than as an afterthought. Coverage spans break-glass safety, legacy-auth blocking, privileged-role MFA, baseline all-user MFA, guest coverage, exclusion sprawl, weakened grant controls, and duplicate or conflicting policies.

The two anchor rules are the ones that get people breached:

| ID | What it catches | Severity | Framework |
|----|-----------------|----------|-----------|
| CA007 | Privileged directory roles not covered by an MFA-requiring policy | Critical | MCSB PA-7, CIS M365 5.2.2.1 |
| CA003 | No enabled policy blocks legacy authentication for all users | Critical | MCSB IM-6, CIS M365 5.2.2.3 |

**CA007 is principal-based, not policy-name-based.** It resolves the actual people holding privileged roles and checks each one is genuinely covered after user exclusions, group exclusions, and risk-narrowed conditions. That accounting is the difference between a checkbox and an assessment. Every finding maps to **MCSB v1 and CIS Microsoft 365 Foundations v4.0.0**, and where no real control ID exists, the tool leaves the column honest rather than inventing one.

## Doesn't a pass/fail scanner already do this?

A pass/fail scanner tells you what failed. It rarely tells you what to fix first, and that ordering is the entire value on a Monday morning.

> A scanner that emits pass/fail is a script. A scanner that emits ranked, framework-mapped, remediable findings is a deliverable.

Findings rank by severity, then by blast radius (the count of affected policies), so the report leads with the single highest-value fix. Above the findings sits a **normalized posture score from 0 to 100**, shown next to "N of 16 checks evaluated." The score is monotonic under remediation: fixing a real finding always moves it up, and a check the tool *couldn't* evaluate counts as risk, never as a silent pass. A skipped check that looks like a green tick is exactly the failure mode that gets a consultant in trouble.

## How do I know what changed since last review?

You snapshot, then you diff. The `snapshot` verb exports your live CA policies to a timestamped JSON file; `lint` and `diff` run entirely against those files and **never touch the network**, so results are deterministic, replayable, and the snapshot itself becomes client evidence.

```bash
git clone https://github.com/KulbirJ/ca-policy-linter
cd ca-policy-linter
python -m venv .venv && . .venv/Scripts/activate   # or .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env        # fill in tenant + auth details

ca-lint snapshot                                    # export policies to a timestamped JSON
ca-lint lint latest --output report.html --client "Contoso"
ca-lint diff previous latest --output drift.html    # what changed since last review
```

Drift is not cosmetic. A security-relevant regression **inherits the severity of the control it undermines**: an MFA policy flipped from `enabled` to report-only is High, a removed policy is High for the enforcement you just lost, and fresh drift outranks a standing finding at equal severity so your review starts with what moved.

## Is it safe to run against a client tenant?

It's built to be. **No requested scope ends in `.ReadWrite`**, so the tool never writes to the tenant, by construction. It's non-intrusive on the read side too: it pulls only the groups and roles your policies actually reference, never the whole directory, and batches membership reads through Graph `$batch`. That single bounded-scope choice is what separates an assessment from a directory sync.

The permissions are read-only and minimal:

| Scope | Used for |
|-------|----------|
| `Policy.Read.All` | CA policies + named locations |
| `RoleManagement.Read.Directory` | Privileged role definitions and members (CA007) |
| `Group.Read.All` | Group membership and sizes (CA006, CA011) |
| `AuditLog.Read.All` | Sign-in recency for stale-exclusion checks (CA012) |

Auth is device-code by default, certificate for engagements, secret for dev only. Missing configuration fails loud and names the variable. **It never echoes the secret's value**, and there's a test that proves a supplied secret never surfaces in an error message.

## What it won't tell you

Controlled candour, because the tool prints its own limits in every report. It assesses a **point-in-time** capture, not the state before or after. And it assesses configuration, not live enforcement: conditions that rarely trigger, token lifetime, and app-level legacy-auth weaknesses sit outside what policy JSON can prove. There's no what-if simulation, no Terraform emission, and no write-back in v1. Those are deliberate scope lines, not oversights.

For reference, the bundled demo tenant scores **21 / 100 with 16 of 16 checks evaluated** (2 Critical, 5 High, 4 Medium, 1 Low), and the top of its "fix first" list is, predictably, CA007.

## Your five-minute quick win

If you do nothing else with the tool, run one snapshot and check these five by hand first:

- **Legacy auth** blocked and *enabled* (not report-only) for all users.
- **Privileged roles** covered by an MFA policy, after exclusions.
- **A baseline** all-user, all-apps MFA policy that new apps inherit automatically.
- **Exclusions** that haven't quietly grown to repeal the policy for a large slice of the tenant.
- **Grant controls** that never read "MFA OR hybrid-joined."

Every one of those is a real bypass I've watched slip through a well-run tenant, and every one is a single rule in the linter.

Clone it, point it at a lab tenant, and open an issue if a rule misfires on your environment: **[github.com/KulbirJ/ca-policy-linter](https://github.com/KulbirJ/ca-policy-linter)**. If you'd rather talk through how to fold snapshot-and-diff into a quarterly identity review, reach out. I'm always happy to compare notes with another practitioner.
