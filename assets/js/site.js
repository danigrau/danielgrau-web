(() => {
  const scene = document.querySelector('.hero__scene');
  const img = scene?.querySelector('img');
  const spots = [...document.querySelectorAll('.hotspot')];

  function tokenToRatio(token, fallback) {
    if (!token) return fallback;
    token = token.toLowerCase();
    if (token === 'left' || token === 'top') return 0;
    if (token === 'center') return 0.5;
    if (token === 'right' || token === 'bottom') return 1;
    if (token.endsWith('%')) return parseFloat(token.slice(0, -1)) / 100;
    return fallback;
  }

  function placeHotspots() {
    if (!scene || !img || !img.naturalWidth || !img.naturalHeight) return;

    const cw = scene.clientWidth;
    const ch = scene.clientHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const styles = getComputedStyle(img);
    const fit = styles.objectFit || 'fill';
    const position = styles.objectPosition || '50% 50%';

    let rw = cw;
    let rh = ch;

    if (fit === 'cover') {
      const scale = Math.max(cw / iw, ch / ih);
      rw = iw * scale;
      rh = ih * scale;
    } else if (fit === 'contain') {
      const scale = Math.min(cw / iw, ch / ih);
      rw = iw * scale;
      rh = ih * scale;
    }

    const tokens = position.trim().split(/\s+/);
    const xRatio = tokenToRatio(tokens[0], 0.5);
    const yRatio = tokenToRatio(tokens[1] || 'center', 0.5);

    const offsetX = (cw - rw) * xRatio;
    const offsetY = (ch - rh) * yRatio;

    const touchLike = window.matchMedia('(pointer: coarse), (max-width: 760px), (max-aspect-ratio: 5/4)').matches;
    const minTarget = touchLike ? 44 : 28;

    spots.forEach((spot) => {
      const x = Number(spot.dataset.x);
      const y = Number(spot.dataset.y);
      const baseW = Number(spot.dataset.w || 80);
      const baseH = Number(spot.dataset.h || 80);

      const renderedW = Math.max(minTarget, baseW * (rw / iw));
      const renderedH = Math.max(minTarget, baseH * (rh / ih));

      spot.style.left = `${offsetX + x * rw}px`;
      spot.style.top = `${offsetY + y * rh}px`;
      spot.style.width = `${renderedW}px`;
      spot.style.height = `${renderedH}px`;
    });
  }

  img?.addEventListener('load', placeHotspots);
  if (img?.complete) placeHotspots();

  const observer = new ResizeObserver(placeHotspots);
  if (scene) observer.observe(scene);
  window.addEventListener('orientationchange', placeHotspots);

  spots.forEach((spot) => {
    spot.addEventListener('click', () => spot.blur());
  });

  const navLinks = [...document.querySelectorAll('.site-nav__links a[href^="#"]')];
  const trackedSections = new Map(
    navLinks.map((link) => {
      const id = link.getAttribute('href').slice(1);
      return [id, document.getElementById(id)];
    }).filter(([, section]) => section)
  );

  function setActiveSection(id = null) {
    navLinks.forEach((link) => {
      const active = id && link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', Boolean(active));
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setActiveSection(link.getAttribute('href').slice(1));
    });
  });

  const homeLink = document.querySelector('.site-nav__name[href="#inicio"]');
  homeLink?.addEventListener('click', () => setActiveSection(null));

  function updateActiveFromScroll() {
    const nav = document.querySelector('.site-nav');
    const navHeight = nav?.getBoundingClientRect().height || 0;

    // Línea virtual dentro de la ventana: si cae en una de las tres secciones
    // principales, esa opción se activa. En hero o contacto, todas quedan apagadas.
    const activationY = navHeight + (window.innerHeight - navHeight) * 0.34;

    let activeId = null;
    for (const [id, section] of trackedSections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= activationY && rect.bottom > activationY) {
        activeId = id;
        break;
      }
    }
    setActiveSection(activeId);
  }

  let ticking = false;
  function scheduleActiveUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActiveFromScroll();
      ticking = false;
    });
  }

  window.addEventListener('scroll', scheduleActiveUpdate, { passive: true });
  window.addEventListener('resize', scheduleActiveUpdate);
  window.addEventListener('hashchange', scheduleActiveUpdate);
  updateActiveFromScroll();

})();
