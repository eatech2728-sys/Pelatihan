/* Validasi field, tampilan SIAPkerja dan blok usaha. */
// ---------------------------------------------------------------
// Validasi & kirim
// ---------------------------------------------------------------
function getOrBuatFieldError(fieldEl) {
  let err = fieldEl.querySelector('.field-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'field-error';
    err.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><span></span>`;
    fieldEl.appendChild(err);
  }
  return err;
}
function showFieldError(inputEl, pesan) {
  const fieldEl = inputEl.closest('.field') || inputEl.parentElement;
  if (!fieldEl) return;
  fieldEl.classList.add('has-error');
  const err = getOrBuatFieldError(fieldEl);
  err.querySelector('span').textContent = pesan;
  err.classList.add('show');
}
function clearFieldError(inputEl) {
  const fieldEl = inputEl.closest('.field') || inputEl.parentElement;
  if (!fieldEl) return;
  fieldEl.classList.remove('has-error');
  const err = fieldEl.querySelector('.field-error');
  if (err) err.classList.remove('show');
}
document.addEventListener('input', (e) => { if (e.target.matches('input, select, textarea')) clearFieldError(e.target); });
document.addEventListener('change', (e) => { if (e.target.matches('input, select, textarea')) clearFieldError(e.target); });

function validasiSemuaField(form) {
  const required = Array.from(form.querySelectorAll('input[required], select[required], textarea[required]'));
  let fieldPertamaError = null;
  let jumlahError = 0;

  required.forEach(inp => {
    let valid = true;
    if (inp.type === 'checkbox') valid = inp.checked;
    else if (inp.type === 'file') valid = !!(inp.files && inp.files.length);
    else valid = !!inp.value.trim();

    if (inp.id === 'nik' && valid && inp.value.trim().length !== 16) valid = false;
    if (inp.type === 'email' && valid && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) valid = false;

    if (!valid) {
      jumlahError++;
      let pesan = 'Wajib diisi.';
      if (inp.type === 'file') pesan = 'Berkas wajib diunggah.';
      else if (inp.id === 'nik') pesan = 'NIK harus tepat 16 digit angka.';
      else if (inp.type === 'email') pesan = 'Format email tidak valid.';
      else if (inp.type === 'checkbox') pesan = 'Persetujuan wajib dicentang.';
      showFieldError(inp, pesan);
      if (!fieldPertamaError) fieldPertamaError = inp;
    } else {
      clearFieldError(inp);
    }
  });

  if (fieldPertamaError) {
    const sec = fieldPertamaError.closest('.form-section');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => fieldPertamaError.focus({ preventScroll: true }), 350);
    toast('error', 'Formulir belum lengkap', `${jumlahError} bagian perlu diperiksa kembali sebelum dikirim.`);
    return false;
  }
  return true;
}

const nikInput = document.getElementById('nik');
nikInput.setAttribute('inputmode', 'numeric');
nikInput.setAttribute('maxlength', '16');
nikInput.addEventListener('input', () => { nikInput.value = nikInput.value.replace(/[^0-9]/g, '').slice(0, 16); });

const hpInput = document.getElementById('no_hp');
hpInput.addEventListener('input', () => { hpInput.value = hpInput.value.replace(/[^0-9+\-\s]/g, ''); });

// ---------------------------------------------------------------
// Akun SIAPkerja: tampilkan blok upload screenshot (kalau "Sudah")
// atau blok peringatan (kalau "Belum"), dan atur wajib/tidaknya
// upload screenshot sesuai pilihan.
// ---------------------------------------------------------------
function perbaruiTampilanSiapKerja() {
  const nilai = document.getElementById('status_akun_siap_kerja').value;
  const blokSudah = document.getElementById('blokSudahSiapKerja');
  const blokBelum = document.getElementById('blokBelumSiapKerja');
  const inputFileSiapKerja = document.getElementById('file_siap_kerja');

  if (nilai === 'Sudah') {
    blokSudah.style.display = 'block';
    blokBelum.classList.remove('show');
    inputFileSiapKerja.setAttribute('required', 'required');
  } else if (nilai === 'Belum') {
    blokSudah.style.display = 'none';
    blokBelum.classList.add('show');
    inputFileSiapKerja.removeAttribute('required');
    inputFileSiapKerja.value = '';
    delete compressedFileStore['file_siap_kerja'];
    const drop = document.getElementById('drop_siap_kerja');
    drop.classList.remove('filled');
    drop.querySelector('.file-name').textContent = drop.querySelector('.file-name').dataset.default;
    clearFieldError(inputFileSiapKerja);
  } else {
    blokSudah.style.display = 'none';
    blokBelum.classList.remove('show');
    inputFileSiapKerja.removeAttribute('required');
  }
}

function validasiSiapKerjaSebelumKirim() {
  const nilai = document.getElementById('status_akun_siap_kerja').value;
  if (nilai === 'Belum') {
    const blok = document.getElementById('blokBelumSiapKerja');
    if (blok) blok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('error', 'Lengkapi profil SIAPkerja dahulu', 'Silakan lengkapi profil SIAPkerja Anda terlebih dahulu di siapkerja.kemnaker.go.id, baru lanjutkan pendaftaran ini.', 8000);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------
// Pekerjaan & Usaha: tampilkan blok Jenis/Nama Usaha & Posisi-Jabatan
// hanya kalau status pekerjaan yang dipilih adalah Wirausaha.
// ---------------------------------------------------------------
function perbaruiTampilanUsaha() {
  const nilai = document.getElementById('status_pekerjaan').value;
  const blok = document.getElementById('blokUsaha');
  const tampilkan = nilai === 'Wirausaha / Punya Usaha Sendiri';

  blok.style.display = tampilkan ? 'block' : 'none';
  if (!tampilkan) {
    document.getElementById('jenis_usaha').value = '';
    document.getElementById('nama_usaha').value = '';
    document.getElementById('posisi_jabatan').value = '';
  }
}
