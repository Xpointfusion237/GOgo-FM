// ─── CHAT TEMPS RÉEL GOGO FM — Supabase ─────────────────────
const SUPABASE_URL = 'https://cvybuxtdhmrqgbqrmvsg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2eWJ1eHRkaG1ycWdicXJtdnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzkwNTksImV4cCI6MjA5NjM1NTA1OX0.UntY-Z_LIrRtqo5M_b0oKF7QpCffE198hRRLBGBQRtI';

let supabaseClient = null;
let currentPage = 'general';
let chatUsername = null;

// ─── INITIALISER SUPABASE ────────────────────────────────────
async function initSupabase() {
  // Charger le SDK Supabase
  if (!window.supabase) {
    await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseClient;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ─── OBTENIR LE PSEUDO ───────────────────────────────────────
function getUsername() {
  if (chatUsername) return chatUsername;
  let saved = localStorage.getItem('gogofm_username');
  if (saved) {
    chatUsername = saved;
    return chatUsername;
  }
  const name = prompt('Choisis ton pseudo pour le chat GOGO FM :');
  chatUsername = name?.trim().substring(0, 20) || 'Auditeur' + Math.floor(Math.random() * 999);
  localStorage.setItem('gogofm_username', chatUsername);
  return chatUsername;
}

// ─── ENVOYER UN MESSAGE ──────────────────────────────────────
async function sendRealtimeMessage(message, page = 'general') {
  if (!supabaseClient) await initSupabase();
  const username = getUsername();

  const { error } = await supabaseClient
    .from('messages')
    .insert([{ username, message, page }]);

  if (error) {
    console.error('Erreur envoi message:', error);
    return false;
  }
  return true;
}

// ─── CHARGER LES MESSAGES RÉCENTS ───────────────────────────
async function loadRecentMessages(page = 'general', limit = 30) {
  if (!supabaseClient) await initSupabase();

  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .eq('page', page)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Erreur chargement messages:', error);
    return [];
  }
  return data || [];
}

// ─── ÉCOUTER LES NOUVEAUX MESSAGES EN TEMPS RÉEL ────────────
async function subscribeToMessages(page = 'general', onMessage) {
  if (!supabaseClient) await initSupabase();

  const channel = supabaseClient
    /**.channel(`chat-${page}`)**/
    .channel(`chat-${page}-${Math.random()}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `page=eq.${page}`
    }, (payload) => {
      onMessage(payload.new);
    })
    .subscribe();

  return channel;
}

// ─── AFFICHER UN MESSAGE DANS LE CHAT ────────────────────────
function renderMessage(msg, container, isOwn = false) {
  // Supprimer message vide
  const empty = container.querySelector('.chat-empty');
  if (empty) empty.remove();

  const time = new Date(msg.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit'
  });

  const div = document.createElement('div');
  div.style.cssText = `
    display:flex;gap:12px;
    ${isOwn ? 'flex-direction:row-reverse' : ''}
  `;

  const initial = (msg.username || 'A')[0].toUpperCase();
  const color = isOwn ? 'linear-gradient(135deg,#ff4500,#ffd700)' : 'linear-gradient(135deg,#ff6b00,#f5c518)';

  div.innerHTML = `
    <div style="width:34px;height:34px;border-radius:50%;background:${color};
      display:flex;align-items:center;justify-content:center;
      font-size:14px;font-weight:700;flex-shrink:0;font-family:'Bebas Neue',sans-serif">
      ${initial}
    </div>
    <div style="
      background:${isOwn ? 'rgba(255,69,0,0.12)' : 'rgba(255,255,255,0.04)'};
      border:1px solid ${isOwn ? 'rgba(255,69,0,0.3)' : 'rgba(255,255,255,0.08)'};
      border-radius:12px;
      ${isOwn ? 'border-bottom-right-radius:4px' : 'border-bottom-left-radius:4px'};
      padding:8px 12px;max-width:220px;
    ">
      <div style="font-size:11px;font-weight:700;color:${isOwn ? '#ff8c00' : '#ff6b00'};margin-bottom:3px">
        ${isOwn ? 'Vous' : msg.username}
        <span style="color:rgba(255,255,255,0.3);font-weight:400;margin-left:6px;font-size:10px">${time}</span>
      </div>
      <div style="font-size:13px;color:#ddd;line-height:1.4">${msg.message}</div>
    </div>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

  // Garder max 50 messages
  const msgs = container.children;
  if (msgs.length > 50) container.removeChild(msgs[0]);
}

// ─── INITIALISER LE CHAT SUR UNE PAGE ────────────────────────
async function initRealtimeChat(containerId, inputId, btnId, page = 'general') {
  currentPage = page;
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);

  if (!container || !input) return;

  // Indicateur de chargement
  container.innerHTML = '<div style="text-align:center;color:#666;padding:20px;font-size:13px">⏳ Connexion au chat...</div>';

  try {
    await initSupabase();

    // Charger messages récents
    const recent = await loadRecentMessages(page);
    container.innerHTML = '';

    if (recent.length === 0) {
      container.innerHTML = '<div class="chat-empty" style="color:#444;text-align:center;padding:20px;font-size:13px">Sois le premier à dire quelque chose 🎙️</div>';
    } else {
      recent.forEach(msg => {
        const isOwn = msg.username === localStorage.getItem('gogofm_username');
        renderMessage(msg, container, isOwn);
      });
    }

    // Écouter nouveaux messages
    await subscribeToMessages(page, (msg) => {
      const isOwn = msg.username === localStorage.getItem('gogofm_username');
      renderMessage(msg, container, isOwn);
    });

    // Envoi message
    async function sendMsg() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      await sendRealtimeMessage(text, page);
    }

    if (btn) btn.addEventListener('click', sendMsg);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMsg();
    });

    console.log('✅ Chat temps réel GOGO FM connecté !');

  } catch (err) {
    console.error('Erreur chat:', err);
    container.innerHTML = '<div style="text-align:center;color:#888;padding:20px;font-size:13px">Chat temporairement indisponible</div>';
  }
}