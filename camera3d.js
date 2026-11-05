// RIJAN POUDEL — detailed interactive camera body, with a physical flip-out LCD.
// Three.js is loaded dynamically so the rest of the portfolio still works if the CDN is unavailable.
const stage = document.getElementById('cameraStage');
const canvas = document.getElementById('cameraCanvas');
const glow = document.getElementById('cameraGlow');
const resetButton = document.getElementById('cameraReset');
const video = document.getElementById('webcamPreview');
const startButton = document.getElementById('startWebcam');
const stopButton = document.getElementById('stopWebcam');
const status = document.getElementById('cameraScreenStatus');
let stream = null;
let renderer = null;
let THREE = null;
let screenVideoMaterial = null;
let liveTexture = null;
let screenTarget = 0;
let animationFrame = 0;

const say = (message) => { if (status) status.textContent = message; };
function stopLiveView() {
  if (stream) stream.getTracks().forEach(track => track.stop());
  stream = null;
  if (video) video.srcObject = null;
  if (stopButton) stopButton.disabled = true;
  if (startButton) startButton.disabled = false;
  if (liveTexture) { liveTexture.dispose(); liveTexture = null; }
  if (screenVideoMaterial) { screenVideoMaterial.map = null; screenVideoMaterial.color.set(0x14212a); screenVideoMaterial.needsUpdate = true; }
  say('Live view is off. Tap START LIVE VIEW whenever you want to request camera permission.');
}
async function startLiveView() {
  if (!navigator.mediaDevices?.getUserMedia) {
    say('Live view needs HTTPS (or localhost) and a browser with camera support.');
    return;
  }
  if (startButton) startButton.disabled = true;
  say('Waiting for your browser camera permission…');
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    video.srcObject = stream;
    await video.play();
    if (stopButton) stopButton.disabled = false;
    say('Live preview is on in this tab. This portfolio does not record or upload the video.');
    if (renderer && video.readyState >= 2) {
      if (liveTexture) liveTexture.dispose();
      liveTexture = new THREE.VideoTexture(video);
      liveTexture.colorSpace = THREE.SRGBColorSpace;
      if (screenVideoMaterial) { screenVideoMaterial.map = liveTexture; screenVideoMaterial.color.set(0xffffff); screenVideoMaterial.needsUpdate = true; }
    }
  } catch (error) {
    if (startButton) startButton.disabled = false;
    const messages = {
      NotAllowedError: 'Camera permission was denied. Allow camera access in your browser settings, then try again.',
      NotFoundError: 'No camera was found on this device.',
      NotReadableError: 'The camera is busy in another app. Close that app and try again.'
    };
    say(messages[error?.name] || 'The camera could not start. Check browser permissions and try again.');
  }
}
startButton?.addEventListener('click', startLiveView);
stopButton?.addEventListener('click', stopLiveView);
window.addEventListener('pagehide', stopLiveView);

try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
} catch (error) {
  if (stage) {
    stage.classList.add('camera-fallback');
    const fallback = document.createElement('div');
    fallback.className = 'camera-fallback-card';
    const img = document.createElement('img');
    img.src = 'assets/images/camera-body-reference.webp';
    img.alt = 'Cinema camera body reference';
    const note = document.createElement('p');
    note.textContent = 'The interactive 3D viewer could not load. Check your internet connection to load the 3D engine.';
    fallback.append(img, note);
    canvas?.replaceWith(fallback);
    if (startButton) startButton.disabled = true;
    say('3D camera viewer unavailable. Live preview is disabled until the 3D viewer loads. The rest of the portfolio remains usable.');
  }
}

