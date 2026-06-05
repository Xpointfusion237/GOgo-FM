// ─── CONFIG ──────────────────────────────────────────────────
const CONFIG = {
  streamUrl: 'https://stream.zeno.fm/0r0xa792kwzuv', // stream gratuit test
  aiMessages: [
    "Wôôô ! On est en feu ce soir mes amis ! 🔥",
    "GOGO FM, la radio qui te parle vraiment ! Restez avec nous !",
    "Vous êtes combien à écouter là ? Dites-le dans le chat !",
    "Le prochain qui répond à l'énigme gagne des crédits GOGO ! 🎁",
    "Koyako ! On enchaîne avec du lourd, restez connectés !",
    "Merci à tous nos auditeurs depuis la Côte d'Ivoire et partout en Afrique ! 🌍",
    "GOGO FM — 24h/24, 7j/7, toujours là pour vous ! 🎙️",
    "Envoyez vos dédicaces dans le chat, GoGo vous lit tout !",
  ]
};

// ─── PLAYER ──────────────────────────────────────────────────
let isPlaying = false;
const audio = document.getElementById('radioAudio');
const playBtn = document.getElementById('playBtn');

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    audio.src = '';
    playBtn.textContent = '▶ Écouter';
    playBtn.classList.remove('playing');
    isPlaying = false;
  } else {
    audio.src = CONFIG.streamUrl;
    audio.volume = parseFloat(document.getElementById('volumeSlider').value);
    audio.play()
      .then(() => {
        playBtn.textContent = '⏸ Pause';
        playBtn.classList.add('playing');
        isPlaying = true;
        startAIMessages();
        simulateListeners();
      })
      .catch(err => {
        console.error('Erreur stream:', err);
        playBtn.textContent = '▶ Écouter';
      });
  }
}

function setVolume(val) {
  audio.volume = parseFloat(val);
}

// ─── COMPTEUR AUDITEURS ──────────────────────────────────────
function simulateListeners() {
  let count = Math.floor(Math.random() * 50) + 10;
  document.getElementById('listenerCount').textContent = `🎧 ${count} auditeurs`;

  setInterval(() => {
    count += Math.floor(Math.random() * 5) - 2;
    count = Math.max(5, count);
    document.getElementById('listenerCount').textContent = `🎧 ${count} auditeurs`;
  }, 8000);
}

// ─── MESSAGES IA GOGO ────────────────────────────────────────
let aiInterval = null;

function startAIMessages() {
  if (aiInterval) return;
  showAIMessage();
  aiInterval = setInterval(showAIMessage, 30000); // toutes les 30s
}

function showAIMessage() {
  const msg = CONFIG.aiMessages[Math.floor(Math.random() * CONFIG.aiMessages.length)];
  const box = document.getElementById('aiMessage');
  const text = document.getElementById('aiText');

  text.textContent = msg;
  box.style.display = 'flex';

  // Ajouter aussi dans le chat comme message de GoGo
  addChatMessage('🤖 GoGo DJ', msg, true);

  // Cacher après 10 secondes
  setTimeout(() => {
    box.style.display = 'none';
  }, 10000);
}

// ─── ENIGMES ─────────────────────────────────────────────────
const ENIGMES = [
  {
    question: "Je suis la capitale de la Côte d'Ivoire politique. Qui suis-je ?",
    answer: "yamoussoukro",
    prize: 50
  },
  {
    question: "Quel artiste ivoirien a popularisé le Coupé-Décalé ?",
    answer: "douk saga",
    prize: 75
  },
  {
    question: "Combien de pays composent l'Afrique de l'Ouest ?",
    answer: "15",
    prize: 60
  },
  {
    question: "Quel est le vrai prénom d'Arafat DJ ?",
    answer: "ange didier",
    prize: 80
  },
  {
    question: "Dans quel pays se trouve le mont Kilimandjaro ?",
    answer: "tanzanie",
    prize: 55
  }
];

let currentEnigma = null;
let enigmaTimeout = null;

function launchEnigma() {
  const enigma = ENIGMES[Math.floor(Math.random() * ENIGMES.length)];
  currentEnigma = enigma;

  document.getElementById('enigmaQuestion').textContent = enigma.question;
  document.getElementById('enigmaPrize').textContent = `🏆 ${enigma.prize} crédits GOGO en jeu !`;
  document.getElementById('enigmaResult').textContent = '';
  document.getElementById('enigmaInput').value = '';
  document.getElementById('enigmaBox').style.display = 'flex';

  addChatMessage('🧩 LHD', `Nouvelle énigme ! ${enigma.question} — ${enigma.prize} crédits en jeu !`, true);

  // Fermer après 2 minutes
  enigmaTimeout = setTimeout(() => {
    document.getElementById('enigmaResult').textContent =
      `⏰ Temps écoulé ! La réponse était : ${enigma.answer}`;
    setTimeout(() => {
      document.getElementById('enigmaBox').style.display = 'none';
    }, 4000);
    currentEnigma = null;
  }, 120000);
}

function sendAnswer() {
  if (!currentEnigma) return;

  const input = document.getElementById('enigmaInput');
  const answer = input.value.trim().toLowerCase();
  const correct = currentEnigma.answer.toLowerCase();
  const result = document.getElementById('enigmaResult');

  if (!answer) return;

  if (answer === correct || correct.includes(answer)) {
    result.style.color = '#32cd32';
    result.textContent = `🎉 BRAVO ! Bonne réponse ! Tu gagnes ${currentEnigma.prize} crédits !`;
    addChatMessage('🧩 LHD', `🎉 Félicitations ! La réponse était bien "${currentEnigma.answer}" !`, true);
    clearTimeout(enigmaTimeout);
    currentEnigma = null;
    setTimeout(() => {
      document.getElementById('enigmaBox').style.display = 'none';
    }, 5000);
  } else {
    result.style.color = '#ff4444';
    result.textContent = '❌ Mauvaise réponse, réessaie !';
    input.value = '';
  }
}

// Lancer une énigme toutes les 10 minutes
setInterval(() => {
  if (!currentEnigma) launchEnigma();
}, 600000);

// Première énigme après 2 minutes
setTimeout(() => {
  if (!currentEnigma) launchEnigma();
}, 120000);