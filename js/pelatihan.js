/* Memuat daftar pelatihan aktif dari server + status bar samping. */
// ---------------------------------------------------------------
// Muat daftar pelatihan aktif dari server saat halaman dibuka
// ---------------------------------------------------------------
window.addEventListener('DOMContentLoaded', async () => {
  aturBatasUsiaTanggalLahir();
  await muatDaftarPelatihan();
});

function perbaruiStatusSidebar(jumlahPelatihan) {
  const dot = document.getElementById('statusDot');
  const teks = document.getElementById('statusTeks');
  const kuotaWrap = document.getElementById('sidebarKuotaWrap');
  const jumlahEl = document.getElementById('sidebarJumlahPelatihan');
  if (!dot || !teks) return;

  if (jumlahPelatihan > 0) {
    dot.classList.remove('tutup');
    teks.textContent = 'Pendaftaran Dibuka';
    if (kuotaWrap && jumlahEl) {
      jumlahEl.textContent = String(jumlahPelatihan);
      kuotaWrap.style.display = 'block';
    }
  } else {
    dot.classList.add('tutup');
    teks.textContent = 'Belum Ada Pelatihan Dibuka';
    if (kuotaWrap) kuotaWrap.style.display = 'none';
  }
}

async function muatDaftarPelatihan() {
  const select = document.getElementById('pelatihan');
  const note = document.getElementById('pilihanKosongNote');
  try {
    const res = await fetch(`${WEB_APP_URL}?daftarPelatihan=1`);
    const data = await res.json();

    select.innerHTML = '';

    if (data.status !== 'success' || !Array.isArray(data.pelatihan) || data.pelatihan.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.disabled = true;
      opt.selected = true;
      opt.textContent = '-- Tidak ada pelatihan yang dibuka --';
      select.appendChild(opt);
      note.classList.add('show');
      perbaruiStatusSidebar(0);
      return;
    }

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = '-- Pilih Pelatihan --';
    select.appendChild(placeholder);

    data.pelatihan.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.nama;
      opt.textContent = p.nama + (p.sisa_kuota !== null ? ` (sisa kuota: ${p.sisa_kuota})` : '');
      select.appendChild(opt);
    });

    perbaruiStatusSidebar(data.pelatihan.length);

  } catch (err) {
    console.error('Gagal memuat daftar pelatihan:', err);
    select.innerHTML = '<option value="" disabled selected>-- Gagal memuat, silakan refresh halaman --</option>';
    toast('error', 'Gagal memuat daftar pelatihan', 'Periksa koneksi internet Anda, lalu muat ulang halaman.', 6000);
    perbaruiStatusSidebar(0);
  }
}
