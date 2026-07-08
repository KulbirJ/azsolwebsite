---
title: "The Five Patterns of Cross-Cloud Identity (And Why You're Probably Not in the One You Think)"
date: "2026-06-12T06:00:00.000Z"
excerpt: "Ask a room of engineers to name their identity architecture and you'll usually get a confident answer. \"Hub and spoke. Entra is our source of truth.\" …"
image: "/uploads/grok_ac3b5653_0750_4cd9_b444_ac4a8312af90_2765a92c88.jpg"
---
Ask a room of engineers to name their identity architecture and you'll usually get a confident answer. "Hub and spoke. Entra is our source of truth."

Then ask a few follow-up questions.

Where does a new contractor's identity actually get created first? What happens when Workday and Entra disagree about someone's job title? Which system did the engineering team use to set up their AWS access last quarter?

The answers rarely match the whiteboard.

What I keep finding is that most organizations are running one of five identity patterns and the one they'd name in a meeting is often not the one they're actually operating. The gap between those two is where the interesting problems live. It's also where the audit findings, the off-boarding misses, and the 2am "why does this account still have access" moments come from.

This is the second piece in a series on identity architecture across multi-cloud and SAAS environments. The first made the case for thinking about architecture before tools. This one is about figuring out which architecture you actually have and not the one you meant to build.

**\---**

### Your architecture is what your systems do, not what your diagram says

Before I walk through the five patterns, here's a lens.

There are four questions that tell you what you actually operate. The useful thing about them is that they're observable. You don't answer them by reading the architecture diagram on the wall. You answer them by watching what your systems do when something happens.

**Where does identity originate?** When a new person joins, which system creates their identity first? Whatever that system is, it's your real source of truth, regardless of what you've labelled as authoritative.

**How manual is off-boarding?** When someone leaves, how many systems does a human have to touch by hand? The answer tells you how unified you actually are. One click means one fabric. Five tickets across three teams means something else.

**Who wins a conflict?** When two systems disagree about a user's different role, different status, different attributes, which one wins? And does everyone give the same answer? If the answer is "it depends who you ask," you don't have an authority. You have a habit.

**How fragmented are reviews?** How many separate access reviews does a manager get each quarter? One unified certification means one governance layer. Three or four separate ones means your governance is as siloed as your identity.

Hold those four questions in mind as you read the patterns. You'll probably recognize your environment in more than one, and that's the first clue that the gap is real.

**\---**

### The five patterns

### Pattern 1 Hub & Spoke

**On paper:** One authoritative system. Everything federates through it. Entra ID, or Okta, sits at the centre, and every app and platform connects back to it. Clean. Central. One access review to rule them all.

**In practice:** It works beautifully right up until the first system the hub doesn't manage shows up. A shadow AWS account a team spun up for a project. An Oracle application that came with its own user store. A SAAS tool a department bought on a credit card and wired up themselves.

**The tell:** If you have an AWS account your hub doesn't know about, you're not Hub & Spoke anymore. You just haven't redrawn the diagram.

![Hubandsple.jpg](/uploads/Hubandsple_9d5e9f2596.jpg)

### Pattern 2 Mesh

**On paper:** Distributed authority. Each platform owns its piece, and systems synchronise with each other peer-to-peer. No single point of failure. Resilient by design.

**In practice:** Most meshes aren't designed they accumulate. You end up with two systems that both believe they're authoritative, syncing in both directions, occasionally disagreeing about a user and resolving it by whoever updated last. That's not resilience. That's a stand-off with a sync job.

**The tell:** If your answer to "which system wins?" is "it depends who you ask," you're running a mesh you didn't design.

![Mesh.jpg](/uploads/Mesh_cc54bf5e81.jpg)

### Pattern 3 Workload-First

**On paper:** Machine identity leads. Service principals, assumable roles, workload federation. Humans are the secondary case, federated in when they need console access.

**In practice:** This one usually shows up from the bottom up rather than by decision. Engineering needed AWS access that the corporate IAM couldn't provide cleanly, so they built their own path including roles, service accounts, automation. It works well for them. It's also a whole identity domain that HR and IT can't see and don't govern. Business end supports it as they are solving problem at light-speed and showing value.

**The tell:** If your engineers set up their own cloud access because corporate IAM didn't fit, your workload identity already left the building.

![workload first.jpg](/uploads/workload_first_edd6a4fc15.jpg)

### Pattern 4 SAAS-as-Source

**On paper:** A SAAS platform such as Workday, Salesforce, SAP SuccessFactors is the identity authority. It owns the system of record, and everything downstream consumes from it.

**In practice:** Sometimes this is a deliberate, clean architecture. Sometimes nobody actually decided it, but HR changes in Workday quietly drive everything anyway, and the "real" IAM system is just a mirror that updates overnight.

