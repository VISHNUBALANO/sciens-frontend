'use strict';

/* ============================================
   SCIENS MEDIA COMMAND — app.js
   Frontend + Render Backend Connected
   ============================================ */

// ── CONFIG ──
const API_URL = "https://sciens-backend-1.onrender.com/api";

const CREDENTIALS = {
  username: 'sciens2026',
  password: 'vishnu2004'
};

const SESSION_KEY = 'sciens_auth';

// ── STATE ──
let currentClient = null;
let currentPlatform = null;
let currentRows = [];

// ── CLIENTS ──
const CLIENTS = [
  { id: 'mista-eats', name: 'Mista Eats', emoji: '🍽️', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  { id: 'easy-parle', name: 'Easy Parle', emoji: '💬', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  { id: 'client-focus', name: 'Client Focus', emoji: '🎯', color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  { id: 'sciens-linkedin', name: 'Sciens LinkedIn', emoji: '💼', color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' },
  { id: 'sciens-insta', name: 'Sciens Insta', emoji: '📸', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  { id: 'kidsomia', name: 'Kidsomia', emoji: '🧸', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  { id: 'manatha', name: 'Manatha', emoji: '🌿', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)' },
  { id: 'happy-homes', name: 'Happy Homes', emoji: '🏡', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
];

// ── PLATFORMS ──
const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', cls: 'platform-instagram', icon: '📸' },
  { id: 'facebook', name: 'Facebook', cls: 'platform-facebook', icon: 'f' },
  { id: 'x', name: 'X (Twitter)', cls: 'platform-x', icon: '𝕏' },
  { id: 'linkedin', name: 'LinkedIn', cls: 'platform-linkedin', icon: 'in' },
  { id: 'youtube', name: 'YouTube', cls: 'platform-youtube', icon: '▶' },
  { id: 'reddit', name: 'Reddit', cls: 'platform-reddit', icon: 'R' },
  { id: 'pinterest', name: 'Pinterest', cls: 'platform-pinterest', icon: 'P' },
];

// ── AUTH ──
function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

function handleLogin() {
  const u = document.getElementById('username')?.value.trim();
  const p = document.getElementById('password')?.value;
  const err = document.getElementById('errorMsg');
  const btn = document.getElementById('loginBtn');

  if (btn) {
    btn.innerHTML = '<span>Signing in...</span>';
    btn.disabled = true;
  }

  setTimeout(() => {
    if (u === CREDENTIALS.username && p === CREDENTIALS.password) {
      sessionStorage.setItem(SESSION_KEY, '1');
      window.location.href = 'home.html';
    } else {
      if (err) {
        err.classList.add('show');
        setTimeout(() => err.classList.remove('show'), 3000);
      } else {
        alert('Invalid credentials');
      }

      if (btn) {
        btn.innerHTML = '<span>Sign In</span>';
        btn.disabled = false;
      }
    }
  }, 500);
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

function togglePassword() {
  const inp = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');

  if (!inp) return;

  if (inp.type === 'password') {
    inp.type = 'text';
    if (icon) {
      icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    }
  } else {
    inp.type = 'password';
    if (icon) {
      icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
  }
}

// ── DATE HELPERS ──
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function greetingText() {
  const h = new Date().getHours();

  if (h < 12) return "Good morning — let's get things done.";
  if (h < 17) return "Good afternoon — keep the momentum going.";
  return "Good evening — wrapping things up?";
}

function syncDateBadge() {
  const d = new Date();

  const str = d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  ['todayBadge', 'clientDateBadge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = str;
  });
}

// ── NAVIGATION ──
function goHome() {
  currentClient = null;
  currentPlatform = null;
  currentRows = [];

  document.getElementById('homeView').style.display = 'block';
  document.getElementById('clientView').style.display = 'none';
  document.getElementById('platformView').style.display = 'none';
}

function goClient() {
  currentPlatform = null;
  currentRows = [];

  document.getElementById('homeView').style.display = 'none';
  document.getElementById('clientView').style.display = 'block';
  document.getElementById('platformView').style.display = 'none';

  renderPlatformGrid();
}

function selectClient(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  currentClient = el.dataset.client;

  const client = CLIENTS.find(c => c.id === currentClient);

  document.getElementById('clientTitle').textContent = client?.name || currentClient;
  document.getElementById('clientSub').textContent = 'Select a platform to manage content';

  document.getElementById('homeView').style.display = 'none';
  document.getElementById('clientView').style.display = 'block';
  document.getElementById('platformView').style.display = 'none';

  renderPlatformGrid();
  syncDateBadge();
}

function selectClientById(id) {
  const el = document.querySelector(`.nav-item[data-client="${id}"]`);
  if (el) selectClient(el);
}

function openPlatform(platformId) {
  currentPlatform = platformId;

  const platform = PLATFORMS.find(p => p.id === platformId);
  const client = CLIENTS.find(c => c.id === currentClient);

  document.getElementById('platformTitle').textContent = platform?.name || platformId;
  document.getElementById('platformSub').textContent = `${client?.name || currentClient} — Content Calendar`;

  document.getElementById('clientView').style.display = 'none';
  document.getElementById('platformView').style.display = 'block';

  loadRows();
}

// ── CLIENT GRID ──
function renderClientGrid() {
  const grid = document.getElementById('clientGrid');
  if (!grid) return;

  grid.innerHTML = CLIENTS.map(c => `
    <div class="client-card" onclick="selectClientById('${c.id}')">
      <div class="client-card-dot" style="background:${c.bg}">
        <span style="font-size:20px">${c.emoji}</span>
      </div>
      <div class="client-card-name">${c.name}</div>
      <div class="client-card-sub" style="color:${c.color}">VIEW PLATFORMS →</div>
      <div class="client-card-arrow">→</div>
    </div>
  `).join('');
}

// ── PLATFORM GRID ──
function renderPlatformGrid() {
  const grid = document.getElementById('platformGrid');
  if (!grid) return;

  grid.innerHTML = PLATFORMS.map(p => `
    <div class="platform-card ${p.cls}" onclick="openPlatform('${p.id}')">
      <div class="platform-icon">${p.icon}</div>
      <div class="platform-name">${p.name}</div>
    </div>
  `).join('');
}

// ── API ──
async function loadRows() {
  try {
    const tbody = document.getElementById('tableBody');

    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10">
            <div class="empty-state">
              <p>Loading data...</p>
            </div>
          </td>
        </tr>
      `;
    }

    const res = await fetch(`${API_URL}/data/${currentClient}/${currentPlatform}`);

    if (!res.ok) {
      throw new Error('Failed to fetch rows');
    }

    currentRows = await res.json();
    renderTable();

  } catch (err) {
    console.error(err);
    showToast('Failed to load data');
  }
}

async function saveRow(index) {
  const row = currentRows[index];
  if (!row) return;

  try {
    if (row._id) {
      await updateRow(index);
      return;
    }

    const res = await fetch(`${API_URL}/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...row,
        clientId: currentClient,
        platformId: currentPlatform
      })
    });

    if (!res.ok) {
      throw new Error('Save failed');
    }

    const result = await res.json();
    currentRows[index] = result.data;

    renderTable();
    showToast('Saved to MongoDB');

  } catch (err) {
    console.error(err);
    showToast('Save failed');
  }
}

async function updateRow(index) {
  const row = currentRows[index];
  if (!row) return;

  if (!row._id) {
    return saveRow(index);
  }

  try {
    const res = await fetch(`${API_URL}/data/${row._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      throw new Error('Update failed');
    }

    const result = await res.json();
    currentRows[index] = result.data;

    showToast('Updated successfully');

  } catch (err) {
    console.error(err);
    showToast('Update failed');
  }
}

async function deleteRow(id) {
  if (!id) return;

  const confirmDelete = confirm('Delete this entry?');
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/data/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      throw new Error('Delete failed');
    }

    await loadRows();
    showToast('Deleted successfully');

  } catch (err) {
    console.error(err);
    showToast('Delete failed');
  }
}

// ── TABLE ──
function renderTable() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  if (!currentRows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10">
          <div class="empty-state">
            <p>No entries yet. Click "Add Today's Entry" to get started.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = currentRows.map((row, i) => buildRowHTML(row, i)).join('');
}

function buildRowHTML(row, i) {
  const statusClass =
    row.status === 'going-to-start' ? 'status-going' :
    row.status === 'in-progress' ? 'status-progress' :
    row.status === 'completed' ? 'status-completed' : '';

  return `
    <tr data-index="${i}">
      <td>
        <input type="date" class="table-input" value="${escapeHtml(row.date || '')}" onchange="updateField(${i}, 'date', this.value)" />
      </td>

      <td>
        <select class="table-select" onchange="updateField(${i}, 'category', this.value)">
          <option value="" ${!row.category ? 'selected' : ''}>— Select —</option>
          <option value="reels" ${row.category === 'reels' ? 'selected' : ''}>Reels</option>
          <option value="poster" ${row.category === 'poster' ? 'selected' : ''}>Poster</option>
          <option value="carousel" ${row.category === 'carousel' ? 'selected' : ''}>Carousel</option>
          <option value="others" ${row.category === 'others' ? 'selected' : ''}>Others</option>
        </select>
      </td>

      <td>
        <input type="text" class="table-input" placeholder="Title..." value="${escapeHtml(row.title || '')}" oninput="updateField(${i}, 'title', this.value)" />
      </td>

      <td>
        <textarea class="table-textarea" placeholder="Content copy..." oninput="updateField(${i}, 'content', this.value)">${escapeHtml(row.content || '')}</textarea>
      </td>

      <td>
        <input type="url" class="table-input" placeholder="https://..." value="${escapeHtml(row.refLink || '')}" oninput="updateField(${i}, 'refLink', this.value)" />
      </td>

      <td>
        <input type="url" class="table-input" placeholder="https://..." value="${escapeHtml(row.finalLink || '')}" oninput="updateField(${i}, 'finalLink', this.value)" />
      </td>

      <td>
        <select class="table-select status-select ${statusClass}" onchange="updateField(${i}, 'status', this.value); renderTable();">
          <option value="" ${!row.status ? 'selected' : ''}>— Select —</option>
          <option value="going-to-start" ${row.status === 'going-to-start' ? 'selected' : ''}>Going to Start</option>
          <option value="in-progress" ${row.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
          <option value="completed" ${row.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </td>

      <td>
        <div class="qc-group">
          <label class="radio-label radio-approved">
            <input type="radio" name="qc-${i}" value="approved" ${row.qc === 'approved' ? 'checked' : ''} onchange="updateField(${i}, 'qc', 'approved')" />
            Approved
          </label>

          <label class="radio-label radio-not">
            <input type="radio" name="qc-${i}" value="not-approved" ${row.qc === 'not-approved' ? 'checked' : ''} onchange="updateField(${i}, 'qc', 'not-approved')" />
            Not Approved
          </label>
        </div>
      </td>

      <td>
        <textarea class="table-textarea" placeholder="Comments..." oninput="updateField(${i}, 'comments', this.value)">${escapeHtml(row.comments || '')}</textarea>
      </td>

      <td>
        <button class="save-btn" onclick="saveRow(${i})">
          ${row._id ? 'UPDATE' : 'SAVE'}
        </button>

        ${row._id ? `
          <button class="save-btn" style="margin-top:6px;color:#ef4444;" onclick="deleteRow('${row._id}')">
            DELETE
          </button>
        ` : ''}
      </td>
    </tr>
  `;
}

function updateField(index, field, value) {
  if (!currentRows[index]) return;
  currentRows[index][field] = value;
}

// ── ADD ROW ──
function addNewRow() {
  currentRows.unshift({
    date: todayStr(),
    category: '',
    title: '',
    content: '',
    refLink: '',
    finalLink: '',
    status: '',
    qc: '',
    comments: ''
  });

  renderTable();

  const wrapper = document.querySelector('.table-wrapper');
  if (wrapper) wrapper.scrollTop = 0;
}

// ── TOAST ──
function showToast(msg) {
  let t = document.getElementById('globalToast');

  if (!t) {
    t = document.createElement('div');
    t.id = 'globalToast';
    t.className = 'toast';
    t.innerHTML = `<span id="toastMsg"></span>`;
    document.body.appendChild(t);
  }

  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');

  setTimeout(() => {
    t.classList.remove('show');
  }, 2500);
}

// ── ESCAPE HTML ──
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── INIT ──
function init() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // home.html = dashboard
  if (page === 'home.html') {
    if (!isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    const wt = document.getElementById('welcomeText');
    if (wt) wt.textContent = greetingText();

    syncDateBadge();
    renderClientGrid();
    return;
  }

  // index.html = login page
  if (page === 'index.html' || page === '') {
    if (isLoggedIn()) {
      window.location.href = 'home.html';
      return;
    }

    document.getElementById('password')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleLogin();
    });

    document.getElementById('username')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('password')?.focus();
    });
  }
}

document.addEventListener('DOMContentLoaded', init);