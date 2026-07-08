---
title: "Entra Authenticates. Your Apps Authorize. That Gap Is Where Access Goes to Hide."
date: "2026-06-19T06:00:00.000Z"
excerpt: "A user leaves the sales team. Someone removes them from the \"Sales\" group in Entra. Clean off-boarding, ticket closed. Three weeks later, an audit fin…"
image: "/uploads/grok_ebcbf156_70ec_49c9_a9a4_5b13451aef7d_7dcfc0bac1.jpg"
---
A user leaves the sales team. Someone removes them from the "Sales" group in Entra. Clean off-boarding, ticket closed.

Three weeks later, an audit finds they can still see every opportunity in Salesforce.

Nobody made a mistake, exactly. The Entra group was removed. But the Salesforce permission set that the group used to assign? That stayed. Because Entra never owned it in the first place.

This is the seam I want to talk about: the line between authentication (proving who you are) and authorization (what you're actually allowed to do once you're in). Entra is excellent at the first. It has far less to say about the second than most teams assume. And almost every cross-platform governance gap I've run into lives in the space between them.

This is the third piece in a series on identity architecture. The [first article](https://azsol.ca/blog/IAM1/) argued for thinking about architecture before tools. The [second article](https://azsol.ca/blog/IAM2/) was about recognizing which identity pattern you're actually running. This one zooms into a single line inside that architecture, the one most people don't realize is there.

* * *

### The line itself

The textbook distinction is simple. Authentication is proving who you are. Authorization is what you're allowed to do. Everyone's read that version.

The part that trips people up isn't the definition. It's the ownership.

In a hub-and-spoke setup with Entra at the center, it _feels_ like Entra controls access. You assign someone to a group, they get into Salesforce, they have the right view. Cause and effect, all in one place, all in one system. So the mental model becomes "Entra controls who can do what."

But those are two separate events wearing a trench coat.

Entra authenticated the user and asserted a group membership. It vouched for who they are and told the app which groups they belong to. Then Salesforce read that assertion and applied its _own_ authorization model, the profiles, permission sets, and sharing rules, to decide what the user actually sees and does.

Entra didn't make that second decision. It doesn't even know what the decision was. It handed over a claim and the app took it from there. Two systems, two owners, one experience that looks seamless from the outside.

* * *

### What actually lives on each side

![grok-4b25f406-d8b5-467d-96c3-c9d951b8a5f4.jpg](/uploads/grok_4b25f406_d8b5_467d_96c3_c9d951b8a5f4_725afa9a72.jpg)

Once you start sorting things into "entry" versus "past the threshold," the picture gets clearer, and a few surprises show up.

Here's what sits on **Entra's side of the line**, the authentication and identity side:

Single sign-on and federation, through SAML and OIDC. User lifecycle for cloud identities: creating, updating, disabling accounts. Groups and dynamic membership. Conditional Access, which feels like an authorization control but isn't. It decides _whether_ you get in based on device, location, risk. That's still the front door. And SCIM provisioning, which pushes the user account and some attributes or group claims out to the app.

Here's what sits on the **app's side of the line**, the authorization side:

In Salesforce, that's profiles, permission sets, sharing rules, and object- and field-level security. In ServiceNow, it's roles, ACLs, and the scoped-application permission model. Every SaaS app has its own version. This is the fine-grained "what can this person actually touch" layer, and it lives inside the app.

Now the part in the middle, where the confusion breeds.

SCIM provisions the user and can push group membership. It does _not_ push the app's internal authorization logic, because that logic isn't Entra's to push. A group claim in a token says "this person is in Sales-Team." The app decides what Sales-Team actually means. That mapping, group on one side and real permissions on the other, lives inside the app, and it's maintained by a person. Sometimes a specific, accountable person. Often nobody in particular.

Conditional Access, SCIM, group claims: all still on the entry side. The authorization that matters happens after the handoff, in a system Entra doesn't govern.

* * *

### Three places the gap bites

This isn't theoretical. The seam shows up in three specific, recurring ways.

**One: the group that doesn't mean what you think.**

"Sales-Team" in Entra might map to a read-only profile in one app, a power-user permission set in another, and admin rights in a third. Entra shows you the group membership. It cannot show you that the same group name grants wildly different power depending on which app is reading it. The group name is a label. The meaning lives downstream, in each app, separately.

**Two: access reviews that are blind to authorization.**

A quarterly certification in Entra shows a manager which groups their people belong to. It does not show what those groups grant inside each app. So the manager looks at "Sales-Team, yes, that's correct for this person" and certifies it, without ever seeing that Sales-Team quietly includes the ability to export the entire customer database. The review is complete and blind at the same time. Every box got checked. The actual risk was never on screen.

**Three: deprovisioning that strands access.**

Back to the opening scene. You remove the Entra group, and Entra dutifully removes the claim. But the permission set that group assigned inside the app, the manually-granted exception someone added last year, the local app role that was set up directly: those can persist. Entra reached the identity's claim. It didn't reach into the app's authorization store, because that was never its store to reach.

All three trace to the same root. Entra acts on the claim. The app acts on its own model. Your governance tooling watches the claim and assumes it's watching the access. It isn't.

* * *

### How to actually see the gap

![grok-627bc19d-7a96-4b97-b07f-4ca2e11f3f3a.jpg](/uploads/grok_627bc19d_7a96_4b97_b07f_4ca2e11f3f3a_4cebb2dd0f.jpg)

The good news is that closing this doesn't require a new platform. It requires looking at the authorization side on purpose, because nothing does it for you automatically.

A few moves that are doable this quarter:

Take your highest-risk groups and map them to what they _actually_ grant in each app they touch. Just once, by hand if you have to. I'd bet money you find at least one surprise, a group that grants more than anyone realized in at least one app.

Treat that group-to-entitlement mapping as a real artifact that someone owns and maintains, not a thing you assume stays accurate on its own. It drifts. Apps add permission sets. Someone needs to be accountable for keeping the map current.

For access reviews, get the app-side authorization into the reviewer's view, even if step one is an ugly manual export from each app. Certifying the group without seeing the grant is theater. A clumsy export that shows real permissions beats a polished review that shows none.

And test deprovisioning by checking the app, not the hub. Remove someone, then log into the app as an admin and confirm the access is actually gone. Don't take the closed ticket as proof. The ticket lives on the Entra side of the line.

* * *

### None of this means Entra is the wrong hub

It's a genuinely strong one. The point isn't that Entra falls short. It's that Entra is doing exactly the job it's designed for, authentication and identity, and quietly handing the authorization question to every app downstream. The gap isn't a flaw in the product. It's a boundary that nobody tells you about until an audit does it for them.

This connects straight back to the Layered pattern from the last piece. Every place where Entra's authority ends and an app's begins is a seam. A Layered architecture is just a lot of those seams stacked on top of each other. The Oracle and OCI boundary I keep coming back to is the same story playing out in a different domain, one system's authority ending exactly where another's begins, with the handoff invisible until something falls through it.

Next, I want to look at AWS IAM, because it draws this same authentication-authorization line in a completely different place, and it sets up a different set of assumptions that are worth correcting before they bite.

* * *

Disclosure : _This is part of a series on IAM architecture across multi-cloud and SaaS environments. Views are my own, and expanded on what I have learned with practical field experience and ongoing technical research . To structure this content and optimize my learning workflow, I utilized Claude as an AI research and organization assistant_
