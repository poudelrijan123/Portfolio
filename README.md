# Rijan Poudel — Photography & Video Editing Portfolio

**V3.5.4 Pro** · Capturing Moments. Creating Stories.

A static HTML/CSS/JavaScript portfolio website. No build step or package installation is required.

## Preview locally

1. Extract this project.
2. Open the folder in VS Code.
3. Use the Live Server extension and open `index.html`.

Alternatively, run `python -m http.server 8000` from this folder and visit <http://localhost:8000>.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Extract this ZIP on your computer.
3. In the repository, choose **Add file → Upload files**.
4. Upload the *contents* of the extracted folder, not the ZIP file itself. Keep `index.html`, `portfolio.html`, CSS/JS files, and the `assets` folder at the repository root.
5. Commit the files.
6. Open **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**, select your main branch and `/(root)`, then save.
8. Wait for GitHub Pages to publish the site. The Pages screen will show its URL.

The included `.nojekyll` file tells GitHub Pages to serve the static project without Jekyll processing.

## Contact form note

The inquiry form is configured for Netlify Forms when deployed on Netlify. GitHub Pages does not process Netlify Forms. On GitHub Pages, the form fallback opens the visitor's default email app with the inquiry addressed to **poudelrijan865@gmail.com**; the visitor must press Send. For automatic online form submissions, deploy this project to Netlify and configure its form notification settings.

## Features

- Welcome page and portfolio page
- Responsive photo gallery and lightbox
- Featured video
- Interactive 3D camera model (Three.js loads from a CDN, so the 3D model needs an internet connection)
- Optional visitor webcam preview, requiring HTTPS/localhost and browser permission
- Offline FAQ-style portfolio assistant
- Project inquiry/contact section
- Custom favicon and 404 page

## Important files

- `index.html` — welcome page
- `portfolio.html` — main portfolio
- `style.css`, `welcome.css` — styles
- `script.js`, `welcome.js`, `camera3d.js` — interactions
- `assets/images/` — image assets
- `assets/videos/` — featured video
- `favicon.svg` — browser icon
- `404.html` — not-found page

## Privacy and security

This is a static website. Do not place passwords, private API keys, or other secrets in public files. The optional webcam preview is displayed locally in the visitor's browser; browser permission is required.

See `CHANGELOG-V3.5.4.txt` and `TEST-REPORT-V3.5.4.txt` for update notes and static checks.
