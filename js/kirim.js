/* Proses kirim formulir ke server. */
let sedangKirim = false;

function handleSubmitClick(event) {
  event.preventDefault();
  if (!validasiSemuaField(document.getElementById('formPelatihan'))) return;
  if (!validasiUsiaSebelumKirim()) return;
  if (!validasiSiapKerjaSebelumKirim()) return;
  prosesKirimForm();
}

async function prosesKirimForm() {
  if (sedangKirim) return;
  sedangKirim = true;
  const submitBtn = document.getElementById('submitBtn');
  const loadingText = document.getElementById('loadingText');
  submitBtn.disabled = true;
  loadingText.classList.add('show');
  suaraKirim();

  try {
    const fileKtp = await ambilFilePayload('file_ktp');
    const fileIjazah = await ambilFilePayload('file_ijazah');
    const fileSiapKerja = await ambilFilePayload('file_siap_kerja');

    const payload = {
      pelatihan: document.getElementById('pelatihan').value,
      nik: document.getElementById('nik').value,
      nama: document.getElementById('nama').value,
      tempat_lahir: document.getElementById('tempat_lahir').value,
      tanggal_lahir: document.getElementById('tanggal_lahir').value,
      alamat: document.getElementById('alamat').value,
      pendidikan_terakhir: document.getElementById('pendidikan_terakhir').value,
      status_pekerjaan: document.getElementById('status_pekerjaan').value,
      jenis_usaha: document.getElementById('jenis_usaha').value,
      nama_usaha: document.getElementById('nama_usaha').value,
      posisi_jabatan: document.getElementById('posisi_jabatan').value,
      status_akun_siap_kerja: document.getElementById('status_akun_siap_kerja').value,
      no_hp: document.getElementById('no_hp').value,
      email: document.getElementById('email').value,
      konfirmasi_privasi: document.getElementById('konfirmasi_privasi').checked ? 'Ya (Setuju)' : 'Tidak',
      konfirmasi_tata_tertib: document.getElementById('konfirmasi_tata_tertib').checked ? 'Ya (Bersedia)' : 'Tidak',
      file_ktp: fileKtp,
      file_ijazah: fileIjazah,
      file_siap_kerja: fileSiapKerja
    };

    const response = await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload) });
    const result = await response.json();

    if (result.status === 'success') {
      tampilkanSukses(result.pelatihan, result.grup_whatsapp);
      document.getElementById('formPelatihan').reset();
      document.querySelectorAll('.file-drop').forEach(d => {
        d.classList.remove('filled');
        const n = d.querySelector('.file-name');
        n.textContent = n.dataset.default;
        const note = d.querySelector('.file-compress-note');
        if (note) note.textContent = '';
      });
      Object.keys(compressedFileStore).forEach(k => delete compressedFileStore[k]);
      perbaruiTampilanSiapKerja();
      await muatDaftarPelatihan();
    } else if (result.status === 'duplicate') {
      toast('error', 'NIK sudah terdaftar', result.message, 8000);
    } else if (result.status === 'validation') {
      toast('error', 'Data belum valid', result.message, 7000);
    } else {
      toast('error', 'Gagal menyimpan data', result.message || 'Silakan coba kirim kembali beberapa saat lagi.', 7000);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    toast('error', 'Masalah jaringan', 'Terjadi kendala koneksi saat mengirim data. Silakan periksa koneksi internet Anda dan coba lagi.', 7000);
  } finally {
    submitBtn.disabled = false;
    loadingText.classList.remove('show');
    sedangKirim = false;
  }
}
