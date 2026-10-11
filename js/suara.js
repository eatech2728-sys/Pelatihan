/* Semua efek suara notifikasi (Web Audio) + tombol bisukan. */
// ---------------------------------------------------------------
// Efek suara notifikasi — dibuat langsung pakai Web Audio API
// (bukan file audio eksternal), supaya tidak perlu hosting file
// suara terpisah dan tetap ringan/instan.
// ---------------------------------------------------------------
let suaraAktif = true;
try { if (localStorage.getItem('pelatihan_suara_aktif') === '0') suaraAktif = false; } catch (e) {}
let _audioCtx = null;
function ambilAudioCtx() {
  if (!_audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _audioCtx = new AC();
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function mainkanNada(frekuensi, waktuMulai, durasi, volume, tipeGelombang) {
  if (!suaraAktif) return;
  const ctx = ambilAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = tipeGelombang || 'sine';
  osc.frequency.value = frekuensi;
  osc.connect(gain);
  gain.connect(ctx.destination);

  const mulai = ctx.currentTime + waktuMulai;
  gain.gain.setValueAtTime(0, mulai);
  gain.gain.linearRampToValueAtTime(volume, mulai + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, mulai + durasi);

  osc.start(mulai);
  osc.stop(mulai + durasi + 0.05);
}

function mainkanSuaraSukses() {
  try {
    mainkanNada(523.25, 0, 0.16, 0.16, 'sine');   // C5
    mainkanNada(659.25, 0.12, 0.16, 0.16, 'sine'); // E5
    mainkanNada(783.99, 0.24, 0.30, 0.18, 'sine'); // G5
  } catch (e) { /* abaikan kalau browser tidak mendukung */ }
}

function mainkanSuaraToastSukses() {
  try {
    mainkanNada(587.33, 0, 0.14, 0.13, 'sine');
    mainkanNada(880, 0.09, 0.18, 0.13, 'sine');
  } catch (e) { /* abaikan */ }
}

function mainkanSuaraGagal() {
  try {
    mainkanNada(220, 0, 0.16, 0.14, 'triangle');
    mainkanNada(174.61, 0.14, 0.22, 0.14, 'triangle');
  } catch (e) { /* abaikan */ }
}

// ---------------------------------------------------------------
// Pustaka efek suara tambahan (berkas, kirim, info, peringatan, dll.)
// ---------------------------------------------------------------
function luncurSuara(f1, f2, durasi, volume, tipe) {
  try {
    if (!suaraAktif) return;
    const c = ambilAudioCtx(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = tipe || 'sine';
    const m = c.currentTime;
    o.frequency.setValueAtTime(f1, m);
    o.frequency.exponentialRampToValueAtTime(f2, m + durasi);
    g.gain.setValueAtTime(0.0001, m);
    g.gain.exponentialRampToValueAtTime(volume, m + durasi * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, m + durasi + 0.08);
    o.connect(g); g.connect(c.destination);
    o.start(m); o.stop(m + durasi + 0.12);
  } catch (e) {}
}

// Berkas berhasil dipilih/diunggah: "ting-ting-ting" naik, cerah
function suaraBerkasBerhasil() {
  try {
    mainkanNada(880, 0, 0.12, 0.12, 'sine');
    mainkanNada(1108.7, 0.07, 0.12, 0.12, 'sine');
    mainkanNada(1318.5, 0.14, 0.26, 0.13, 'sine');
    mainkanNada(659.25, 0, 0.30, 0.05, 'triangle');
  } catch (e) {}
}

// Mulai mengompres foto: "bip" lembut dua kali
function suaraBerkasProses() {
  try {
    mainkanNada(698.46, 0, 0.08, 0.08, 'triangle');
    mainkanNada(880, 0.1, 0.1, 0.08, 'triangle');
  } catch (e) {}
}

// Berkas ditolak / gagal: dengung rendah turun
function suaraBerkasGagal() {
  try {
    mainkanNada(233.08, 0, 0.14, 0.12, 'square');
    mainkanNada(185.0, 0.13, 0.14, 0.12, 'square');
    mainkanNada(138.59, 0.26, 0.34, 0.13, 'square');
  } catch (e) {}
}

// Mulai mengirim data: whoosh naik
function suaraKirim() {
  luncurSuara(260, 1200, 0.45, 0.07, 'triangle');
  try { mainkanNada(1567.98, 0.42, 0.12, 0.05, 'sine'); } catch (e) {}
}

// Notifikasi informasi: lonceng lembut
function suaraInfo() {
  try {
    mainkanNada(987.77, 0, 0.35, 0.10, 'sine');
    mainkanNada(1318.5, 0.12, 0.45, 0.08, 'sine');
  } catch (e) {}
}

// Peringatan: dua nada sama berurutan
function suaraPeringatan() {
  try {
    mainkanNada(659.25, 0, 0.13, 0.13, 'triangle');
    mainkanNada(659.25, 0.18, 0.2, 0.13, 'triangle');
  } catch (e) {}
}

// Koneksi terputus (turun) / tersambung kembali (naik)
function suaraOffline() {
  try {
    mainkanNada(440, 0, 0.14, 0.12, 'triangle');
    mainkanNada(329.63, 0.13, 0.14, 0.12, 'triangle');
    mainkanNada(246.94, 0.26, 0.3, 0.12, 'triangle');
  } catch (e) {}
}
function suaraOnline() {
  try {
    mainkanNada(392, 0, 0.12, 0.12, 'sine');
    mainkanNada(523.25, 0.1, 0.12, 0.12, 'sine');
    mainkanNada(783.99, 0.2, 0.28, 0.13, 'sine');
  } catch (e) {}
}

// Klik kecil (buka/tutup menu & jendela), pilih opsi
function suaraKlik() {
  try { mainkanNada(1200, 0, 0.05, 0.06, 'sine'); } catch (e) {}
}
function suaraBukaJendela() {
  try {
    mainkanNada(523.25, 0, 0.09, 0.08, 'sine');
    mainkanNada(783.99, 0.07, 0.14, 0.08, 'sine');
  } catch (e) {}
}
function suaraTutupJendela() {
  try {
    mainkanNada(783.99, 0, 0.09, 0.07, 'sine');
    mainkanNada(523.25, 0.07, 0.14, 0.07, 'sine');
  } catch (e) {}
}
function suaraPilih() {
  try { mainkanNada(1000, 0, 0.04, 0.045, 'triangle'); } catch (e) {}
}

// Tombol bisukan/nyalakan suara (ingat pilihan di browser)
function perbaruiTombolSuara() {
  const b = document.getElementById('tombolSuara');
  if (!b) return;
  b.textContent = suaraAktif ? '🔊' : '🔇';
  b.setAttribute('aria-label', suaraAktif ? 'Matikan suara notifikasi' : 'Nyalakan suara notifikasi');
  b.title = suaraAktif ? 'Suara aktif (ketuk untuk bisukan)' : 'Suara mati (ketuk untuk nyalakan)';
}
function toggleSuara() {
  suaraAktif = !suaraAktif;
  try { localStorage.setItem('pelatihan_suara_aktif', suaraAktif ? '1' : '0'); } catch (e) {}
  perbaruiTombolSuara();
  if (suaraAktif) suaraInfo();
}
perbaruiTombolSuara();

// Suara "tik" halus saat memilih opsi (radio, centang, dropdown)
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t && t.matches && t.matches('input[type=radio], input[type=checkbox], select')) suaraPilih();
});

// Notifikasi koneksi internet
window.addEventListener('offline', () => {
  toast('error', 'Koneksi internet terputus', 'Data belum bisa dikirim. Periksa sinyal atau WiFi Anda.', 6000);
});
window.addEventListener('online', () => {
  toast('success', 'Koneksi tersambung kembali', 'Anda sudah online lagi, silakan lanjutkan.', 4000);
});
