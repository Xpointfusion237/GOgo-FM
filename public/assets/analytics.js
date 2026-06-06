// ─── GOOGLE ANALYTICS GOGO FM ────────────────────────────────
// ID: G-CT8DPHL0KS

(function() {
  // Charger le script Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-CT8DPHL0KS';
  document.head.appendChild(script);

  // Initialiser
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-CT8DPHL0KS', {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true
  });

  // ─── ÉVÉNEMENTS PERSONNALISÉS ─────────────────────────────

  // Suivre le clic sur PLAY
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('#play-btn-main');
    if (btn) {
      gtag('event', 'play_radio', {
        event_category: 'Player',
        event_label: 'Play GOGO FM Live'
      });
    }
  });

  // Suivre les dons
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[onclick*="envoyerDon"]');
    if (btn) {
      gtag('event', 'don_click', {
        event_category: 'Don',
        event_label: 'Tentative de don'
      });
    }
  });

  // Suivre les clics boutique
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[onclick*="commander"]');
    if (btn) {
      gtag('event', 'boutique_click', {
        event_category: 'Boutique',
        event_label: 'Commander un produit'
      });
    }
  });

  // Suivre les clics Premium
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[onclick*="choisirPlan"]');
    if (btn) {
      gtag('event', 'premium_click', {
        event_category: 'Premium',
        event_label: 'Choisir un plan'
      });
    }
  });

  // Suivre ouverture IA GoGo
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('#ai-chat-bubble');
    if (btn) {
      gtag('event', 'ai_chat_open', {
        event_category: 'IA GoGo',
        event_label: 'Ouverture chat IA'
      });
    }
  });

})();