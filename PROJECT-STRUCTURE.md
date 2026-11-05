# RIJAN POUDEL Portfolio — V3.4 source map

## Main files

- `index.html` — welcome screen and Explore entry point.
- `portfolio.html` — main portfolio page.
- `style.css` — shared styles, layout, responsive rules and camera/gallery UI.
- `welcome.css` — welcome screen styling.
- `script.js` — navigation, scroll effects, gallery filters/lightbox, video modal and offline FAQ assistant.
- `camera3d.js` — Three.js camera model, interactive rear LCD hinge and optional local webcam texture.
- `_headers` — static-host security headers; apply equivalent settings manually if your host ignores this file.
- `404.html` — custom not-found page.
- `favicon.svg` — browser tab icon.

## Assets

- `assets/images/` — portfolio photographs, thumbnail and camera reference.
- `assets/videos/` — featured video project.

## VS Code workflow

Open this folder in VS Code. Install the recommended Live Server extension, then right-click `index.html` and choose **Open with Live Server**. The welcome screen opens first; use **Explore** to open the portfolio page.

No npm install or build step is required. Three.js is imported from jsDelivr when the camera page loads, so the interactive 3D viewer needs an internet connection. The FAQ assistant itself is offline.
