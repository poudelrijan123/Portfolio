RIJAN POUDEL — PORTFOLIO V3.5 PRO

NETLIFY DEPLOY
1. Extract this ZIP.
2. In Netlify, choose Add new site > Deploy manually and drag the extracted site folder contents (index.html, portfolio.html, assets/, etc.) into the deploy area. Alternatively connect the GitHub repository and set the publish directory to the folder containing index.html.
3. In Netlify dashboard, open Forms and confirm form detection is enabled. If Netlify did not detect the form, trigger a new deploy after enabling form detection.
4. Open /portfolio.html and submit a test inquiry using an email address you control. Confirm the submission appears under Forms. Delete the test submission afterward if desired.

GITHUB PAGES
- Static pages and assets are relative-path compatible for a repository site.
- Netlify Forms will NOT process submissions on GitHub Pages. Use a separately configured form backend if hosting on GitHub Pages.

FEATURE NOTES
- Homepage intro is on index.html; Explore opens portfolio.html.
- RP favicon is favicon.svg.
- Before/after slider is a monochrome-vs-colour visual comparison, not a true original-vs-final RAW grading pair.
- Camera is FX3-inspired, not an official Sony product model. The live preview requests webcam permission only after a visitor presses START LIVE VIEW.
- Camera 3D rendering uses Three.js from jsDelivr. If blocked/offline, the page shows the supplied static camera image.

SECURITY / PRIVACY
- No API secrets are embedded.
- Inquiry form uses Netlify's honeypot spam field and browser validation. Netlify-side spam controls should remain enabled.
- Reference field accepts a URL only; no file upload endpoint is provided.
- Webcam uses video-only permission, is not recorded or uploaded by this page, and stops on page exit.
- Keep dependencies and hosting configuration updated. A static source review is not a penetration test.
