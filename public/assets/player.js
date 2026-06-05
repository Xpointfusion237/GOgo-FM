// ─── PLAYER RADIO COMMUN GOGO FM ─────────────────────────────
const STREAM_URL = 'https://stream.zeno.fm/0r0xa792kwzuv';

let isPlaying = false;
let isMuted = false;
let listenSeconds = 0;
let listenInterval = null;
let audio = null;
let currentVolume = 70;

function loadPlayer() {
  const playerHTML = `
    <style>
      #radio-player {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 900;
        background: rgba(10,10,15,0.97);
        border-top: 1px solid rgba(245,197,24,0.25);
        backdrop-filter: blur(30px);
        padding: 0 24px;
        box-shadow: 0 -10px 40px rgba(0,0,0,0.6);
      }
      .player-inner {
        max-width: 1300px; margin: 0 auto;
        display: grid; grid-template-columns: 1fr auto 1fr;
        align-items: center; height: 80px; gap: 24px;
      }
      .player-info { display: flex; align-items: center; gap: 14px; }
      .player-artwork {
        width: 54px; height: 54px; border-radius: 50%;
        overflow: hidden; flex-shrink: 0;
        border: 2px solid rgba(245,197,24,0.4);
        box-shadow: 0 0 20px rgba(255,107,0,0.3);
        animation: rotate-slow 20s linear infinite;
      }
      .player-artwork.paused { animation-play-state: paused; }
      .player-track-name {
        font-size: 14px; font-weight: 700;
        display: flex; align-items: center; gap: 6px;
        margin-bottom: 4px; color: var(--white);
      }
      .player-show-name {
        font-size: 12px; color: var(--gray);
        display: flex; align-items: center; gap: 8px;
      }
      .player-center {
        display: flex; flex-direction: column;
        align-items: center; gap: 8px;
      }
      .player-controls {
        display: flex; align-items: center; gap: 10px;
      }

      /* ─── BOUTONS PLAYER ─── */
      .p-btn {
        width: 36px; height: 36px;
        border-radius: 50%;
        border: 1px solid rgba(255,107,0,0.3);
        background: rgba(255,107,0,0.06);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.2s;
        position: relative; overflow: hidden;
      }
      .p-btn:hover {
        border-color: var(--gold);
        background: rgba(245,197,24,0.12);
        transform: scale(1.1);
        box-shadow: 0 0 12px rgba(245,197,24,0.3);
      }
      .p-btn img {
        width: 22px; height: 22px; object-fit: contain;
      }
      .p-btn.active {
        border-color: var(--gold);
        background: rgba(245,197,24,0.15);
        box-shadow: 0 0 15px rgba(245,197,24,0.4);
      }

      /* Placeholder style quand image manquante */
      .p-btn-placeholder {
        width: 22px; height: 22px;
        display: flex; align-items: center; justify-content: center;
        font-size: 14px;
      }

      /* Bouton PLAY principal — plus grand */
      .p-btn-play {
        width: 52px; height: 52px;
        border-radius: 50%;
        border: 2px solid rgba(245,197,24,0.5);
        background: linear-gradient(135deg, rgba(255,107,0,0.2), rgba(245,197,24,0.15));
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.3s;
        box-shadow: 0 0 25px rgba(255,107,0,0.3);
      }
      .p-btn-play:hover {
        transform: scale(1.12);
        box-shadow: 0 0 40px rgba(255,107,0,0.6);
        border-color: var(--gold);
      }
      .p-btn-play img {
        width: 36px; height: 36px; object-fit: contain; border-radius: 50%;
      }

      /* EQ bars */
      .player-eq { display: flex; align-items: flex-end; gap: 2px; height: 20px; }
      .eq-b {
        width: 3px; background: linear-gradient(to top, var(--orange), var(--gold));
        border-radius: 2px; animation: eq-dance 0.6s ease-in-out infinite alternate;
      }
      .eq-b:nth-child(1){height:30%;animation-delay:0s}
      .eq-b:nth-child(2){height:80%;animation-delay:0.1s}
      .eq-b:nth-child(3){height:55%;animation-delay:0.2s}
      .eq-b:nth-child(4){height:100%;animation-delay:0.05s}
      .eq-b:nth-child(5){height:65%;animation-delay:0.15s}
      @keyframes eq-dance { 0%{transform:scaleY(0.3)} 100%{transform:scaleY(1)} }

      /* Droite */
      .player-right {
        display: flex; align-items: center;
        justify-content: flex-end; gap: 14px;
      }
      .volume-wrap { display: flex; align-items: center; gap: 8px; }
      .volume-icon { font-size: 16px; color: var(--gray); }
      .volume-slider {
        -webkit-appearance: none; width: 90px; height: 4px;
        background: linear-gradient(90deg, var(--orange) 70%, rgba(255,255,255,0.15) 70%);
        border-radius: 2px; outline: none; cursor: pointer;
      }
      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 14px; height: 14px;
        background: var(--gold); border-radius: 50%;
        box-shadow: 0 0 6px rgba(245,197,24,0.5);
      }
      .listen-time {
        font-family: var(--font-tech); font-size: 11px;
        color: var(--gray); letter-spacing: 1px;
      }
      .share-btn {
        padding: 6px 14px; border-radius: 6px;
        border: 1px solid var(--glass-border); color: var(--gray);
        font-size: 12px; font-weight: 600; letter-spacing: 1px;
        transition: all 0.2s; background: var(--glass); cursor: pointer;
        font-family: var(--font-body);
      }
      .share-btn:hover { border-color: var(--gold); color: var(--gold); }

      @keyframes rotate-slow { 100%{transform:rotate(360deg)} }

      @media (max-width: 768px) {
        .player-inner { grid-template-columns: 1fr auto; }
        .player-right { display: none; }
      }
    </style>

    <div id="radio-player">
      <div class="player-inner">

        <!-- INFO PISTE -->
        <div class="player-info">
          <div class="player-artwork paused" id="player-artwork">
            <img src="images/logo_3D.png" alt="GOGO FM"
              style="width:100%;height:100%;object-fit:contain"/>
          </div>
          <div class="player-track">
            <div class="player-track-name">
              <img src="images/logo_3D.png" alt="GOGO FM"
                style="height:18px;object-fit:contain;border-radius:50%"/>
              Live Stream
            </div>
            <div class="player-show-name">
              <span class="badge-live">LIVE</span>
              <span id="show-name">La radio qui te parle vraiment</span>
            </div>
          </div>
        </div>

        <!-- CONTROLES -->
        <div class="player-center">
          <div class="player-controls">

            <!-- VOLUME - -->
            <button class="p-btn" title="Volume -" onclick="volumeDown()">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="url(#gv1)"/>
                <line x1="14" y1="12" x2="19" y2="12" stroke="url(#gv1)" stroke-width="2" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="gv1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#f5c518"/><stop offset="1" stop-color="#ff4500"/>
                  </linearGradient>
                </defs>
              </svg>
            </button>

            <!-- MUTE MIC -->
            <button class="p-btn" id="mute-btn" title="Mute micro" onclick="toggleMute()">
              <img src="images/mic_mute.png" id="mute-icon"
                style="width:22px;height:22px;object-fit:contain;opacity:0.5;transition:opacity 0.2s"/>
            </button>

            <!-- PLAY / PAUSE — bouton principal -->
            <button class="p-btn-play" id="play-btn-main" onclick="togglePlay()">
              <img src="images/play.png" id="play-icon"
                style="width:36px;height:36px;object-fit:contain;border-radius:50%"/>
            </button>

            <!-- VOLUME + -->
            <button class="p-btn" title="Volume +" onclick="volumeUp()">
              <img src="images/volume.png"
                style="width:22px;height:22px;object-fit:contain"/>
            </button>

            <!-- VOLUME MUTE (sourdine totale) -->
            <button class="p-btn" id="vol-mute-btn" title="Sourdine" onclick="toggleVolMute()">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="url(#gv2)" opacity="0.5"/>
                <line x1="14" y1="9" x2="20" y2="15" stroke="url(#gv2)" stroke-width="2" stroke-linecap="round"/>
                <line x1="20" y1="9" x2="14" y2="15" stroke="url(#gv2)" stroke-width="2" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="gv2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#f5c518"/><stop offset="1" stop-color="#ff4500"/>
                  </linearGradient>
                </defs>
              </svg>
            </button>

            <!-- PARTAGER -->
            <button class="p-btn" title="Partager" onclick="partager()">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="2.5" stroke="url(#gs1)" stroke-width="1.5"/>
                <circle cx="6" cy="12" r="2.5" stroke="url(#gs1)" stroke-width="1.5"/>
                <circle cx="18" cy="19" r="2.5" stroke="url(#gs1)" stroke-width="1.5"/>
                <line x1="8.4" y1="10.7" x2="15.6" y2="6.3" stroke="url(#gs1)" stroke-width="1.5"/>
                <line x1="8.4" y1="13.3" x2="15.6" y2="17.7" stroke="url(#gs1)" stroke-width="1.5"/>
                <defs>
                  <linearGradient id="gs1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#f5c518"/><stop offset="1" stop-color="#ff4500"/>
                  </linearGradient>
                </defs>
              </svg>
            </button>

          </div>

          <!-- EQ BARS -->
          <div class="player-eq" id="player-eq" style="display:none">
            <div class="eq-b"></div>
            <div class="eq-b"></div>
            <div class="eq-b"></div>
            <div class="eq-b"></div>
            <div class="eq-b"></div>
          </div>
        </div>

        <!-- DROITE -->
        <div class="player-right">
          <div class="volume-wrap">
            <span class="volume-icon">🔊</span>
            <input type="range" class="volume-slider" min="0" max="100" value="70"
              oninput="updateVolume(this.value)">
          </div>
          <div class="listen-time" id="listen-time">00:00:00</div>
          <button class="share-btn" onclick="partager()">Partager ↗</button>
        </div>

      </div>
    </div>

    <!-- BOUTON FLOTTANT LIVE -->
    <div class="floating-live" onclick="activatePlayer()">EN DIRECT</div>

    <!-- AUDIO -->
    <audio id="radio-audio" preload="none"></audio>
  `;

  document.getElementById('player-container').innerHTML = playerHTML;
  audio = document.getElementById('radio-audio');
}

