/* Animasi pembuka + audio "Ayo Daftar Pelatihan" (suara dibuat lewat Web Audio, tanpa file) */
(function () {
const splash = document.getElementById('splashPembuka');
if (!splash) return;

let sudahTutup = false, suaraMain = false, timerTutup = null;
const DURASI = 7700;

// Tampil sekali per sesi tab saja
try { if (sessionStorage.getItem('splashSudahTampil') === '1') { splash.remove(); return; } } catch (e) {}

document.documentElement.style.overflow = 'hidden';

// Pecah kalimat tanya jadi kata-kata yang muncul bergantian
const tanya = document.getElementById('splashTanya');
const kata = tanya.textContent.trim().split(/\s+/);
tanya.textContent = '';
kata.forEach(function (k, i) {
  const s = document.createElement('span');
  s.textContent = k;
  if (/keahlian|siap|pakai/i.test(k)) s.className = 'tebal';
  s.style.animationDelay = (0.9 + i * 0.17).toFixed(2) + 's';
  tanya.appendChild(s);
});
setTimeout(function () { splash.classList.add('judul-tampil'); }, 2900);

// Bintang kilau acak
const wadah = document.getElementById('splashBintang');
for (let i = 0; i < 26; i++) {
  const b = document.createElement('i');
  b.style.left = (Math.random() * 100) + '%';
  b.style.top = (8 + Math.random() * 84) + '%';
  b.style.animationDelay = (Math.random() * 2.4).toFixed(2) + 's';
  b.style.animationDuration = (1.8 + Math.random() * 1.6).toFixed(2) + 's';
  wadah.appendChild(b);
}

// ---------- Alat suara ----------
function ctxAman() { try { return ambilAudioCtx(); } catch (e) { return null; } }

function nada(f, t, d, v, tipe) {
  if (t < -0.02) return;
  try { mainkanNada(f, Math.max(t, 0), d, v, tipe); } catch (e) {}
}

// Nada yang frekuensinya meluncur (riser / efek "whoosh")
function luncur(f1, f2, t, d, v, tipe) {
  const c = ctxAman(); if (!c || t < -0.02) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = tipe || 'sawtooth';
  const m = c.currentTime + Math.max(t, 0);
  o.frequency.setValueAtTime(f1, m);
  o.frequency.exponentialRampToValueAtTime(f2, m + d);
  g.gain.setValueAtTime(0.0001, m);
  g.gain.exponentialRampToValueAtTime(v, m + d * 0.9);
  g.gain.exponentialRampToValueAtTime(0.0001, m + d + 0.12);
  o.connect(g); g.connect(c.destination);
  o.start(m); o.stop(m + d + 0.2);
}

// Derau (hi-hat / simbal)
let _bufDerau = null;
function derau(t, d, v, hp) {
  const c = ctxAman(); if (!c || t < -0.02) return;
  if (!_bufDerau) {
    _bufDerau = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = _bufDerau.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource(); s.buffer = _bufDerau; s.loop = true;
  const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp || 7000;
  const g = c.createGain();
  const m = c.currentTime + Math.max(t, 0);
  g.gain.setValueAtTime(v, m);
  g.gain.exponentialRampToValueAtTime(0.0001, m + d);
  s.connect(f); f.connect(g); g.connect(c.destination);
  s.start(m); s.stop(m + d + 0.05);
}

// Kick drum
function kick(t, v) {
  const c = ctxAman(); if (!c || t < -0.02) return;
  const o = c.createOscillator(), g = c.createGain();
  const m = c.currentTime + Math.max(t, 0);
  o.type = 'sine';
  o.frequency.setValueAtTime(150, m);
  o.frequency.exponentialRampToValueAtTime(45, m + 0.14);
  g.gain.setValueAtTime(v, m);
  g.gain.exponentialRampToValueAtTime(0.0001, m + 0.22);
  o.connect(g); g.connect(c.destination);
  o.start(m); o.stop(m + 0.25);
}

// Lagu pembuka ~7 detik, 120 BPM (1 ketuk = 0,5 detik), tangga nada C mayor
const N = { C3:130.81, G3:196.00, A3:220.00, F3:174.61, C4:261.63, E4:329.63, G4:392.00,
            C5:523.25, D5:587.33, E5:659.25, G5:783.99, A5:880.00, B5:987.77,
            C6:1046.5, E6:1318.5, G6:1567.98, C7:2093.0 };

function mainkanAudioPembuka(o) {
  if (suaraMain) return;
  suaraMain = true;
  o = o || 0;
  const t = function (x) { return x - o; };

  // === BAGIAN 1 (0 - 2,9 dtk): kalimat tanya, penuh rasa penasaran ===
  nada(N.C4, t(0.0), 2.8, 0.05, 'sine');          // pad lembut
  nada(N.G4, t(0.0), 2.8, 0.04, 'sine');
  nada(N.E4, t(0.0), 2.8, 0.04, 'sine');
  luncur(300, 900, t(0.1), 0.8, 0.04, 'triangle'); // whoosh logo muncul
  ['C5','E5','G5','A5','G5','E5','D5','G5','E5','G5','C6','G5'].forEach(function (n, i) {
    nada(N[n], t(0.9 + i * 0.17), 0.22, 0.09, 'triangle'); // pluk mengikuti kata
  });
  for (let i = 0; i < 4; i++) derau(t(1.0 + i * 0.5), 0.05, 0.04, 8000); // hi-hat tipis
  // Riser menuju judul
  luncur(180, 1500, t(2.1), 0.85, 0.07, 'sawtooth');
  derau(t(2.2), 0.8, 0.05, 5000);

  // === BAGIAN 2 (3,0 dtk): "AYO DAFTAR PELATIHAN" - hentakan meriah ===
  kick(t(3.0), 0.5);
  derau(t(3.0), 0.9, 0.10, 4500);                     // simbal
  [N.C4, N.E4, N.G4, N.C5].forEach(function (f) { nada(f, t(3.0), 1.0, 0.09, 'sawtooth'); });
  nada(N.G5, t(3.0), 0.35, 0.20, 'triangle');          // "Ayo"
  nada(N.C6, t(3.4), 0.35, 0.20, 'triangle');          // "Daftar"
  nada(N.E6, t(3.8), 0.7, 0.20, 'triangle');           // "Pelatihan"
  nada(N.G6, t(3.8), 0.7, 0.06, 'sine');

  // Irama ceria: kick tiap ketuk, hi-hat di sela, bass naik turun
  const bass = [N.C3, N.C3, N.G3, N.G3, N.A3, N.A3, N.F3, N.F3, N.C3, N.C3, N.G3, N.C3];
  for (let i = 0; i < 12; i++) {
    const w = 3.5 + i * 0.25;
    if (i % 2 === 0) kick(t(w + 0.5 - 0.5 + 0), 0.32);
    derau(t(w + 0.125), 0.04, 0.05, 9000);
  }
  for (let i = 0; i < 12; i++) nada(bass[i] , t(3.5 + i * 0.25), 0.22, 0.12, 'triangle');

  // Melodi riang di atas irama
  const mel = [['E5',0],['G5',.25],['C6',.5],['B5',.75],['G5',1.0],['A5',1.25],['G5',1.5],['E5',1.75],['D5',2.0],['E5',2.25],['G5',2.5]];
  mel.forEach(function (m) { nada(N[m[0]], t(4.1 + m[1]), 0.2, 0.11, 'square'); });

  // Kilau saat "di aplikasi kami!" muncul
  nada(N.C7, t(4.5), 0.5, 0.05, 'sine');
  nada(N.G6, t(4.6), 0.5, 0.05, 'sine');

  // === BAGIAN 3 (6,2 dtk): akord penutup + kilauan ===
  kick(t(6.4), 0.45);
  derau(t(6.4), 1.1, 0.09, 4500);
  [N.C4, N.E4, N.G4, N.C5, N.E5, N.G5].forEach(function (f) { nada(f, t(6.4), 1.3, 0.10, 'sine'); });
  nada(N.C3, t(6.4), 1.3, 0.16, 'triangle');
  [N.C6, N.E6, N.G6, N.C7].forEach(function (f, i) { nada(f, t(6.45 + i * 0.09), 0.5, 0.06, 'sine'); });
}

function tutup() {
  if (sudahTutup) return;
  sudahTutup = true;
  clearTimeout(timerTutup);
  splash.classList.add('keluar');
  document.documentElement.style.overflow = '';
  try { sessionStorage.setItem('splashSudahTampil', '1'); } catch (e) {}
  setTimeout(function () { splash.remove(); }, 800);
}

// Coba bunyikan langsung; kalau diblokir browser, tunggu ketukan pertama
const mulaiMs = performance.now();
const ctx = ctxAman();
if (ctx && ctx.state === 'running') {
  mainkanAudioPembuka(0);
} else {
  document.getElementById('splashHint').classList.add('tampil');
  const buka = function () {
    document.getElementById('splashHint').classList.remove('tampil');
    ctxAman();
    mainkanAudioPembuka(Math.min((performance.now() - mulaiMs) / 1000, 3.0));
  };
  ['pointerdown', 'touchstart', 'keydown', 'click'].forEach(function (ev) {
    splash.addEventListener(ev, buka, { once: true });
  });
}

document.getElementById('splashLewati').addEventListener('click', function (e) { e.stopPropagation(); tutup(); });
timerTutup = setTimeout(tutup, DURASI);
})();
