// --- Elementos del DOM ---
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const downloadLink = document.getElementById('downloadLink');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status-text');
const gallery = document.getElementById('gallery');
const clearGalleryBtn = document.getElementById('clearGalleryBtn');

// --- Constantes ---
const GALLERY_STORAGE_KEY = 'imageGallery';

// --- Funciones ---

// Mis funciones
function activarDescarga(imgData, filename) {
  downloadLink.href = imgData;
  downloadLink.download = filename;
  downloadLink.style.display = 'block';
}

function desactivarDescarga() {
  downloadLink.style.display = 'none';
}

// Funciones de la galería (de main)
function getGallery() {
  const storedGallery = localStorage.getItem(GALLERY_STORAGE_KEY);
  return storedGallery ? JSON.parse(storedGallery) : [];
}

function saveGallery(images) {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(images));
}

function renderGallery() {
  const images = getGallery();
  gallery.innerHTML = '';
  if (images.length === 0) {
    gallery.innerHTML = '<p>No hay imágenes en tu galería. ¡Sube una!</p>';
    clearGalleryBtn.style.display = 'none';
  } else {
    images.forEach(imgData => {
      const imgElement = document.createElement('img');
      imgElement.src = imgData;
      imgElement.alt = 'Imagen de la galería';
      imgElement.classList.add('gallery-item');
      gallery.appendChild(imgElement);
    });
    clearGalleryBtn.style.display = 'block';
  }
}

// Función de limpieza de previsualización (fusionada)
function clearPreview() {
  preview.innerHTML = "Aquí verás tu imagen";
  preview.style.border = "2px dashed #ccc";
  fileInput.value = "";
  desactivarDescarga();
  progressContainer.style.display = 'none';
  statusText.textContent = '';
}

// --- Event Listeners ---

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  statusText.textContent = '';
  progressContainer.style.display = 'none';

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.onloadstart = function() {
      progressBar.style.width = '0%';
      progressContainer.style.display = 'block';
    };

    reader.onprogress = function(e) {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = progress + '%';
      }
    };

    reader.onload = function (e) {
      const imgData = e.target.result;

      // Mi lógica de UI de carga
      progressBar.style.width = '100%';
      statusText.textContent = 'Carga completa';
      setTimeout(() => {
        progressContainer.style.display = 'none';
        statusText.textContent = '';
      }, 1500);

      // Lógica de previsualización (fusionada)
      preview.innerHTML = `<img src="${imgData}" alt="Imagen cargada">`;
      preview.innerHTML += `<p style="font-size: 12px; color: #555;">${file.name}</p>`;
      preview.style.border = "2px solid #28a745";
      activarDescarga(imgData, file.name);

      // Lógica de galería (de main)
      const images = getGallery();
      images.push(imgData);
      saveGallery(images);
      renderGallery();
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "Archivo no válido";
    preview.style.border = "2px dashed #dc3545"; // Borde rojo de main
    desactivarDescarga(); // Mi lógica
    progressContainer.style.display = 'none'; // Mi lógica
  }
});

clearBtn.addEventListener('click', clearPreview);

clearGalleryBtn.addEventListener('click', () => {
  if (confirm('¿Estás seguro de que quieres borrar toda la galería? Esta acción no se puede deshacer.')) {
    localStorage.removeItem(GALLERY_STORAGE_KEY);
    renderGallery();
    clearPreview();
  }
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', renderGallery);
