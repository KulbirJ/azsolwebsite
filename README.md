# AZ Solutions

Next.js static site (App Router, static export) for azsol.ca — cybersecurity consulting
site with a blog.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing a blog post

Add a Markdown file to `src/content/blog/<slug>.md` with frontmatter:

```md
---
title: "Post title"
date: "2026-07-08T00:00:00.000Z"
excerpt: "One or two sentence summary shown on the blog feed card."
image: "/uploads/your-image.jpg"
---
Post body in Markdown goes here.

> Blockquotes render as styled pullquotes.
```

Optionally add a `stats` array to the frontmatter to show a key-stat band at the top of
the post:

```yaml
stats:
  - value: "47 days"
    label: "Upcoming TLS cert lifespan"
  - value: "$100k+"
    label: "Annual cost at scale"
```

Images referenced in posts should live under `public/uploads/`.

## Build

```bash
npm run build
```

Produces a static export in `out/` (`output: 'export'` in `next.config.ts`).

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes `out/` to GitHub Pages. The custom domain (azsol.ca) is set via
`public/CNAME`, which GitHub Pages picks up automatically from the build output.
