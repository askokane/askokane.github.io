# Writing a new post

1. Create `content/posts/<slug>.md` (the slug becomes the URL: `posts/<slug>.html`).
2. Add frontmatter + body:

   ```markdown
   ---
   title: my new post
   excerpt: short tagline — shown in the writing list and on the home page
   date: 2026-06-20
   ---

   your post body here. supports **bold**, *italic*, `inline code`,
   [links](https://example.com), and `## headings`.

   inline math: $e^{i\pi} + 1 = 0$

   block math:

   $$
   x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
   $$

   fenced code blocks get syntax highlighting if you tag the language, e.g. ` ```python `.

   end with a line that says exactly `ask.` if you want the signature treatment.
   ```

3. Run `npm run build` (or `node scripts/build.mjs`).

Reading time is calculated automatically from the word count (~200 words/min, minimum 1 min) —
no need to set it manually.

This regenerates:
- `posts/<slug>.html` for every post in `content/posts/`
- the "writing" list on `blog.html`
- the featured post + recent rows on `index.html`

Older placeholder entries (posts without a `.md` file yet) live in `content/legacy-posts.json` —
once you write the real post, delete its entry there and add the `.md` file instead.
