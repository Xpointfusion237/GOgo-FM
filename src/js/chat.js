// ─── CHAT ────────────────────────────────────────────────────
let username = null;

// Demander le pseudo au premier message
function getUsername() {
  if (username) return username;
  const name = prompt('Choisis ton pseudo pour le chat :');
  if (!name || name.trim() === '') {
    username = 'Auditeur' + Math.floor(Math.random() * 999);
  } else {
    username = name.trim().substring(0, 20);
  }
  return username;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  const name = getUsername();
  addChatMessage(name, text, false);
  input.value = '';

  // GoGo répond aléatoirement
  if (Math.random() < 0.25) {
    setTimeout(() => {
      const reponses = [
        `Bien dit ${name} ! 🔥`,
        `Wôôô ${name}, tu es trop fort !`,
        `GOGO FM te salue ${name} ! 🎙️`,
        `${name} est dans la place ! On vous aime !`,
        `C'est ça ${name} ! Restez avec nous !`,
      ];
      const rep = reponses[Math.floor(Math.random() * reponses.length)];
      addChatMessage('🤖 GoGo DJ', rep, true);
    }, 1500 + Math.random() * 2000);
  }
}

function addChatMessage(name, text, isAI) {
  const container = document.getElementById('chatMessages');

  // Supprimer le message vide si présent
  const empty = container.querySelector('.chat-empty');
  if (empty) empty.remove();

  const now = new Date();
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const div = document.createElement('div');
  div.className = 'chat-msg';
  if (isAI) div.style.borderLeft = '3px solid #cc44ff';

  div.innerHTML = `
    <span class="username" style="color:${isAI ? '#cc44ff' : '#ff8c00'}">${name}</span>
    <span class="time">${time}</span>
    <div class="text">${text}</div>
  `;

  container.appendChild(div);

  // Scroller vers le bas
  container.scrollTop = container.scrollHeight;

  // Garder max 50 messages
  const msgs = container.querySelectorAll('.chat-msg');
  if (msgs.length > 50) msgs[0].remove();
}

// Messages automatiques simulés pour animer le chat
const fakeUsers = ['Kouassi_237', 'Aminata🌸', 'BlackStar_CI', 'Fatou_Dakar', 'Yao_Abidjan', 'Bintou💃', 'DiazFC', 'Marlène_BF'];
const fakeMessages = [
  'GOGO FM c\'est trop 🔥',
  'Wôôô on est là !',
  'Bonne ambiance ce soir !',
  'Je suis depuis le Cameroun 🇨🇲',
  'On adore GoGo !',
  'Mettre plus de Afrobeats svp 🎵',
  'Bonjour depuis Dakar 🇸🇳',
  'La meilleure radio d\'Afrique !',
  'Wou wou wou 🎉',
  'J\'écoute depuis Paris 🇫🇷',
  'GOGO FM number one !',
  'Bonsoir à toute la famille 🙏',
];

function simulateFakeChat() {
  setInterval(() => {
    const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    const msg = fakeMessages[Math.floor(Math.random() * fakeMessages.length)];
    addChatMessage(user, msg, false);
  }, 8000 + Math.random() * 7000);
}

// Démarrer la simulation après 3 secondes
setTimeout(simulateFakeChat, 3000);