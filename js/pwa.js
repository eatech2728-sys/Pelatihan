/* PWA: service worker dan banner "Pasang Aplikasi". */
// ---------------------------------------------------------------
// PWA: daftarkan service worker (wajib supaya Chrome mengizinkan
// instalasi sebagai aplikasi/pintasan), lalu tangani notifikasi
// "Pasang Aplikasi" secara kustom.
// ---------------------------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => {
      console.error('Gagal mendaftarkan service worker:', err);
    });
  });
}

let promptInstalasiTertunda = null;
const KUNCI_TUTUP_BANNER = 'pelatihan_install_banner_ditutup';

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  promptInstalasiTertunda = event;

  if (localStorage.getItem(KUNCI_TUTUP_BANNER) === '1') return;
  if (window.matchMedia('(display-mode: standalone)').matches) return;

  document.getElementById('installBanner').classList.add('show');
});

async function pasangAplikasi() {
  const banner = document.getElementById('installBanner');
  if (!promptInstalasiTertunda) {
    banner.classList.remove('show');
    return;
  }
  promptInstalasiTertunda.prompt();
  const hasil = await promptInstalasiTertunda.userChoice;
  promptInstalasiTertunda = null;
  banner.classList.remove('show');
  if (hasil.outcome === 'accepted') {
    toast('success', 'Aplikasi berhasil dipasang', 'Anda sekarang bisa membuka formulir ini langsung dari layar utama HP.', 6000);
  }
}

function tutupInstallBanner() {
  document.getElementById('installBanner').classList.remove('show');
  localStorage.setItem(KUNCI_TUTUP_BANNER, '1');
}

window.addEventListener('appinstalled', () => {
  document.getElementById('installBanner').classList.remove('show');
  promptInstalasiTertunda = null;
});
