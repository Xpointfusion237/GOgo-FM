// ─── IA GOGO — ASSISTANT FLOTTANT ────────────────────────────
const GOGO_RESPONSES = {
  salut: ["Wôôô ! Salut mon ami ! Bienvenue sur GOGO FM 🎙️", "Hey hey ! Content de te voir ici ! Comment tu vas ?", "Koyako ! Tu es bien sur GOGO FM, la radio qui te parle vraiment !"],
  emission: ["Nos émissions sont incroyables ! Va voir la section Émissions 🎵", "LHD anime Le Maître des Énigmes chaque samedi à 20H ! Tu vas adorer !", "On a La Matinale, Grand Débat, Culture & Identité... Du lourd !"],
  enigme: ["LHD est le Maître des Énigmes de GOGO FM ! Chaque samedi 20H en direct 🧠", "Tu veux participer aux énigmes ? Va sur la page LHD et prépare-toi !", "Les énigmes de LHD sont légendaires ! Des récompenses jusqu'à 5 000 F !"],
  don: ["Merci de penser aux handicapés ! Va sur la page Don pour aider ❤️", "GOGO FM soutient les victimes d'accidents de la route. Chaque franc compte 🙏", "Tu peux donner depuis 500 F via Wave, Orange Money ou MTN Money ❤️"],
  boutique: ["La boutique GOGO FM c'est 🔥 ! Polos, casquettes, porte-clés...", "Commande ton merch GOGO FM ! Des articles de qualité pour les vrais fans 👕", "Va sur la page Boutique pour voir tous nos produits officiels !"],
  premium: ["Le VIP Premium c'est 2 500 F/mois — sans pub, contenus exclusifs 👑", "Avec VIP Pro tu as accès au backstage et un appel avec LHD chaque mois 💎", "Passe Premium et vis GOGO FM à 100% !"],
  stream: ["Clique sur EN DIRECT pour écouter GOGO FM maintenant 🎵", "Le stream est disponible 24h/24 ! Appuie sur le bouton PLAY en bas ▶", "GOGO FM diffuse en continu — musique, émissions, et moi GoGo ton DJ IA !"],
  default: ["Je suis GoGo, ton assistant IA sur GOGO FM ! Pose-moi n'importe quelle question 🤖", "Wôôô bonne question ! Dis-moi ce que tu cherches sur GOGO FM 🎙️", "Je suis là pour t'aider ! Parle-moi d'émissions, de dons, de la boutique ou du stream !", "Koyako ! Je suis GoGo le DJ IA. Comment je peux t'aider aujourd'hui ?"]
};

