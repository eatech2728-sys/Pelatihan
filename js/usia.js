/* Filter usia pendaftar 18-55 tahun. */
// ---------------------------------------------------------------
// Filter usia pendaftar: 18–55 tahun (usia produktif).
// ---------------------------------------------------------------
const USIA_MINIMAL = 18;
const USIA_MAKSIMAL = 55;

function formatTanggalYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function aturBatasUsiaTanggalLahir() {
  const input = document.getElementById('tanggal_lahir');
  if (!input) return;
  const now = new Date();
  const batasMax = new Date(now.getFullYear() - USIA_MINIMAL, now.getMonth(), now.getDate());
  const batasMin = new Date(now.getFullYear() - USIA_MAKSIMAL, now.getMonth(), now.getDate());
  input.max = formatTanggalYMD(batasMax);
  input.min = formatTanggalYMD(batasMin);
}

function hitungUsia(tanggalLahirStr) {
  if (!tanggalLahirStr) return null;
  const lahir = new Date(tanggalLahirStr + 'T00:00:00');
  if (isNaN(lahir.getTime())) return null;
  const now = new Date();
  let usia = now.getFullYear() - lahir.getFullYear();
  const belumUlangTahun = (now.getMonth() < lahir.getMonth()) ||
    (now.getMonth() === lahir.getMonth() && now.getDate() < lahir.getDate());
  if (belumUlangTahun) usia--;
  return usia;
}

function validasiUsiaSebelumKirim() {
  const input = document.getElementById('tanggal_lahir');
  const usia = hitungUsia(input.value);
  if (usia === null) return true; // sudah ditangani validasi "wajib diisi"

  if (usia < USIA_MINIMAL || usia > USIA_MAKSIMAL) {
    showFieldError(input, `Usia harus ${USIA_MINIMAL}–${USIA_MAKSIMAL} tahun (usia Anda saat ini: ${usia} tahun).`);
    const sec = input.closest('.form-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('error', 'Usia tidak memenuhi syarat', `Pendaftaran hanya dibuka untuk usia produktif ${USIA_MINIMAL}–${USIA_MAKSIMAL} tahun. Usia Anda saat ini terhitung ${usia} tahun.`, 8000);
    return false;
  }
  return true;
}