**The tell:** If HR changes a title in Workday and three systems update by morning, Workday is your identity authority whether IT signed off on that or not.

![saasasservice.jpg](/uploads/saasasservice_cdf58fa2e7.jpg)

### Pattern 5 Layered

**On paper:** Different platforms own different domains, deliberately stacked. Entra for corporate identity. A cloud IAM for infrastructure. An enterprise IAM for legacy applications. Each layer is good at its job.

**In practice:** Almost nobody designs this from scratch. You add a cloud for one project. You inherit an acquisition's stack. You keep a legacy system alive after a migration that "wasn't worth finishing." Each decision is reasonable on its own. Stack four or five of them and you're running multiple identity domains with glue code in between.

**The tell:** Nobody designs Layered. You wake up in it. The real question is whether you operate it deliberately or keep pretending you're still Hub & Spoke.

![layered.jpg](/uploads/layered_2e0ea4fd02.jpg)

### Why the gap exists

Here's why the distance between intended and actual is so common: architecture changes in small steps, but nobody redraws the map for a small step.

You add one AWS account for one project. You keep one Oracle system running because finishing the migration wasn't worth it that quarter. You let one department keep the SaaS tool they were already happy with. Every one of those decisions is defensible. None of them feels big enough to justify rethinking the whole identity architecture.

But stack four or five reasonable decisions on top of each other and the diagram on the wall, the one that still says Hub & Spoke, Entra in the middle describes a system that no longer exists. The map stopped matching the territory one small step at a time, and nobody updated the map, because no single step seemed to require it.

That's why the diagnostic matters more than the design intent. Your real pattern is the sum of every small decision you've made since the last time anyone looked at the whole picture. Not the shape you drew on day one.

![TheGap.jpg](/uploads/The_Gap_c7b7f5ae00.jpg)

### A pattern worth looking at closely: hybrid Azure and OCI

Let me get specific about one situation I keep running into, because it lands squarely in Pattern 5 and not by accident.

Picture a hybrid setup: Azure handling corporate workloads and Microsoft 365, alongside Oracle Cloud Infrastructure running Oracle Database workloads. Entra ID is the obvious hub for the Azure side, and it's excellent there.

But here's the architectural reality that no amount of wishful thinking changes. Microsoft's native identity tooling doesn't fully reach into OCI and Oracle Database. That gap is structural, not a configuration you forgot to switch on. The Oracle side has its own identity and access model, its own privileged accounts, its own way of granting and reviewing access, and Entra doesn't natively govern any of it.

So these environments are Layered. They have to be. Entra governs one domain well. The Oracle and OCI side needs its own coverage that Entra can't provide, no matter how the licensing slides are drawn.

The mistake I see in this exact situation is pretending otherwise. Drawing the Hub & Spoke diagram with Entra in the centre and treating the Oracle side as a footnote. That's precisely how you end up with the parallel-source-of-truth problem I wrote about in the [first article:](https://azsol.ca/blog/IAM1/) two identity systems, no clear authority between them, and a lot of manual process quietly holding the seam together.

The healthier move is to admit the pattern out loud. You're Layered. So operate it on purpose. Define which domain owns what. Be explicit about where the seams are and who's responsible for them. Decide how governance such as access reviews, privileged access, joiner-mover-leaver spans both sides, rather than discovering the gaps during an audit.

Layered by necessity is completely fine. Plenty of strong architectures are Layered because the environment genuinely requires it. Layered in denial is where the problems come from. The difference is entirely whether you've named it.

### So which one are you?

I'm not going to tell you which pattern is best, because there isn't one. Hub & Spoke is exactly right for some organisations. Layered is unavoidable for others. The patterns aren't good or bad, they're matched or mismatched to the reality you're actually operating in.

What I'd suggest instead is smaller and more useful: run the four diagnostic questions against your own environment this week.

Where does identity actually originate? How manual is off-boarding, really, when you watch it happen? Which system wins a conflict, and does everyone agree on the answer? How many separate access reviews does a manager sit through each quarter?

The answers will tell you which pattern you're genuinely operating. And if that turns out to be different from the one on your architecture diagram, which it often is, you've just found the most useful thing you'll learn about your identity setup this quarter. You can't fix a gap you haven't named, and you can't name it until you've looked.

Next in the series, I want to get into how the individual platforms handle all of this differently; what Entra ID, AWS IAM, and Oracle IAM each do well, and where each one quietly hands the problem back to you.

**\---**

Disclosure : _This is part of a series on IAM architecture across multi-cloud and SaaS environments. Views are my own, and expanded on what I have learned with practical field experience and ongoing technical research . To structure this content and optimize my learning workflow, I utilized Claude as an AI research and organization assistant_
