(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  // Detect if we're in a known subdirectory (e.g., insights/)
  // Using explicit folder list so file:// protocol works (full filesystem paths have many segments)
  const parts = location.pathname.replace(/\/$/, '').split('/');
  const parentDir = parts[parts.length - 2] || '';
  const knownSubDirs = ['insights'];
  const inSub = knownSubDirs.includes(parentDir);
  const base = inSub ? '../' : '';
  const link = (href, label) => `<a href="${base}${href}" class="${path === href ? 'is-active' : ''}">${label}</a>`;

  const isHome = path === 'index.html' || path === '' || path === '/';
  const header = `
<header class="nav${isHome ? '' : ' nav-solid'}">
  <div class="container nav-inner">
    <a href="${base}index.html" class="logo-mark" aria-label="Vestmont — Home">
      <img src="${base}assets/vestmont-logo-white.png" alt="Vestmont" style="height:40px;width:auto;object-fit:contain;" />
    </a>
    <nav class="nav-links" id="nav-links">
      ${link('about.html', 'About')}
      ${link('capital.html', 'Capital')}
      ${link('investment-sales.html', 'Brokerage')}
      ${link('advisory.html', 'Advisory')}
      ${link('track-record.html', 'Track Record')}
      ${link('insights.html', 'Insights')}
      ${link('contact.html', 'Contact')}
      <a href="${base}start-a-deal.html" class="nav-cta">Start a Deal</a>
    </nav>
    <button class="nav-toggle" id="nav-toggle" aria-label="Menu">&#9776;</button>
  </div>
</header>
<div class="nav-backdrop" id="nav-backdrop"></div>`;

  const footer = `
<footer class="footer">
  <div class="container footer-inner">
    <div>
      <a href="${base}index.html" class="logo-mark on-dark" style="margin-bottom:16px;display:inline-block;">
        <img src="${base}assets/vestmont-logo-white.png" alt="Vestmont" style="height:50px;width:auto;object-fit:contain;" />
      </a>
      <p class="footer-tag">Commercial Real Estate, Simplified.</p>
      <p class="footer-address">Phoenix &middot; Arizona<br/>info@vestmont.com</p>
    </div>
    <div class="footer-cols">
      <div>
        <p class="footer-h">Services</p>
        <a href="${base}capital.html">Capital</a>
        <a href="${base}investment-sales.html">Investment Sales</a>
        <a href="${base}advisory.html">Advisory</a>
      </div>
      <div>
        <p class="footer-h">Firm</p>
        <a href="${base}about.html">About</a>
        <a href="${base}track-record.html">Track Record</a>
        <a href="${base}insights.html">Insights</a>
        <a href="${base}contact.html">Contact</a>
      </div>
      <div>
        <p class="footer-h">Connect</p>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://x.com" target="_blank" rel="noopener">X / Twitter</a>
      </div>
    </div>
  </div>
  <div class="container footer-legal">
    <p>&copy; <span id="yr"></span> Vestmont. All rights reserved.</p>
    <p>Vestmont Capital Inc. &mdash; AZ CMB-924849, NMLS 1045931. Vestmont Inc. &mdash; ADRE# CO648847000.</p>
  </div>
</footer>`;

  document.getElementById('site-header').outerHTML = header;
  document.getElementById('site-footer').outerHTML = footer;
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const backdrop = document.getElementById('nav-backdrop');
  const openNav = () => { links.classList.add('open'); backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeNav = () => { links.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', () => links.classList.contains('open') ? closeNav() : openNav());
  backdrop.addEventListener('click', closeNav);
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // Nav hide/show on scroll
  const nav = document.querySelector('.nav');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (y < 80) {
      nav.classList.remove('nav-hidden');
    } else if (y > lastY + 5) {
      nav.classList.add('nav-hidden');
    } else if (y < lastY - 5) {
      nav.classList.remove('nav-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Scroll reveal
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObs.observe(el));
})();