// ─── PLAY / PAUSE ────────────────────────────────────────────
function activatePlayer() {
  if (!isPlaying) togglePlay();
}

function togglePlay() {
  isPlaying = !isPlaying;
  const playIcon = document.getElementById('play-icon');
  const artwork = document.getElementById('player-artwork');
  const eq = document.getElementById('player-eq');

  if (isPlaying) {
    audio.src = STREAM_URL;
    audio.volume = currentVolume / 100;
    audio.play().catch(() => {
      isPlaying = false;
      if (playIcon) playIcon.src = 'images/play.png';
    });
    if (playIcon) playIcon.src = 'images/pause.png';
    artwork.classList.remove('paused');
    eq.style.display = 'flex';
    listenInterval = setInterval(() => {
      listenSeconds++;
      const h = String(Math.floor(listenSeconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((listenSeconds % 3600) / 60)).padStart(2, '0');
      const s = String(listenSeconds % 60).padStart(2, '0');
      const el = document.getElementById('listen-time');
      if (el) el.textContent = `${h}:${m}:${s}`;
    }, 1000);
  } else {
    audio.pause();
    audio.src = '';
    if (playIcon) playIcon.src = 'images/play.png';
    artwork.classList.add('paused');
    eq.style.display = 'none';
    clearInterval(listenInterval);
  }
}

// ─── VOLUME ──────────────────────────────────────────────────
function updateVolume(val) {
  currentVolume = parseInt(val);
  if (audio) audio.volume = currentVolume / 100;
  const slider = document.querySelector('.volume-slider');
  if (slider) {
    slider.style.background = `linear-gradient(90deg, var(--orange) ${val}%, rgba(255,255,255,0.15) ${val}%)`;
  }
}

function volumeDown() {
  const slider = document.querySelector('.volume-slider');
  if (slider) {
    slider.value = Math.max(0, parseInt(slider.value) - 10);
    updateVolume(slider.value);
  }
}

function volumeUp() {
  const slider = document.querySelector('.volume-slider');
  if (slider) {
    slider.value = Math.min(100, parseInt(slider.value) + 10);
    updateVolume(slider.value);
  }
}

// MUTE MIC
let isMicMuted = false;
function toggleMute() {
  isMicMuted = !isMicMuted;
  const muteIcon = document.getElementById('mute-icon');
  const muteBtn = document.getElementById('mute-btn');
  if (isMicMuted) {
    if (muteIcon) muteIcon.style.opacity = '1';
    if (muteBtn) muteBtn.classList.add('active');
  } else {
    if (muteIcon) muteIcon.style.opacity = '0.5';
    if (muteBtn) muteBtn.classList.remove('active');
  }
}

// VOLUME MUTE TOTAL
let isVolMuted = false;
let savedVolume = 70;
function toggleVolMute() {
  isVolMuted = !isVolMuted;
  const btn = document.getElementById('vol-mute-btn');
  const slider = document.querySelector('.volume-slider');
  if (isVolMuted) {
    savedVolume = currentVolume;
    if (audio) audio.volume = 0;
    if (slider) { slider.value = 0; updateVolume(0); }
    if (btn) btn.classList.add('active');
  } else {
    currentVolume = savedVolume;
    if (audio) audio.volume = savedVolume / 100;
    if (slider) { slider.value = savedVolume; updateVolume(savedVolume); }
    if (btn) btn.classList.remove('active');
  }
}

// ─── PARTAGER ────────────────────────────────────────────────
function partager() {
  if (navigator.share) {
    navigator.share({
      title: 'GOGO FM',
      text: 'J\'écoute GOGO FM — La radio qui te parle vraiment !',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien copié ! Partage GOGO FM avec tes amis 🎙️');
  }
}