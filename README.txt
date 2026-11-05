RIJAN POUDEL — PORTFOLIO V3.4
Capturing Moments. Creating Stories.

WHAT'S NEW IN V3.4
- Rebuilt the 3D camera as a more detailed lens-free cinema body with a sculpted grip, exposed sensor/mount, top controls, side details and rear controls.
- The rear LCD is now a physical hinged screen: rotate to the back and click/tap the LCD to swing it outward. There is no fixed popup modal.
- Optional local webcam preview can be displayed on the 3D LCD after the visitor presses START LIVE VIEW and grants browser permission.
- Added gallery filters for portraits, wedding/details and travel.
- Expanded the offline FAQ assistant with more photography and video topics.
- Added a favicon and a styled 404 page.
- Updated the Permissions-Policy so the site's own page is allowed to request camera permission.

PREVIEW ON WINDOWS
Option A — VS Code:
1. Extract the VS Code project ZIP.
2. Open the rijan-portfolio folder in Visual Studio Code.
3. Install the recommended Live Server extension if it is not already installed.
4. Right-click index.html and choose “Open with Live Server”.
5. The welcome page opens. Press EXPLORE to open portfolio.html.

Option B — Python local server:
1. Open a terminal inside the rijan-portfolio folder.
2. Run: python -m http.server 8000
3. Open http://localhost:8000 in your browser.

DEPLOYMENT
Upload the contents of the rijan-portfolio folder to your static hosting provider. Keep the assets folder and all HTML/CSS/JS files together. The _headers file is understood by some static hosts (for example, Cloudflare Pages); other hosts may require equivalent dashboard settings. Hosting-specific deployment configuration may be needed on other platforms.

NETLIFY PROJECT INQUIRY EMAIL
The project-inquiry form is configured for Netlify Forms and returns visitors to thank-you.html after submission. To receive submissions at poudelrijan865@gmail.com:
1. Deploy the full ZIP contents to the Netlify site (the HTML files and assets folder must be at the publish root).
2. In Netlify, open the site and go to Forms. Ensure form detection is enabled, then trigger a fresh deploy if you changed that setting.
3. After the form named project-inquiry appears in the Forms list, open Site configuration / Notifications (the exact menu label may vary) and add an email notification for form submissions addressed to poudelrijan865@gmail.com.
4. Submit one test inquiry and confirm it appears in Netlify Forms and arrives in the Gmail inbox (also check Spam).
Note: The recipient email is configured in Netlify, not safely embedded in static website HTML. Until the Netlify notification is added and tested, email delivery is not confirmed.

CAMERA INTERACTION
1. Drag with mouse or finger to rotate the camera body.
2. Rotate it until the rear LCD faces you.
3. Click/tap the rear LCD. The screen swings out on its hinge; click it again to fold it back.
4. Press START LIVE VIEW and grant browser permission to show the visitor's own webcam on the LCD.
5. Press STOP to stop the camera stream.

The webcam is optional. This code requests video only, not audio. It does not record or upload the webcam stream. Browser camera access requires HTTPS or localhost. The visitor's browser permission is always required.

3D ENGINE REQUIREMENT
The 3D viewer loads Three.js from jsDelivr at runtime. An internet connection is required for the full 3D model. If the CDN is blocked or unavailable, a static reference-image fallback appears and the rest of the portfolio remains usable. The uploaded reference shows only the front, so the reverse side and moving hinge are a carefully modelled interpretation, not an exact manufacturer CAD model.

OFFLINE GPT-STYLE ASSISTANT
The portfolio assistant uses prepared answers in script.js. It is not live ChatGPT and cannot answer every arbitrary question. It needs no AI server, API key or paid AI connection. Add more question patterns and answers in the faq list. Chat stays in browser memory and clears after 15 minutes of inactivity or when the tab closes. No chat messages are written to localStorage/sessionStorage or sent to an AI provider.

PROJECT STRUCTURE
index.html              Welcome / landing page
portfolio.html          Main portfolio page
style.css               Shared and portfolio styling
welcome.css             Welcome page styling
script.js               Navigation, gallery, lightbox, chat and interactions
camera3d.js             Three.js camera model, hinged LCD and webcam texture
assets/images/          Portfolio and reference images
assets/videos/          Featured video
_headers                Static-host security headers (host support varies)
favicon.svg             Browser tab icon
404.html                Not-found page

SECURITY AND PRIVACY
This is a static portfolio, not a protected application backend. Security headers are baseline hardening, not an unbreakable firewall. Do not put passwords, API keys or private credentials in public website files. The camera permission header allows camera access only to this site's own origin; microphone and geolocation remain disabled.


RIJAN POUDEL PORTFOLIO — V3.5
=============================
This GitHub Pages package is based on the supplied V3.4 deploy archive.
V3.5 keeps the existing portfolio, image/video assets, interactive camera,
gallery, lightbox, offline portfolio assistant, welcome page and contact links.

V3.5 improvements:
- Active-section navigation state for clearer orientation while scrolling.
- Escape-key support to close the mobile navigation.
- More visible keyboard focus outlines.
- Expanded reduced-motion safeguards.
- Existing static-site structure retained for GitHub Pages.

DEPLOYMENT:
1. Extract this ZIP.
2. Open the rijan-portfolio folder.
3. Upload the CONTENTS of that folder to the root of your GitHub Pages repository.
4. Keep index.html, portfolio.html, style.css, script.js, camera3d.js,
   favicon.svg, the assets folder, and 404.html together.
5. Enable GitHub Pages in repository Settings > Pages.

NOTES:
- The camera's live preview requires HTTPS and explicit browser permission.
- The portfolio assistant is offline FAQ logic, not a live AI service.
- Do not add private API keys to client-side files.

V3.5.3 UPDATES
- The main hero now features the selected outdoor portrait; the gallery retains the full supplied photo set.
- The featured video poster is an actual frame from the supplied 19.9-second vertical motion edit.
- The inquiry form attempts Netlify Forms submission and opens a prefilled email to poudelrijan865@gmail.com if the endpoint is unavailable.
- For automatic email notifications, configure Netlify Forms notification recipient as poudelrijan865@gmail.com after the first successful deploy and form detection.
