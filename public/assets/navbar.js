// ─── NAVBAR COMMUNE GOGO FM ──────────────────────────────────
function loadNavbar(activePage) {
  const navHTML = `
    <div class="ad-banner-top">
      <span class="ad-label">PUBLICITÉ</span>
      <span>🏦 <strong>Banquier Swiss 🇨🇭</strong> — Votre partenaire financier de confiance.</span>
    </div>

    <nav id="navbar">
      <div class="container">
        <div class="nav-inner">

          <a href="index.html" class="nav-logo">
            <img src="images/Logo_3D.png" alt="Logo_3D FM"
              style="height:48px;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 12px rgba(245,197,24,0.5));transition:all 0.3s"
              onmouseover="this.style.filter='drop-shadow(0 0 24px rgba(255,107,0,0.8))'"
              onmouseout="this.style.filter='drop-shadow(0 0 12px rgba(245,197,24,0.5))'" />
          </a>

          <ul class="nav-menu">
            <li><a href="index.html" ${activePage==='accueil'?'style="color:var(--gold)"':''}>Accueil</a></li>
            <li><a href="emissions.html" ${activePage==='emissions'?'style="color:var(--gold)"':''}>Émissions</a></li>
            <li><a href="enigmes.html" ${activePage==='enigmes'?'style="color:var(--gold)"':''}>⭐ LHD</a></li>
            <li><a href="podcasts.html" ${activePage==='podcasts'?'style="color:var(--gold)"':''}>Podcasts</a></li>
            <li><a href="communaute.html" ${activePage==='communaute'?'style="color:var(--gold)"':''}>Communauté</a></li>
            <li><a href="don.html" ${activePage==='don'?'style="color:var(--gold)"':''} style="display:flex;align-items:center;gap:6px">
              <img src="images/love.png" style="height:20px;width:20px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(255,107,0,0.5))"/>
              Don
            </a></li>
            <li><a href="boutique.html" ${activePage==='boutique'?'style="color:var(--gold)"':''}>Boutique</a></li>
          </ul>

          <div class="nav-actions">
            <button class="btn-live-nav" onclick="activatePlayer()">EN DIRECT</button>
            <a href="premium.html" class="btn btn-outline" style="padding:8px 16px;font-size:12px">👑 Premium</a>
          </div>

          <div class="hamburger" id="hamburger" onclick="toggleMobile()">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div class="nav-mobile" id="nav-mobile">
        <a href="index.html" onclick="toggleMobile()">Accueil</a>
        <a href="emissions.html" onclick="toggleMobile()">Émissions</a>
        <a href="enigmes.html" onclick="toggleMobile()">⭐ LHD</a>
        <a href="podcasts.html" onclick="toggleMobile()">Podcasts</a>
        <a href="communaute.html" onclick="toggleMobile()">Communauté</a>
        <a href="don.html" onclick="toggleMobile()" style="display:flex;align-items:center;gap:6px">
          <img src="images/love.png" style="height:20px;width:20px;object-fit:contain"/>
          Don
        </a>
        <a href="boutique.html" onclick="toggleMobile()">Boutique</a>
        <a href="premium.html" onclick="toggleMobile()">👑 Premium</a>
        <a href="#" onclick="activatePlayer()">🔴 Écouter en direct</a>
      </div>
    </nav>
  `;
  document.getElementById('navbar-container').innerHTML = navHTML;

  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Charger Analytics
  if (!document.querySelector('script[src*="analytics.js"]')) {
    const s = document.createElement('script');
    s.src = 'assets/analytics.js';
    document.head.appendChild(s);
  }

function toggleMobile() {
  document.getElementById('hamburger').classList.toggle('active');
  document.getElementById('nav-mobile').classList.toggle('open');
}