function getAIResponse(message) {
  const msg = message.toLowerCase();
  if (msg.match(/salut|bonjour|bonsoir|hello|coucou|yo|hey/)) return random(GOGO_RESPONSES.salut);
  if (msg.match(/émission|emission|show|programme|matinale|débat|debat/)) return random(GOGO_RESPONSES.emission);
  if (msg.match(/énigme|enigme|lhd|maître|maitre|jeu|quiz/)) return random(GOGO_RESPONSES.enigme);
  if (msg.match(/don|handicap|accident|aide|soutien|donner/)) return random(GOGO_RESPONSES.don);
  if (msg.match(/boutique|merch|polo|casquette|acheter|commande/)) return random(GOGO_RESPONSES.boutique);
  if (msg.match(/premium|vip|abonnement|payer|payant/)) return random(GOGO_RESPONSES.premium);
  if (msg.match(/écouter|ecouter|stream|radio|musique|play|direct/)) return random(GOGO_RESPONSES.stream);
  return random(GOGO_RESPONSES.default);
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function loadAIChat() {
  const chatHTML = `
    <style>
      /* ─── ROBOT FLOTTANT ─── */
      #ai-chat-bubble {
        position: fixed;
        right: 24px;
        bottom: 110px;
        width: 80px;
        height: 80px;
        cursor: pointer;
        z-index: 850;
        animation: robot-float 3s ease-in-out infinite;
        filter: drop-shadow(0 10px 30px rgba(245,197,24,0.5));
        transition: transform 0.3s ease;
      }
      #ai-chat-bubble:hover {
        animation: robot-float 3s ease-in-out infinite, robot-spin 1s ease-in-out;
        filter: drop-shadow(0 15px 40px rgba(255,107,0,0.7));
      }
      #ai-chat-bubble img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        animation: robot-rotate 8s linear infinite;
        transform-origin: center center;
      }
      #ai-chat-bubble:hover img {
        animation: robot-rotate-fast 0.5s linear infinite;
      }

      /* Anneau lumineux autour du robot */
      #ai-chat-bubble::before {
        content: '';
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        background: conic-gradient(
          rgba(245,197,24,0.6) 0deg,
          rgba(255,107,0,0.4) 90deg,
          rgba(245,197,24,0.1) 180deg,
          rgba(255,107,0,0.4) 270deg,
          rgba(245,197,24,0.6) 360deg
        );
        animation: ring-rotate 3s linear infinite;
        z-index: -1;
        border-radius: 50%;
        filter: blur(4px);
      }

      /* Badge notification */
      #ai-notif-dot {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 22px;
        height: 22px;
        background: linear-gradient(135deg, #ff4500, #ffd700);
        border-radius: 50%;
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        border: 2px solid #0a0a0f;
        animation: notif-pulse 1.5s ease-in-out infinite;
        z-index: 10;
      }

      /* Bulle de texte au survol */
      #ai-tooltip {
        position: absolute;
        right: 90px;
        bottom: 20px;
        background: rgba(10,10,15,0.95);
        border: 1px solid rgba(245,197,24,0.4);
        border-radius: 12px;
        padding: 8px 14px;
        font-size: 12px;
        color: var(--gold, #f5c518);
        white-space: nowrap;
        font-weight: 600;
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.3s ease;
        pointer-events: none;
        font-family: 'Rajdhani', sans-serif;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      }
      #ai-tooltip::after {
        content: '';
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        border: 4px solid transparent;
        border-left-color: rgba(245,197,24,0.4);
      }
      #ai-chat-bubble:hover #ai-tooltip {
        opacity: 1;
        transform: translateX(0);
      }

      /* ─── ANIMATIONS ─── */
      @keyframes robot-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-12px) rotate(2deg); }
        50% { transform: translateY(-6px) rotate(0deg); }
        75% { transform: translateY(-14px) rotate(-2deg); }
      }
      @keyframes robot-rotate {
        0% { filter: brightness(1) hue-rotate(0deg); }
        50% { filter: brightness(1.2) hue-rotate(10deg); }
        100% { filter: brightness(1) hue-rotate(0deg); }
      }
      @keyframes robot-rotate-fast {
        0% { filter: brightness(1.3) hue-rotate(0deg) drop-shadow(0 0 10px rgba(245,197,24,0.8)); }
        100% { filter: brightness(1.5) hue-rotate(30deg) drop-shadow(0 0 20px rgba(255,107,0,0.9)); }
      }
      @keyframes ring-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes notif-pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,69,0,0.5); }
        50% { transform: scale(1.15); box-shadow: 0 0 0 6px rgba(255,69,0,0); }
      }

      /* ─── PANEL CHAT ─── */
      #ai-chat-panel {
        position: fixed;
        right: 24px;
        bottom: 210px;
        width: 340px;
        background: rgba(10,10,15,0.98);
        border: 1px solid rgba(245,197,24,0.3);
        border-radius: 20px;
        z-index: 849;
        display: none;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(245,197,24,0.1);
        backdrop-filter: blur(20px);
        max-height: 480px;
        animation: panel-appear 0.4s cubic-bezier(0.34,1.56,0.64,1);
      }
      @keyframes panel-appear {
        from { opacity:0; transform: scale(0.8) translateY(20px); }
        to { opacity:1; transform: scale(1) translateY(0); }
      }
      #ai-chat-panel.open { display: flex; }

      .ai-chat-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(245,197,24,0.1), rgba(255,107,0,0.08));
      }
      .ai-chat-avatar-img {
        width: 44px;
        height: 44px;
        object-fit: contain;
        animation: robot-float 3s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(245,197,24,0.4));
      }
      .ai-chat-name {
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--gold, #f5c518);
      }
      .ai-chat-status {
        font-size: 0.7rem;
        color: #32cd32;
        letter-spacing: 0.5px;
      }
      .ai-chat-close {
        margin-left: auto;
        background: none;
        border: none;
        color: rgba(255,255,255,0.4);
        font-size: 1rem;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: all 0.2s;
        font-family: inherit;
      }
      .ai-chat-close:hover { color: #fff; background: rgba(255,255,255,0.08); }

      .ai-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 260px;
      }
      .ai-chat-messages::-webkit-scrollbar { width: 3px; }
      .ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(245,197,24,0.4); border-radius: 2px; }

      .ai-msg { display: flex; gap: 8px; align-items: flex-end; }
      .ai-msg-bot { flex-direction: row; }
      .ai-msg-user { flex-direction: row-reverse; }

      .ai-msg-avatar-small {
        width: 28px;
        height: 28px;
        object-fit: contain;
        flex-shrink: 0;
        filter: drop-shadow(0 2px 4px rgba(245,197,24,0.3));
      }

      .ai-msg-bubble {
        max-width: 220px;
        padding: 10px 14px;
        border-radius: 14px;
        font-size: 0.82rem;
        line-height: 1.5;
        font-family: 'Rajdhani', sans-serif;
      }
      .ai-msg-bot .ai-msg-bubble {
        background: rgba(245,197,24,0.08);
        border: 1px solid rgba(245,197,24,0.2);
        border-bottom-left-radius: 4px;
        color: #ddd;
      }
      .ai-msg-user .ai-msg-bubble {
        background: linear-gradient(135deg, rgba(255,69,0,0.2), rgba(255,140,0,0.15));
        border: 1px solid rgba(255,69,0,0.3);
        border-bottom-right-radius: 4px;
        color: #fff;
      }
      .ai-msg-user-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--orange, #ff6b00), var(--gold, #f5c518));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        flex-shrink: 0;
      }

      .ai-typing {
        display: flex;
        gap: 4px;
        padding: 10px 14px;
        background: rgba(245,197,24,0.06);
        border: 1px solid rgba(245,197,24,0.15);
        border-radius: 14px;
        border-bottom-left-radius: 4px;
        width: fit-content;
      }
      .ai-typing span {
        width: 6px; height: 6px;
        background: var(--gold, #f5c518);
        border-radius: 50%;
        animation: typing-dot 1.2s ease-in-out infinite;
      }
      .ai-typing span:nth-child(2) { animation-delay: 0.2s; }
      .ai-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typing-dot {
        0%,100% { transform: translateY(0); opacity: 0.4; }
        50% { transform: translateY(-4px); opacity: 1; }
      }

      .ai-chat-input-wrap {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .ai-chat-input-wrap input {
        flex: 1;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(245,197,24,0.2);
        border-radius: 10px;
        padding: 10px 14px;
        color: #fff;
        font-size: 0.82rem;
        outline: none;
        font-family: 'Rajdhani', sans-serif;
        transition: border-color 0.2s;
      }
      .ai-chat-input-wrap input:focus {
        border-color: rgba(245,197,24,0.5);
      }
      .ai-chat-input-wrap button {
        background: linear-gradient(135deg, var(--orange, #ff6b00), var(--gold, #f5c518));
        border: none;
        border-radius: 10px;
        padding: 10px 14px;
        color: #000;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 700;
        transition: transform 0.2s;
      }
      .ai-chat-input-wrap button:hover { transform: scale(1.05); }

      .ai-quick-btns {
        display: flex;
        gap: 6px;
        padding: 0 12px 12px;
        flex-wrap: wrap;
      }
      .ai-quick-btns button {
        background: rgba(245,197,24,0.06);
        border: 1px solid rgba(245,197,24,0.2);
        border-radius: 20px;
        padding: 5px 12px;
        color: rgba(245,197,24,0.7);
        font-size: 0.72rem;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
      }
      .ai-quick-btns button:hover {
        border-color: rgba(245,197,24,0.6);
        color: var(--gold, #f5c518);
        background: rgba(245,197,24,0.12);
      }
    </style>

    <!-- ROBOT BOUTON FLOTTANT -->
    <div id="ai-chat-bubble" onclick="toggleAIChat()" title="Parle à GoGo IA">
      <img src="images/sphere bot.png" alt="GoGo IA" />
      <div id="ai-notif-dot">1</div>
      <div id="ai-tooltip">💬 Parle à GoGo IA !</div>
    </div>

    <!-- PANEL CHAT -->
    <div id="ai-chat-panel">
      <div class="ai-chat-header">
        <img src="images/sphere bot.png" alt="GoGo" class="ai-chat-avatar-img" />
        <div>
          <div class="ai-chat-name">GoGo IA 🤖</div>
          <div class="ai-chat-status">● En ligne — DJ & Assistant GOGO FM</div>
        </div>
        <button class="ai-chat-close" onclick="toggleAIChat()">✕</button>
      </div>

      <div class="ai-chat-messages" id="ai-chat-messages">
        <div class="ai-msg ai-msg-bot">
          <img src="images/sphere bot.png" class="ai-msg-avatar-small" alt="GoGo"/>
          <div class="ai-msg-bubble">
            Wôôô ! Je suis <strong style="color:#f5c518">GoGo</strong>, ton assistant IA sur GOGO FM ! 🎙️<br><br>
            Pose-moi n'importe quelle question sur les émissions, les dons, la boutique ou le stream !
          </div>
        </div>
      </div>

      <div class="ai-chat-input-wrap">
        <input type="text" id="ai-chat-input"
          placeholder="Dis quelque chose à GoGo..."
          onkeydown="if(event.key==='Enter') sendAIMessage()" />
        <button onclick="sendAIMessage()">➤</button>
      </div>

      <div class="ai-quick-btns">
        <button onclick="quickAI('Émissions')">📻 Émissions</button>
        <button onclick="quickAI('Énigmes LHD')">🧩 LHD</button>
        <button onclick="quickAI('Faire un don')">❤️ Don</button>
        <button onclick="quickAI('Boutique')">🛍️ Shop</button>
        <button onclick="quickAI('Écouter le stream')">▶ Stream</button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = chatHTML;
  document.body.appendChild(container);
}

function toggleAIChat() {
  const panel = document.getElementById('ai-chat-panel');
  const dot = document.getElementById('ai-notif-dot');
  panel.classList.toggle('open');
  if (dot) dot.style.display = 'none';
}

function sendAIMessage() {
  const input = document.getElementById('ai-chat-input');
  const text = input.value.trim();
  if (!text) return;

  addAIMessage(text, 'user');
  input.value = '';

  const messages = document.getElementById('ai-chat-messages');
  const typing = document.createElement('div');
  typing.className = 'ai-msg ai-msg-bot';
  typing.id = 'ai-typing';
  typing.innerHTML = `
    <img src="images/sphere bot.png" class="ai-msg-avatar-small" alt="GoGo"/>
    <div class="ai-typing">
      <span></span><span></span><span></span>
    </div>
  `;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    const t = document.getElementById('ai-typing');
    if (t) t.remove();
    const response = getAIResponse(text);
    addAIMessage(response, 'bot');
  }, 1000 + Math.random() * 800);
}

function quickAI(text) {
  document.getElementById('ai-chat-input').value = text;
  sendAIMessage();
}

function addAIMessage(text, type) {
  const messages = document.getElementById('ai-chat-messages');
  const div = document.createElement('div');
  div.className = `ai-msg ai-msg-${type}`;

  if (type === 'bot') {
    div.innerHTML = `
      <img src="images/sphere bot.png" class="ai-msg-avatar-small" alt="GoGo"/>
      <div class="ai-msg-bubble">${text}</div>
    `;
  } else {
    div.innerHTML = `
      <div class="ai-msg-bubble">${text}</div>
      <div class="ai-msg-user-icon">👤</div>
    `;
  }

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  loadAIChat();
  setTimeout(() => {
    const dot = document.getElementById('ai-notif-dot');
    if (dot) dot.style.display = 'flex';
  }, 3000);
});