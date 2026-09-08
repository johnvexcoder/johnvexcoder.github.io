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

No package installation is required to serve the site. After changing project data, run `node scripts/build-case-studies.cjs` to regenerate the static project pages and sitemap. The no-JavaScript project directory in `index.html` should be kept in sync when adding or removing projects.

## Add a project

1. Put the screenshot and optional logo in `src/img/projects/<project-name>/`.
2. Add one object to `PROJECTS_DATA` in `src/js/projects-data.js`.
3. Set its `category`, `description`, `technologies`, `status`, and available links.
4. Use `null` for unavailable links. The interface only renders actions that have a URL.
5. For a tall full-page capture, add an optimized WebP and set `scrollImage` to its path. Visitors can opt into screenshot playback; it pauses for user interaction and respects reduced-motion preferences.

The depth carousel, search, filters, GitHub repository list, tags, and status label render automatically. Each project also opens an accessible case-study dialog generated from its project data.

## Update portfolio information

- Personal copy, experience, services, homelab details, and contact information are in `index.html`.
- Project content and upcoming concepts are in `src/js/projects-data.js`.
- Skill names and experience levels are in `src/js/projects.js`.
- The downloadable résumé is stored at `output/pdf/johnangelodejoya.pdf`.
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

## Motion, 404, and résumé maintenance

- `src/js/animations.js` coordinates directional reveals, section entry, and visibility. Decorative loops pause outside visible sections and in background tabs.
- Reduced-motion, data-saver, and low-memory preferences disable decorative motion. Data saver also uses compact project previews and skips optional GitHub statistics requests.
- The custom `404.html` uses a bounded canvas network tunnel (about 30 frames per second, capped pixel density). Its ping is a visual effect; it sends no network request. Root-relative links support missing nested URLs on this GitHub Pages user site.
- `scripts/build_resume.py` regenerates the one-page résumé with ReportLab and embedded Liberation Sans fonts. Install those fonts or update `FONT_DIR` for another system. Render and visually inspect the PDF after changing it.
- Education dates and achievements were explicitly supplied in “Check website files” and reconfirmed on September 7, 2026: degree 2024–2025; Youth Leadership Award 2024–2025; NC II Bartending 2023; NC II Bread and Pastry 2024. Retain these user-confirmed credits.
- The pre-update website and PDF are backed up locally in `backup/pre-topology-motion-2026-09-07/` in the isolated checkout. This ignored folder is not published. Copy its files back to restore the previous version.

## Local redesign review — September 2026

The local redesign uses an editorial layout, an optional depth showcase or full project grid, static case studies, and an interactive lab diagram. Education, awards, existing demos, the résumé PDF, and the animated 404 remain available. The lab diagram illustrates configuration; it is not a live monitor.

Motion uses section-specific image masks, timeline entrances, shallow portrait depth, and short interface transitions. Decorative network signals pause outside the viewport or when the tab is hidden. The Motion control, system reduced-motion setting, and data saver constrain animation. Screenshot playback is opt-in.

The contact form prepares an email in the visitor's email application; it does not send or store messages. External project services and GitHub statistics depend on their respective providers.

Before publishing, review this version locally. The redesign has not been committed or pushed. Private backups and the continuation checkpoint are under the ignored `backup/` and `tmp/` directories. Do not remove their ignore rules.
