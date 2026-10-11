/* Layar sukses pendaftaran + confetti. */
// ---------------------------------------------------------------
// Confetti ringan (CSS + JS) saat pendaftaran berhasil
// ---------------------------------------------------------------
function tembakConfetti() {
  const warna = ['#3B0764', '#7C3AED', '#C084FC', '#12A87D', '#FFB020'];
  const wrap = document.createElement('div');
  wrap.className = 'confetti-wrap';
  document.body.appendChild(wrap);

  const jumlah = 46;
  for (let i = 0; i < jumlah; i++) {
    const potong = document.createElement('span');
    potong.className = 'confetti-potong';
    const lebar = 6 + Math.random() * 6;
    const tinggi = 10 + Math.random() * 8;
    potong.style.width = lebar + 'px';
    potong.style.height = tinggi + 'px';
    potong.style.left = (Math.random() * 100) + 'vw';
    potong.style.background = warna[Math.floor(Math.random() * warna.length)];
    potong.style.setProperty('--jarak-jatuh', (380 + Math.random() * 260) + 'px');
    potong.style.setProperty('--geser-x', (Math.random() * 140 - 70) + 'px');
    potong.style.setProperty('--putaran', (Math.random() * 720 - 360) + 'deg');
    potong.style.animationDuration = (1.1 + Math.random() * 0.9) + 's';
    potong.style.animationDelay = (Math.random() * 0.25) + 's';
    wrap.appendChild(potong);
  }

  setTimeout(() => wrap.remove(), 2400);
}

function tampilkanSukses(namaPelatihan, grupWhatsapp) {
  document.getElementById('suksesPelatihan').textContent = namaPelatihan;

  const waWrap = document.getElementById('suksesWaWrap');
  const waList = document.getElementById('suksesWaList');
  waList.innerHTML = '';

  const daftarGrup = Array.isArray(grupWhatsapp) ? grupWhatsapp.filter(g => g && g.url) : [];
  if (daftarGrup.length > 0) {
    daftarGrup.forEach(g => {
      const a = document.createElement('a');
      a.href = g.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'wa-group-btn';
      a.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.52 3.48A11.9 11.9 0 0012.03 0C5.46 0 .16 5.3.16 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.86 11.86 0 005.63 1.43h.01c6.57 0 11.87-5.3 11.87-11.86 0-3.17-1.24-6.15-3.39-8.41zM12.04 21.5a9.6 9.6 0 01-4.9-1.34l-.35-.21-3.65.96.98-3.56-.23-.36a9.6 9.6 0 01-1.47-5.13c0-5.32 4.33-9.65 9.65-9.65 2.58 0 5 1 6.82 2.83a9.58 9.58 0 012.83 6.82c0 5.33-4.33 9.64-9.68 9.64zm5.3-7.23c-.29-.15-1.7-.84-1.97-.94-.26-.1-.46-.15-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.44-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.44.13-.59.13-.13.29-.34.44-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.65-1.58-.9-2.16-.24-.58-.48-.5-.65-.5h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.42 0 1.43 1.02 2.81 1.17 3 .14.19 2 3.06 4.86 4.3.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.37-.07-.12-.26-.19-.55-.34z"/></svg><span>${g.label || 'Gabung Grup WhatsApp'}</span>`;
      waList.appendChild(a);
    });
    waWrap.style.display = 'block';
  } else {
    waWrap.style.display = 'none';
  }

  // Reset & ulang animasi ikon centang (biar tetap jalan walau
  // overlay ini sempat tampil lebih dari sekali dalam satu sesi).
  const svgIkon = document.querySelector('.sukses-icon svg');
  if (svgIkon) {
    const klonSvg = svgIkon.cloneNode(true);
    svgIkon.parentNode.replaceChild(klonSvg, svgIkon);
  }

  document.getElementById('suksesOverlay').classList.add('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  mainkanSuaraSukses();
  tembakConfetti();
}
function tutupSukses() {
  suaraTutupJendela();
  document.getElementById('suksesOverlay').classList.remove('show');
}
