# J0hnvexcoder Portfolio

A static, responsive portfolio for John De Joya. The site presents development, Linux, infrastructure, networking, homelab, and information security work without a framework or build step.

## Local preview

Run a static server from the repository root:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## GitHub Pages deployment

1. Push the repository to GitHub.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the branch containing the site, choose `/ (root)`, and save.
5. Confirm the published URL, then add that exact address as the canonical URL, Open Graph URL, and JSON-LD `url` in `index.html`.
6. Change the Open Graph and Twitter image values to the absolute published URL of `src/img/og/portfolio-preview.png`.

No package installation or build command is required.

## Add a project

1. Put the screenshot and optional logo in `src/img/projects/<project-name>/`.
2. Add one object to `PROJECTS_DATA` in `src/js/projects-data.js`.
3. Set its `category`, `description`, `technologies`, `status`, and available links.
4. Use `null` for unavailable links. The interface only renders actions that have a URL.
5. For a tall full-page capture, add an optimized WebP and set `scrollImage` to its path. The active carousel card will pan through it automatically and pause for user interaction.

The depth carousel, search, filters, GitHub repository list, tags, and status label render automatically. Each project also opens an accessible case-study dialog generated from its project data.

## Update portfolio information

- Personal copy, experience, services, homelab details, and contact information are in `index.html`.
- Project content and upcoming concepts are in `src/js/projects-data.js`.
- Skill names and experience levels are in `src/js/projects.js`.
- The downloadable résumé is stored at `output/pdf/john-de-joya-resume.pdf`.
- Design tokens and light/dark colors are in `src/css/variables.css`.

## Restore the previous site

The complete version from before this rebuild is stored in `backup/full-site-before-rebuild-2026-09-07/`. Copy its `index.html`, `404.html`, `README.md`, `PROJECT.md`, `src/`, `.agents/`, and `.codex/` back to the repository root to restore it.

An earlier pre-retouch snapshot is also available in `backup/pre-retouch-2026-09-07/`.
The version immediately before the animation and carousel work is in `backup/pre-animation-carousel-2026-09-07/`.

## Structure

```text
.
├── index.html
├── 404.html
├── robots.txt
├── site.webmanifest
├── PROJECT.md
└── src
    ├── css
    │   ├── variables.css
    │   ├── base.css
    │   ├── components.css
    │   ├── sections.css
    │   ├── case-studies.css
    │   ├── animations.css
    │   └── responsive.css
    ├── js
    │   ├── theme.js
    │   ├── navigation.js
    │   ├── projects-data.js
    │   ├── projects.js
    │   ├── main.js
    │   ├── command-palette.js
    │   ├── animations.js
    │   └── terminal.js
    └── img
```
