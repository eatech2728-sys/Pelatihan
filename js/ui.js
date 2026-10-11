/* Menu mengambang, jendela syarat/alur, dan notifikasi (toast). */
// ---------------------------------------------------------------
// Menu mengambang: Kontak Admin & Syarat/Alur Pendaftaran
// ---------------------------------------------------------------
function toggleFabMenu() {
  suaraKlik();
  document.getElementById('fabWrap').classList.toggle('open');
}

function bukaModalSyaratAlur() {
  document.getElementById('fabWrap').classList.remove('open');
  document.getElementById('modalSyaratAlur').classList.add('show');
  suaraBukaJendela();
}

function tutupModalSyaratAlur() {
  document.getElementById('modalSyaratAlur').classList.remove('show');
  suaraTutupJendela();
}

document.addEventListener('click', (e) => {
  const fab = document.getElementById('fabWrap');
  if (fab && fab.classList.contains('open') && !fab.contains(e.target)) {
    fab.classList.remove('open');
  }
});

document.getElementById('modalSyaratAlur').addEventListener('click', (e) => {
  if (e.target.id === 'modalSyaratAlur') tutupModalSyaratAlur();
});

function toast(type, title, msg, durasi = 4800) {
  const stack = document.getElementById('toastStack');
  if (!stack) { alert(title + (msg ? ': ' + msg : '')); return; }
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5L20 6"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>'
  };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `${icons[type] || icons.info}<div class="toast-body"><p class="toast-title">${title}</p>${msg ? `<p class="toast-msg">${msg}</p>` : ''}</div><button type="button" class="toast-close" aria-label="Tutup">&times;</button>`;
  stack.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.add('show');
    if (type === 'error') {
      el.classList.add('goyang');
      setTimeout(() => el.classList.remove('goyang'), 520);
    }
  });

  if (type === 'error') { if (/berkas|foto/i.test(title)) suaraBerkasGagal(); else mainkanSuaraGagal(); }
  else if (type === 'success') mainkanSuaraToastSukses();
  else if (type === 'warning') suaraPeringatan();
  else suaraInfo();

  const remove = () => { el.classList.add('leaving'); el.classList.remove('show'); setTimeout(() => el.remove(), 260); };
  el.querySelector('.toast-close').addEventListener('click', remove);
  if (durasi > 0) setTimeout(remove, durasi);
}
