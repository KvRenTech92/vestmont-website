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
      <button class="nav-close" id="nav-close" aria-label="Close menu">&times;</button>
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
        <a href="https://www.linkedin.com/company/vestmont" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://x.com/Vestmont" target="_blank" rel="noopener">X / Twitter</a>
      </div>
    </div>
  </div>
  <div class="container footer-legal">
    <p>&copy; <span id="yr"></span> Vestmont. All rights reserved.</p>
    <p>Vestmont Capital Inc. &mdash; AZ Commercial Mortgage Broker License CMB-0924849 &middot; NMLS# 1045931. Vestmont Inc. &mdash; AZ Dept. of Real Estate License CO648847000.</p>
    <p style="margin-top:8px;font-size:0.68rem;color:rgba(255,255,255,0.35);max-width:900px;line-height:1.5;">All content is for informational purposes only and does not constitute investment, financial, tax, or legal advice. Nothing on this site constitutes a commitment to lend, an offer to buy or sell securities, or a solicitation of any offer. All loans and transactions are subject to underwriting approval, credit review, and market conditions. Past performance is not indicative of future results. Market data and projections are based on sources believed to be reliable but are not guaranteed.</p>
  </div>
</footer>`;

  document.getElementById('site-header').outerHTML = header;
  document.getElementById('site-footer').outerHTML = footer;
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const backdrop = document.getElementById('nav-backdrop');
  const navClose = document.getElementById('nav-close');
  const openNav = () => { links.classList.add('open'); backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeNav = () => { links.classList.remove('open'); backdrop.classList.remove('open'); document.body.style.overflow = ''; };
  toggle.addEventListener('click', () => links.classList.contains('open') ? closeNav() : openNav());
  navClose.addEventListener('click', closeNav);
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

  // Back to top button (mobile only)
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(btt);
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const bttCheck = () => {
    if (window.scrollY > 400) btt.classList.add('is-visible');
    else btt.classList.remove('is-visible');
  };
  window.addEventListener('scroll', bttCheck, { passive: true });

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
