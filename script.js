/* RIJAN POUDEL PORTFOLIO — stable layout, live motion and accessible interactions */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Leave scroll restoration to the browser. Forcing scrollTo(0,0) on reload
  // caused a visible jump when the browser restored a previous scroll position.
  if ('scrollRestoration' in history) history.scrollRestoration = 'auto';

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const nav = $('#mainNav');
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('open', open);
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }));
  document.addEventListener('click', event => {
    if (nav?.classList.contains('open') && !nav.contains(event.target) && !menuToggle?.contains(event.target)) {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Scroll reveal. Content remains visible if the API is unavailable.
  const revealItems = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  // Scroll progress, header state and back-to-top.
  const progress = $('#progressBar');
  const header = $('.header');
  const backTop = $('#backTop');
  let ticking = false;
  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    header?.classList.toggle('scrolled', window.scrollY > 24);
    backTop?.classList.toggle('show', window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScrollUI); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });
  updateScrollUI();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Subtle pointer-following light on desktop; disabled for touch/reduced motion.
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let pointerFrame = 0;
    document.addEventListener('pointermove', event => {
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
        pointerFrame = 0;
      });
    }, { passive: true });
  }


  // V3.5 — accessible section-aware navigation.
  // The current section is reflected in the desktop/mobile navigation.
  const sectionLinks = $$('#mainNav a[href^="#"]');
  const observedSections = sectionLinks
    .map(link => $(link.getAttribute('href')))
    .filter(Boolean);

  function setCurrentSection(sectionId) {
    sectionLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${sectionId}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrentSection(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    observedSections.forEach(section => sectionObserver.observe(section));
  }

  // Escape closes the mobile menu without interfering with native dialogs.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open navigation');
      menuToggle?.focus();
    }
  });

  // Photo lightbox with keyboard and swipe navigation.
  const photoButtons = $$('.work-card[data-full]');
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  let activePhoto = 0;
  function showPhoto(index) {
    if (!photoButtons.length || !lightboxImage || !lightboxCaption) return;
    activePhoto = (index + photoButtons.length) % photoButtons.length;
    const button = photoButtons[activePhoto];
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector('img')?.alt || button.dataset.title || 'Portfolio photograph';
    lightboxCaption.textContent = `${button.dataset.title || 'Photograph'} · ${button.dataset.category || ''}`;
  }
  photoButtons.forEach((button, index) => button.addEventListener('click', () => {
    showPhoto(index);
    if (lightbox && !lightbox.open) lightbox.showModal();
  }));
  $('#prevPhoto')?.addEventListener('click', () => showPhoto(activePhoto - 1));
  $('#nextPhoto')?.addEventListener('click', () => showPhoto(activePhoto + 1));
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 55) showPhoto(activePhoto + (dx < 0 ? 1 : -1));
  }, { passive: true });
  lightbox?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(activePhoto + 1);
  });

  // Gallery category filters — keep the full gallery available with one tap.
  const gallery = $('#photoGrid');
  const galleryCards = gallery ? $$('.work-card', gallery) : [];
  const galleryCount = $('#galleryCount');
  $$('.gallery-filter').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    $$('.gallery-filter').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    galleryCards.forEach(card => {
      const category = (card.dataset.category || '').toLowerCase();
      const matches = filter === 'all' ||
        (filter === 'portrait' && category.includes('portrait')) ||
        (filter === 'wedding' && (category.includes('wedding') || category.includes('detail') || category.includes('celebration'))) ||
        (filter === 'travel' && (category.includes('travel') || category.includes('landscape')));
      card.hidden = !matches;
      if (matches) visible++;
    });
    if (galleryCount) galleryCount.textContent = `${visible} ${visible === 1 ? 'photograph' : 'photographs'}`;
  }));

  // Local video modal.
  const videoModal = $('#videoModal');
  const video = $('#portfolioVideo');
  $('#playVideo')?.addEventListener('click', () => {
    if (!videoModal || !video) return;
    videoModal.showModal();
    const promise = video.play();
    if (promise?.catch) promise.catch(() => {});
  });
  videoModal?.addEventListener('close', () => { if (video) { video.pause(); video.currentTime = 0; } });
  videoModal?.addEventListener('click', event => { if (event.target === videoModal) videoModal.close(); });
  $$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog')?.close()));

  // Project inquiry: submit through Netlify Forms, with a mailto fallback on hosts
  // where the form endpoint is unavailable (prevents a dead-end 404 page).
  const inquiryForm = $('.inquiry-form');
  const inquiryStatus = $('#inquiryStatus');
  inquiryForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const submitButton = $('button[type="submit"]', inquiryForm);
    const originalButtonText = submitButton?.innerHTML || 'SEND PROJECT INQUIRY';
    const formData = new FormData(inquiryForm);
    const values = Object.fromEntries(formData.entries());
    const subject = `Project inquiry: ${values['project-type'] || 'New project'}`;
    const body = [
      `Name: ${values.name || ''}`,
      `Email: ${values.email || ''}`,
      `Project type: ${values['project-type'] || ''}`,
      `Estimated budget: ${values.budget || ''}`,
      `Deadline: ${values.deadline || ''}`,
      `Reference link: ${values['reference-link'] || ''}`,
      '',
      'Project description:',
      values.description || ''
    ].join('\n');
    const mailto = `mailto:poudelrijan865@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (values['bot-field']) return;
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'SENDING…'; }
    if (inquiryStatus) inquiryStatus.textContent = 'Sending your inquiry…';
    try {
      const response = await fetch(inquiryForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
        redirect: 'follow'
      });
      const landedOnThankYou = response.ok && new URL(response.url, window.location.href).pathname.endsWith('/thank-you.html');
      if (landedOnThankYou) {
        window.location.assign('/thank-you.html');
        return;
      }
      throw new Error(`Form endpoint returned ${response.status}`);
    } catch (error) {
      if (inquiryStatus) inquiryStatus.textContent = 'Online form is unavailable here. Your email app will open with the inquiry filled in; press Send there.';
      window.setTimeout(() => { window.location.href = mailto; }, 250);
      if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = originalButtonText; }
    }
  });

  // Scroll marker follows the reader's position down and up the page.
  const orbitDot = $('#scrollOrbitDot');
  function updateOrbit() {
    if (!orbitDot) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const track = Math.max(0, (document.querySelector('.scroll-orbit')?.clientHeight || 0) - 8);
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    orbitDot.style.transform = `translateY(${track * ratio}px)`;
  }
  window.addEventListener('scroll', updateOrbit, { passive: true });
  window.addEventListener('resize', updateOrbit, { passive: true });
  updateOrbit();

  // Offline GPT-style helper: curated answers, no API, server, or network call.
  const gptLauncher = $('#gptLauncher');
  const gptPanel = $('#gptPanel');
  const gptClose = $('#gptClose');
  const gptForm = $('#gptForm');
  const gptInput = $('#gptInput');
  const gptMessages = $('#gptMessages');
  let chatExpiry;
  function resetChatExpiry() {
    window.clearTimeout(chatExpiry);
    chatExpiry = window.setTimeout(() => {
      if (!gptMessages) return;
      gptMessages.replaceChildren();
      addChatBubble('This chat was cleared after 15 minutes of inactivity. Hello again!');
    }, 15 * 60 * 1000);
  }
  function addChatBubble(message, who='bot') {
    const p = document.createElement('p');
    p.className = `gpt-bubble${who === 'user' ? ' user' : ''}`;
    p.textContent = message;
    gptMessages?.appendChild(p);
    if (gptMessages) gptMessages.scrollTop = gptMessages.scrollHeight;
  }
  const faq = [
    {keys:['hello','hi','hey','namaste','good morning','good evening','how are you'], answer:'Hello! Welcome to the RIJAN POUDEL portfolio. What would you like to know about photography, cameras, video editing, or Rijan’s work?'},
    {keys:['what is photo','what is a photo','what is photography','photography meaning','define photography'], answer:'A photograph is an image captured by a camera or another light-sensitive device. Photography is the art and process of recording light to create pictures, tell stories, and preserve moments.'},
    {keys:['what is video','what is a video','video meaning','define video','what is videography'], answer:'A video is a sequence of moving images, usually shown with sound, that creates the feeling of motion and tells a story. Videography is the process of recording and shaping those moving images.'},
    {keys:['how camera work','how does camera work','how a camera works','camera working','camera works'], answer:'A camera works by letting light enter through its lens and reach a sensor. The sensor converts that light into digital information. The camera processes the information and saves it as a photo or video. Exposure is mainly controlled by aperture, shutter speed, and ISO.'},
    {keys:['who are you','what are you','your name','are you chatgpt'], answer:'I’m the built-in portfolio assistant for the RIJAN POUDEL website. I’m an offline helper with prepared answers about photography, cameras, video editing, and this portfolio. I’m not a live ChatGPT connection.'},
    {keys:['who is rijan','about rijan','tell me about rijan','introduce rijan','introduction of rijan','rijan poudel'], answer:'Rijan Poudel is an aspiring photographer and video editor from Nepal. He enjoys capturing natural moments, exploring places, learning visual storytelling, and creating a mood through editing and colour. His portfolio shares selected photography and video work. Tagline: “Capturing Moments. Creating Stories.”'},
    {keys:['what can you do','help','what can i ask','what do you know'], answer:'You can ask me about photography, photos, video, camera basics, exposure, composition, editing, colour grading, Rijan, the portfolio gallery, or how to contact him. I use a built-in collection of answers, so I may not know every topic.'},
    {keys:['camera lens','what is a lens','lens'], answer:'A camera lens gathers and focuses light onto the camera sensor. Different focal lengths change the angle of view and how large or close subjects appear.'},
    {keys:['types of photography','genres of photography','photography types'], answer:'Common photography genres include portrait, landscape, street, wildlife, sports, product, architecture, travel, documentary and event photography. Each genre uses light and composition a little differently.'},
    {keys:['exposure triangle','what is exposure'], answer:'The exposure triangle describes the relationship between aperture, shutter speed and ISO. Together they control brightness, while each also affects depth of field, motion or image noise.'},
    {keys:['white balance','what is wb'], answer:'White balance adjusts the colour temperature of a photo so whites look neutral under different lighting, such as daylight, shade or warm indoor bulbs.'},
    {keys:['focus','autofocus','manual focus'], answer:'Focus makes the important subject look sharp. Autofocus lets the camera choose focus automatically; manual focus lets the photographer adjust it directly.'},
    {keys:['what is bokeh','background blur','depth of field'], answer:'Bokeh describes the look of out-of-focus areas in a photograph. A wider aperture, longer focal length and suitable subject-to-background distance can create a softer background.'},
    {keys:['frame rate','fps','frames per second'], answer:'Frame rate is how many video frames are recorded or played each second. 24 fps is often used for a cinematic feel, while 30 or 60 fps can look smoother and suit different kinds of motion.'},
    {keys:['4k','uhd','video resolution','resolution'], answer:'4K UHD video is typically 3840 × 2160 pixels. Resolution describes image dimensions; good lighting, focus, movement and compression also matter to the final quality.'},
    {keys:['raw or jpeg','raw vs jpeg','what is raw','what is jpeg'], answer:'RAW files keep more unprocessed image data for editing, while JPEG files are processed and compressed by the camera and are easier to share. RAW offers more editing flexibility but uses more storage.'},
    {keys:['tripod','why use tripod'], answer:'A tripod supports the camera and helps keep framing steady. It is useful for long exposures, low-light scenes, landscapes, group photos and carefully composed video shots.'},
    {keys:['what is videography','difference photography videography','photography and videography'], answer:'Photography records a still image; videography records moving images, often with sound. Both use light, composition, timing and storytelling.'},
    {keys:['how to improve photography','photography tips','beginner photography'], answer:'Start by noticing the direction of light, keeping backgrounds uncluttered, focusing on the subject and trying different angles. Practise one skill at a time and review your photos to see what worked.'},
    {keys:['how to improve video','video tips','beginner video'], answer:'Keep shots steady, record clear sound, watch the light, use intentional framing and capture a mix of wide, medium and close-up shots. Plan a simple beginning, middle and end for the story.'},
    {keys:['iso','what is iso'], answer:'ISO describes how sensitive the camera’s sensor signal is to light. A higher ISO helps in darker scenes but can add visible image noise. Use the lowest ISO that gives you the exposure you need.'},
    {keys:['shutter speed','what is shutter'], answer:'Shutter speed is how long the camera records light for each photo. A fast shutter can freeze movement; a slower shutter can show motion blur and needs a steadier camera.'},
    {keys:['aperture','what is f stop','f-stop'], answer:'Aperture is the adjustable opening in a lens. It controls how much light enters and affects depth of field. A lower f-number means a wider opening and usually a blurrier background.'},
    {keys:['composition','rule of thirds'], answer:'Composition is how you arrange elements in a frame. A simple starting point is the rule of thirds: imagine a 3-by-3 grid and place important subjects near its lines or intersections. Also watch the background and leading lines.'},
    {keys:['editing','video editing','how edit','colour grading','color grading'], answer:'Video editing is selecting and arranging clips, trimming unwanted parts, adding sound, and shaping the pace of a story. Colour correction makes footage look balanced; colour grading adds a chosen mood or style.'},
    {keys:['portfolio','your work','gallery','photos','photographs'], answer:'Explore the Selected Frames gallery for portraits and other visual stories, visit the Film section for a featured video project, and open About to learn more about Rijan.'},
    {keys:['contact','email','instagram','hire','work with'], answer:'You can contact Rijan by email at poudelrijan865@gmail.com or through Instagram at @poudel_rijan123. Please use the Contact section for the links.'},
    {keys:['thank','thanks','thank you'], answer:'You’re welcome! Thanks for visiting the RIJAN POUDEL portfolio.'},
    {keys:['bye','goodbye','see you'], answer:'Goodbye! Thanks for stopping by, and enjoy exploring the portfolio.'}
  ];
  function getOfflineAnswer(question) {
    const q = question.toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();
    for (const item of faq) if (item.keys.some(key => q.includes(key))) return item.answer;
    return 'That’s an interesting question. I’m the portfolio’s offline assistant, so my answers are limited to common photography, camera, video-editing, and portfolio topics. Try asking “What is photography?”, “How does a camera work?”, or “Who is Rijan?”';
  }
  function sendChat(value) {
    const question = value.trim();
    if (!question) return;
    addChatBubble(question, 'user');
    addChatBubble(getOfflineAnswer(question));
    resetChatExpiry();
  }
  function toggleGPT(open) {
    if (!gptPanel || !gptLauncher) return;
    gptPanel.hidden = !open;
    gptLauncher.setAttribute('aria-expanded', String(open));
    if (open) { resetChatExpiry(); gptInput?.focus(); }
  }
  gptLauncher?.addEventListener('click', () => toggleGPT(gptPanel?.hidden));
  gptClose?.addEventListener('click', () => toggleGPT(false));
  gptForm?.addEventListener('submit', event => {
    event.preventDefault();
    const value = gptInput?.value || '';
    if (!value.trim()) return;
    sendChat(value);
    if (gptInput) gptInput.value = '';
  });
  $$('[data-gpt]').forEach(button => button.addEventListener('click', () => sendChat(button.dataset.gpt || '')));
  gptMessages?.addEventListener('click', resetChatExpiry);
  gptInput?.addEventListener('input', resetChatExpiry);

})();

// V3.5 Pro: accessible pointer/touch comparison control.
(() => {
  const frame = document.getElementById('comparisonFrame');
  const range = document.getElementById('comparisonRange');
  if (!frame || !range) return;
  const update = () => frame.style.setProperty('--split', `${range.value}%`);
  range.addEventListener('input', update, { passive: true });
  update();
})();
