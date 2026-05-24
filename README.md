# personal blog

a minimal static personal blog built for github pages. dark theme, lowercase typography, markdown content.

## features

- **100% static** — no server, database, or api routes
- **github pages** — deploys via github actions
- **decap cms** — browser-based content editing (git-backed)
- **markdown** — blog posts with syntax highlighting
- **responsive** — mobile-first design

## quick start

### local development

```bash
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000).

### build

```bash
npm run build
```

output goes to `./out` (static html, css, js).

## project structure

```
├── app/                    # next.js app router pages
│   ├── page.tsx            # home
│   ├── blog/               # blog index + post pages
│   ├── resume/             # resume page
│   └── contact/            # contact page
├── components/             # shared components
├── content/
│   ├── posts/*.md         # blog posts
│   └── resume.md          # resume content
├── lib/                    # utilities (markdown parsing)
├── public/
│   ├── admin/             # decap cms (not in nav)
│   │   ├── index.html     # cms loader
│   │   └── config.yml     # cms config
│   ├── resume.pdf         # downloadable resume
│   ├── sitemap.xml        # generated at build
│   └── robots.txt        # generated at build
├── scripts/
│   └── generate-sitemap.ts
└── .github/workflows/
    └── deploy.yml         # github actions deploy
```

## deploying to github pages

### step 1: enable github pages

1. go to your repo **settings** → **pages**
2. under **build and deployment**, set **source** to **github actions**
3. save

### step 2: push to main

push your code to the `main` branch. the workflow will:

1. install dependencies
2. run `npm run build`
3. deploy the `out` folder to github pages

your site will be live at `https://<username>.github.io` (for user/org sites) or `https://<username>.github.io/<repo-name>` (for project sites).

### step 3: custom domain (optional)

add a `CNAME` file in `public/` with your domain. the workflow copies `public/` to `out/`, so it will be included.

## decap cms setup

the admin panel is at `/admin`. it is hidden from the main navigation and has `noindex` for search engines.

### github backend authentication

the github backend requires a server for oauth. you have two options:

**option a: netlify (recommended)**

1. import your repo to [netlify](https://netlify.com)
2. in netlify dashboard: **site settings** → **access control** → **authentication**
3. enable **identity** and add **github** as an external provider
4. your `/admin` will work when visiting the netlify url (e.g. `https://yoursite.netlify.app/admin`)

you can keep using github pages for the main site and use netlify only for admin access, or host entirely on netlify.

**option b: oauth proxy**

for github pages only, you need an oauth proxy. options:

- deploy [netlify-cms-oauth-provider](https://github.com/netlify/netlify-cms-oauth-provider) to a server or serverless function
- use a community proxy service
- add `proxy_url` to `public/admin/config.yml` pointing to your proxy

### cms config

edit `public/admin/config.yml` to match your repo:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name
  branch: main
```

### what you can edit

- **blog posts** — create, edit, delete in `content/posts/`
- **resume** — edit markdown in `content/resume.md`
- **resume.pdf** — replace `public/resume.pdf` manually (upload your pdf to the repo)

## content format

### blog post frontmatter

```yaml
---
title: your post title
date: 2026-02-10
excerpt: optional short description
slug: url-slug  # optional, defaults to filename
---

your markdown content here...
```

### resume

edit `content/resume.md` directly or via the cms. the pdf at `public/resume.pdf` is linked from the resume page.

## customizing

- **site url** — update `SITE_URL` in `scripts/generate-sitemap.ts` for sitemap/robots
- **posts per page** — change `POSTS_PER_PAGE` in `app/blog/page.tsx` and `app/blog/page/[page]/page.tsx`
- **contact email** — edit `app/contact/page.tsx`
- **theme** — adjust colors in `tailwind.config.ts` and `app/globals.css`

## tech stack

- next.js 14 (app router, static export)
- typescript
- tailwind css
- gray-matter, remark, rehype (markdown)
- decap cms (git-backed cms)

## license

mit
