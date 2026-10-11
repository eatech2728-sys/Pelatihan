/* Pilih berkas + kompresi foto otomatis. */
const MAX_SIZE = 3 * 1024 * 1024;
const TARGET_SIZE = 1.5 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const compressedFileStore = {};

// ---------------------------------------------------------------
// Kompresi gambar otomatis (sama seperti sistem AK-1) supaya foto
// dari kamera HP yang besar tetap muat di bawah 3MB.
// ---------------------------------------------------------------
function compressImage(file, targetBytes = TARGET_SIZE, maxDim = MAX_DIMENSION) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { resolve(null); return; }
    const imgUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(imgUrl);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) { height = Math.round(height * (maxDim / width)); width = maxDim; }
        else { width = Math.round(width * (maxDim / height)); height = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const coba = (quality, dim) => {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('Gagal mengompres gambar')); return; }
          if (blob.size <= targetBytes || (quality <= 0.35 && dim <= 700)) {
            const reader = new FileReader();
            reader.onload = () => resolve({ blob, base64: reader.result.split(',')[1], type: 'image/jpeg' });
            reader.onerror = reject;
            reader.readAsDataURL(blob);
            return;
          }
          if (quality > 0.35) { coba(quality - 0.12, dim); }
          else {
            const dimBaru = Math.round(dim * 0.85);
            canvas.width = Math.round(width * (dimBaru / Math.max(width, height)));
            canvas.height = Math.round(height * (dimBaru / Math.max(width, height)));
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            coba(0.7, dimBaru);
          }
        }, 'image/jpeg', quality);
      };
      coba(0.85, Math.max(width, height));
    };
    img.onerror = () => { URL.revokeObjectURL(imgUrl); reject(new Error('Gagal memuat gambar')); };
    img.src = imgUrl;
  });
}

function formatUkuran(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getOrBuatCatatanKompresi(drop) {
  let note = drop.querySelector('.file-compress-note');
  if (!note) { note = document.createElement('span'); note.className = 'file-compress-note'; drop.appendChild(note); }
  return note;
}

async function handleFile(input, dropId) {
  const drop = document.getElementById(dropId);
  const nameEl = drop.querySelector('.file-name');
  const note = getOrBuatCatatanKompresi(drop);
  delete compressedFileStore[input.id];
  note.textContent = '';

  if (!(input.files && input.files[0])) {
    drop.classList.remove('filled');
    nameEl.textContent = nameEl.dataset.default;
    return;
  }

  const f = input.files[0];
  if (!f.type.startsWith('image/')) {
    if (f.size > MAX_SIZE) {
      toast('error', 'Berkas terlalu besar', `"${f.name}" berukuran ${formatUkuran(f.size)}. Maksimal 3MB untuk file PDF.`, 6000);
      input.value = ''; drop.classList.remove('filled'); nameEl.textContent = nameEl.dataset.default;
      return;
    }
    drop.classList.add('filled'); nameEl.textContent = f.name;
    suaraBerkasBerhasil();
    return;
  }

  if (f.size <= TARGET_SIZE) {
    drop.classList.add('filled'); nameEl.textContent = f.name;
    suaraBerkasBerhasil();
    return;
  }

  nameEl.textContent = `Mengompres "${f.name}"…`;
  suaraBerkasProses();
  try {
    const hasil = await compressImage(f);
    if (!hasil) { drop.classList.add('filled'); nameEl.textContent = f.name; suaraBerkasBerhasil(); return; }
    if (hasil.blob.size > MAX_SIZE) {
      toast('error', 'Foto terlalu besar', `"${f.name}" masih terlalu besar setelah dikompres. Coba foto lain.`, 6000);
      input.value = ''; delete compressedFileStore[input.id];
      drop.classList.remove('filled'); nameEl.textContent = nameEl.dataset.default;
      return;
    }
    compressedFileStore[input.id] = {
      base64: hasil.base64, type: hasil.type,
      name: f.name.replace(/\.[^.]+$/, '') + '.jpg', size: hasil.blob.size
    };
    drop.classList.add('filled'); nameEl.textContent = f.name;
    note.textContent = `Dikompres otomatis: ${formatUkuran(f.size)} → ${formatUkuran(hasil.blob.size)}`;
    suaraBerkasBerhasil();
  } catch (err) {
    console.error(err);
    toast('error', 'Gagal memproses foto', `"${f.name}" tidak bisa dikompres. Coba foto lain.`, 6000);
    input.value = ''; drop.classList.remove('filled'); nameEl.textContent = nameEl.dataset.default;
  }
}

const toBase64 = file => new Promise((resolve, reject) => {
  if (!file || file.length === 0) { resolve(null); return; }
  const reader = new FileReader();
  reader.readAsDataURL(file[0]);
  reader.onload = () => resolve({ base64: reader.result.split(',')[1], type: file[0].type });
  reader.onerror = reject;
});

async function ambilFilePayload(inputId) {
  const input = document.getElementById(inputId);
  if (!input || !input.files || input.files.length === 0) return null;
  const cached = compressedFileStore[inputId];
  if (cached) return { base64: cached.base64, type: cached.type };
  return toBase64(input.files);
}
