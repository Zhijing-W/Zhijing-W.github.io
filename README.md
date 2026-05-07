# Zhijing Wu Personal Homepage

[中文说明](README.zh-CN.md)

This repository contains the static GitHub Pages site for Zhijing Wu. It is a lightweight academic personal homepage with responsive profile layout, project and research sections, a life notes page, and a hidden content editing mode.

## Live Site

- GitHub Pages repository: `Zhijing-W/Zhijing-W.github.io`
- Site URL: `https://zhijing-w.github.io`

## What Is Included

- Responsive homepage with profile photo, education, work, projects, research, skills, and certificates.
- Separate `life.html` page for life notes, leadership, and honors.
- Clean white grid background with subtle neon-green visual accents.
- Responsive profile sidebar that keeps the photo ratio consistent across desktop, tablet, and phone widths.
- Hidden edit mode for content updates without directly editing page markup.

## Local Preview

You can open the site directly:

```bash
open index.html
```

Or run a small local server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/index.html
```

## Editing Content

Most editable text lives in:

```text
data/site-content.js
```

The page renders from this data file at runtime. This keeps the HTML structure stable and makes content updates safer.

### Hidden Edit Mode

1. Open `index.html` or the live site.
2. Click `Zhijing Wu` five times.
3. Choose a content block in the editor.
4. Edit the JSON.
5. Click `Apply Preview` to preview the change on the page.
6. Click `Save to GitHub` to update `data/site-content.js` in the repository.

### GitHub Token Safety

The site does not store a GitHub token in the repository. To save from the hidden editor, use a fine-grained GitHub token with read/write access to repository contents for this repo only. The token is kept only in the current browser tab session.

## Project Structure

```text
.
├── index.html              # Main homepage
├── life.html               # Life and notes page
├── styles.css              # Visual design and responsive layout
├── script.js               # Rendering, interactions, particles, and editor
├── data/
│   └── site-content.js     # Editable site content
├── assets/
│   ├── profile-original.jpg
│   ├── profile-960.jpg
│   └── profile-480.jpg
└── files/
    └── Wu_Zhijing_Resume.pdf
```

## Publishing

The site is published by GitHub Pages. Push changes to `main`, and GitHub Pages will deploy automatically.

```bash
git add .
git commit -m "Update personal homepage"
git push origin main
```

Deployment can take a short while. If the live site still shows an older version, wait a minute and refresh with the browser cache cleared.