if (THREE && stage && canvas) {
  const scene = new THREE.Scene();
  const viewCamera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  viewCamera.position.set(4.7, 2.5, 7.9);
  viewCamera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  scene.add(new THREE.HemisphereLight(0xdce7f3, 0x15100b, 2.05));
  const key = new THREE.DirectionalLight(0xffead2, 3.1); key.position.set(4, 6, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9da8ff, 2.6); rim.position.set(-5, 2, -5); scene.add(rim);
  const fill = new THREE.PointLight(0xc5d9ee, 8, 12); fill.position.set(2, -3, 5); scene.add(fill);
  const rig = new THREE.Group(); scene.add(rig);
  const body = new THREE.Group(); rig.add(body);
  const mat = (color, roughness = .5, metalness = .3) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const graphite = mat(0x252a2e, .48, .55);
  const graphiteLight = mat(0x3a4044, .4, .62);
  const black = mat(0x080b0d, .35, .35);
  const rubber = mat(0x111416, .94, .02);
  const titanium = mat(0x9da4a8, .28, .82);
  const darkMetal = mat(0x343a3e, .3, .8);
  const screenGlass = mat(0x111a20, .18, .28);
  const sensorGlass = new THREE.MeshPhysicalMaterial({ color: 0x326b91, metalness: .48, roughness: .19, clearcoat: 1, clearcoatRoughness: .08 });
  function roundedShape(w, h, r) {
    const x = -w / 2, y = -h / 2;
    const s = new THREE.Shape();
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  }
  function roundedBlock(parent, w, h, d, radius, material, x, y, z, bevel = .045) {
    const geometry = new THREE.ExtrudeGeometry(roundedShape(w, h, radius), { depth: d, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 8 });
    geometry.translate(0, 0, -d / 2);
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  function box(parent, w, h, d, material, x, y, z, bevel = 0) {
    let geometry = new THREE.BoxGeometry(w, h, d);
    if (bevel > 0) {
      geometry.dispose();
      geometry = new THREE.ExtrudeGeometry(roundedShape(w, h, Math.min(bevel * 2, h / 3, w / 3)), { depth: d, bevelEnabled: true, bevelSegments: 2, bevelSize: bevel, bevelThickness: bevel, curveSegments: 5 });
      geometry.translate(0, 0, -d / 2);
    }
    const mesh = new THREE.Mesh(geometry, material); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  function cylinder(parent, radius, depth, material, x, y, z, axis = 'z', segments = 48) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, segments), material);
    mesh.position.set(x, y, z);
    if (axis === 'z') mesh.rotation.x = Math.PI / 2;
    if (axis === 'x') mesh.rotation.z = Math.PI / 2;
    parent.add(mesh); return mesh;
  }
  function torus(parent, radius, tube, material, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 12, 96), material);
    mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }

  // Sculpted, beveled magnesium-alloy body; front face points toward +Z.
  roundedBlock(body, 3.48, 1.96, 1.22, .22, graphite, 0, 0, 0, .075);
  // Front face panel and seams.
  roundedBlock(body, 3.34, 1.82, .035, .18, graphiteLight, 0, 0, .635, .025);
  roundedBlock(body, 3.28, 1.76, .025, .16, graphite, 0, 0, .66, .018);
  // Integrated deep grip with sculpted rubber front and fine grooves.
  roundedBlock(body, .86, 1.82, 1.32, .19, black, -1.32, -.01, .04, .09);
  roundedBlock(body, .72, 1.66, .055, .15, rubber, -1.34, -.02, .72, .035);
  for (let i = 0; i < 13; i++) {
    const groove = box(body, .52, .018, .012, mat(0x252a2c, .98, .02), -1.34, .59 - i * .095, .765, .007);
    groove.rotation.z = -.025;
  }
  // Front lens mount and attached FX-style cinema zoom lens.
  const mountX = .25, mountY = .02;
  cylinder(body, .78, .055, black, mountX, mountY, .69);
  torus(body, .704, .055, titanium, mountX, mountY, .742);
  torus(body, .635, .027, darkMetal, mountX, mountY, .758);
  torus(body, .575, .025, black, mountX, mountY, .773);
  torus(body, .525, .014, titanium, mountX, mountY, .786);
  const sensor = new THREE.Mesh(new THREE.PlaneGeometry(.70, .54), sensorGlass);
  sensor.position.set(mountX, mountY, .79); body.add(sensor);
  const sensorTint = new THREE.Mesh(new THREE.PlaneGeometry(.61, .45), new THREE.MeshBasicMaterial({ color: 0x283c89, transparent: true, opacity: .28 }));
  sensorTint.position.set(mountX, mountY, .795); body.add(sensorTint);
  // Attached lens barrel: stepped rings, focus grip and front glass.
  cylinder(body, .56, .13, black, mountX, mountY, .91, 'z', 64);
  cylinder(body, .49, .40, graphite, mountX, mountY, 1.13, 'z', 64);
  cylinder(body, .455, .045, titanium, mountX, mountY, 1.35, 'z', 64);
  cylinder(body, .43, .30, rubber, mountX, mountY, 1.52, 'z', 64);
  for (let i = 0; i < 9; i++) torus(body, .438, .012, darkMetal, mountX, mountY, 1.40 + i * .028);
  cylinder(body, .47, .075, black, mountX, mountY, 1.70, 'z', 64);
  torus(body, .43, .025, titanium, mountX, mountY, 1.745);
  const frontGlass = new THREE.Mesh(new THREE.CircleGeometry(.39, 64), new THREE.MeshPhysicalMaterial({ color: 0x163b59, metalness: .62, roughness: .12, clearcoat: 1, clearcoatRoughness: .04 }));
  frontGlass.position.set(mountX, mountY, 1.75); body.add(frontGlass);
  const glassGlint = new THREE.Mesh(new THREE.CircleGeometry(.22, 48), new THREE.MeshBasicMaterial({ color: 0x8cb7d1, transparent: true, opacity: .16 }));
  glassGlint.position.set(mountX - .10, mountY + .11, 1.755); body.add(glassGlint);
  // Mount screws and electronic contacts.
  for (let i = 0; i < 10; i++) {
    const a = i * Math.PI * 2 / 10;
    cylinder(body, .026, .018, titanium, mountX + Math.cos(a) * .68, mountY + Math.sin(a) * .68, .78, 'z', 16);
  }
  for (let i = 0; i < 8; i++) box(body, .035, .018, .012, titanium, mountX - .13 + i * .037, -.42, .79, .004);
  // Top plate, hot shoe, raised viewfinder hump, dials and shutter.
  roundedBlock(body, 1.24, .22, .46, .07, black, .18, 1.01, -.08, .025);
  box(body, .88, .045, .29, titanium, .18, 1.145, -.08, .018);
  box(body, .62, .06, .20, black, .18, 1.18, -.08, .015);
  roundedBlock(body, .62, .22, .48, .10, graphiteLight, .45, .98, -.20, .04);
  cylinder(body, .205, .12, darkMetal, -1.02, 1.06, -.15, 'y');
  cylinder(body, .16, .12, black, -1.02, 1.13, -.15, 'y');
  cylinder(body, .125, .12, titanium, -.68, 1.055, -.13, 'y');
  cylinder(body, .095, .10, black, -.68, 1.12, -.13, 'y');
  cylinder(body, .09, .10, titanium, -.25, 1.04, -.13, 'y');
  cylinder(body, .065, .09, black, -.25, 1.10, -.13, 'y');
  // Front record button and tally light.
  cylinder(body, .075, .07, black, .93, .76, .70, 'z', 32);
  cylinder(body, .035, .018, mat(0xa12d28, .4, .2), .93, .76, .75, 'z', 24);
  // Side ports, rubber covers, seams and ventilation slots.
  roundedBlock(body, .035, .88, .62, .04, black, 1.755, -.04, -.02, .012);
  for (let i = 0; i < 7; i++) box(body, .02, .035, .34, darkMetal, 1.785, .32 - i * .095, -.02, .009);
  for (let i = 0; i < 3; i++) roundedBlock(body, .045, .15, .20, .025, rubber, 1.78, -.48 - i * .20, .08, .012);
  // Rear controls and an articulated flip-out LCD. Its hinge is attached to the left edge.
  roundedBlock(body, 2.18, 1.50, .055, .12, black, .02, .015, -.64, .025);
  const screenHinge = new THREE.Group();
  screenHinge.position.set(-1.06, .02, -.69);
  body.add(screenHinge);
  roundedBlock(screenHinge, .12, 1.18, .12, .05, darkMetal, .02, 0, -.02, .025);
  const lcd = new THREE.Group();
  lcd.position.set(.06, 0, -.06);
  screenHinge.add(lcd);
  roundedBlock(lcd, 1.92, 1.18, .12, .09, black, .90, 0, -.01, .035);
  roundedBlock(lcd, 1.78, 1.04, .028, .055, titanium, .90, 0, -.085, .014);
  roundedBlock(lcd, 1.69, .95, .025, .045, screenGlass, .90, 0, -.105, .012);
  // LCD faces the rear (-Z); the video plane is mapped to the actual hinged display.
  const videoPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.61, .87), new THREE.MeshBasicMaterial({ color: 0x14212a }));
  videoPlane.position.set(.90, 0, -.121); videoPlane.rotation.y = Math.PI; lcd.add(videoPlane);
  screenVideoMaterial = videoPlane.material;
  // Handle the rare case where permission is granted before the 3D model finishes loading.
  if (stream && video.readyState >= 2) {
    liveTexture = new THREE.VideoTexture(video);
    liveTexture.colorSpace = THREE.SRGBColorSpace;
    screenVideoMaterial.map = liveTexture;
    screenVideoMaterial.color.set(0xffffff);
    screenVideoMaterial.needsUpdate = true;
  }
  // Rear buttons, joystick and menu wheel.
  cylinder(body, .075, .045, darkMetal, 1.30, .48, -.69, 'z', 32);
  cylinder(body, .055, .045, black, 1.30, .48, -.72, 'z', 32);
  cylinder(body, .095, .045, black, 1.30, -.43, -.69, 'z', 36);
  cylinder(body, .055, .045, titanium, 1.30, -.43, -.72, 'z', 32);
  for (let i = 0; i < 3; i++) box(body, .13, .035, .035, darkMetal, -1.22, .40 - i * .16, -.70, .01);
  // Base plate, battery door, tripod socket and subtle body labels.
  roundedBlock(body, 2.82, .13, .98, .06, black, 0, -1.02, -.02, .025);
  cylinder(body, .13, .055, titanium, .20, -1.10, .03, 'y');
  cylinder(body, .075, .058, black, .20, -1.14, .03, 'y');
  // Small engraved-style model label on the front.
  const labelCanvas = document.createElement('canvas'); labelCanvas.width = 512; labelCanvas.height = 128;
  const labelCtx = labelCanvas.getContext('2d'); labelCtx.fillStyle = '#d4d5d2'; labelCtx.font = '600 38px Arial'; labelCtx.fillText('FULL FRAME  /  CINEMA', 8, 76);
  const labelTexture = new THREE.CanvasTexture(labelCanvas); labelTexture.colorSpace = THREE.SRGBColorSpace;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(.78, .19), new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true }));
  label.position.set(.34, -.79, .68); body.add(label);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const defaultRotation = { x: -.08, y: -.52 };
  let rx = defaultRotation.x, ry = defaultRotation.y;
  let dragging = false, moved = false, lastX = 0, lastY = 0, lastTap = 0;
  const smooth = (a, b, t) => a + (b - a) * t;
  function resetCamera() {
    rx = defaultRotation.x; ry = defaultRotation.y; screenTarget = 0;
    if (glow) glow.style.transform = 'translate(-50%,-50%)';
  }
  resetButton?.addEventListener('click', resetCamera);
  function resize() {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, rect.width), height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    viewCamera.aspect = width / height; viewCamera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(stage); resize();
  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, viewCamera);
  }
  function clickLCD(event) {
    updatePointer(event);
    const hits = raycaster.intersectObject(videoPlane, false);
    if (hits.length) {
      screenTarget = screenTarget > .5 ? 0 : 1;
      const opening = screenTarget === 1;
      say(opening ? 'Rear monitor opened. Start live view below if you want to use your device camera.' : 'Rear monitor folded back into the camera body.');
      return true;
    }
    return false;
  }
  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    dragging = true; moved = false; lastX = event.clientX; lastY = event.clientY;
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (!dragging) return;
    const dx = event.clientX - lastX, dy = event.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
    lastX = event.clientX; lastY = event.clientY;
    ry += dx * .008; rx = Math.max(-1.05, Math.min(1.05, rx + dy * .007));
    if (glow) glow.style.transform = `translate(calc(-50% + ${-ry * 13}px),calc(-50% + ${-rx * 16}px))`;
  });
  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    if (!moved) {
      const didHit = clickLCD(event);
      const now = Date.now();
      if (!didHit && now - lastTap < 360) resetCamera();
      lastTap = now;
    }
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', () => { dragging = false; });
  stage.addEventListener('dblclick', event => { event.preventDefault(); resetCamera(); });
  stage.addEventListener('keydown', event => {
    if (event.key === 'Home') resetCamera();
    else if (event.key === 'ArrowLeft') ry -= .12;
    else if (event.key === 'ArrowRight') ry += .12;
    else if (event.key === 'ArrowUp') rx = Math.max(-1.05, rx - .1);
    else if (event.key === 'ArrowDown') rx = Math.min(1.05, rx + .1);
    else if (event.key === 'Enter' || event.key === ' ') { screenTarget = screenTarget > .5 ? 0 : 1; event.preventDefault(); }
    else return;
    event.preventDefault();
  });
  const clock = new THREE.Clock();
  function animate() {
    animationFrame = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), .05);
    rig.rotation.x = smooth(rig.rotation.x, rx, 1 - Math.exp(-dt * 12));
    rig.rotation.y = smooth(rig.rotation.y, ry, 1 - Math.exp(-dt * 12));
    screenHinge.rotation.y = smooth(screenHinge.rotation.y, screenTarget ? .98 : 0, 1 - Math.exp(-dt * 8));
    screenHinge.rotation.x = smooth(screenHinge.rotation.x, screenTarget ? .10 : 0, 1 - Math.exp(-dt * 8));
    if (liveTexture) liveTexture.needsUpdate = true;
    renderer.render(scene, viewCamera);
  }
  animate();
  window.addEventListener('pagehide', () => { cancelAnimationFrame(animationFrame); resizeObserver.disconnect(); renderer?.dispose(); });
}
