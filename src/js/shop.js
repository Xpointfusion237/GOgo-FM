// ─── BOUTIQUE GOGO FM ────────────────────────────────────────
const PRODUITS = [
  {
    nom: 'Polo Noir GOGO FM',
    prix: '5 000 FCFA',
    image: '../public/images/polo noir.png',
    emoji: '👕'
  },
  {
    nom: 'Polo Jaune GOGO FM',
    prix: '5 000 FCFA',
    image: '../public/images/polo jaune.png',
    emoji: '👕'
  },
  {
    nom: 'Casquette GOGO FM',
    prix: '3 500 FCFA',
    image: '../public/images/casquette.png',
    emoji: '🧢'
  },
  {
    nom: 'Parapluie GOGO FM',
    prix: '4 500 FCFA',
    image: '../public/images/parapluie .png',
    emoji: '☂️'
  },
  {
    nom: 'Porte-clé GOGO FM',
    prix: '1 500 FCFA',
    image: '../public/images/porte clef.png',
    emoji: '🔑'
  },
  {
    nom: 'Switch GOGO FM',
    prix: '2 500 FCFA',
    image: '../public/images/swicht.png',
    emoji: '🎮'
  }
];

function loadShop() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  grid.innerHTML = '';

  PRODUITS.forEach(produit => {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.onclick = () => commanderProduit(produit.nom, produit.prix);

    card.innerHTML = `
      <img 
        src="${produit.image}" 
        alt="${produit.nom}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
      />
      <div style="
        display:none;
        height:140px;
        align-items:center;
        justify-content:center;
        font-size:3rem;
        background:rgba(255,69,0,0.08);
      ">${produit.emoji}</div>
      <div class="shop-card-info">
        <div class="shop-card-name">${produit.nom}</div>
        <div class="shop-card-price">${produit.prix}</div>
        <button style="
          margin-top:8px;
          width:100%;
          background:linear-gradient(135deg,#ff4500,#ff8c00);
          border:none;
          border-radius:8px;
          padding:6px;
          color:#fff;
          font-weight:700;
          font-size:0.75rem;
          cursor:pointer;
        ">Commander</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function commanderProduit(nom, prix) {
  alert(`🛍️ Commande : ${nom}\n💰 Prix : ${prix}\n\n📱 Contacte-nous sur WhatsApp pour finaliser ta commande !\n\n👉 +225 XX XX XX XX`);
}

// Charger la boutique au démarrage
document.addEventListener('DOMContentLoaded', loadShop);