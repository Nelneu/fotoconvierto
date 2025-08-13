// Elementos del DOM
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const gallery = document.getElementById('gallery');
const clearGalleryBtn = document.getElementById('clearGalleryBtn');

const GALLERY_STORAGE_KEY = 'imageGallery';

// --- Funciones ---

/**
 * Carga la galería de imágenes desde localStorage.
 * @returns {string[]} Un array de imágenes en formato base64.
 */
function getGallery() {
  const storedGallery = localStorage.getItem(GALLERY_STORAGE_KEY);
  return storedGallery ? JSON.parse(storedGallery) : [];
}

/**
 * Guarda la galería de imágenes en localStorage.
 * @param {string[]} images - El array de imágenes a guardar.
 */
function saveGallery(images) {
  localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(images));
}

/**
 * Renderiza la galería en el DOM.
 */
function renderGallery() {
  const images = getGallery();
  gallery.innerHTML = ''; // Limpiar la galería antes de renderizar
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

/**
 * Limpia la previsualización de la imagen.
 */
function clearPreview() {
  preview.innerHTML = "Aquí verás tu imagen";
  preview.style.border = "2px dashed #ccc";
  fileInput.value = ""; // Permite volver a seleccionar el mismo archivo
}

// --- Event Listeners ---

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target.result;

      // 1. Mostrar en previsualización
      preview.innerHTML = `<img src="${imgData}" alt="Imagen cargada">`;
      preview.style.border = "2px solid #28a745"; // Verde para éxito

      // 2. Guardar en la galería
      const images = getGallery();
      images.push(imgData);
      saveGallery(images);

      // 3. Actualizar la galería en el DOM
      renderGallery();
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "Archivo no válido";
    preview.style.border = "2px dashed #dc3545"; // Rojo para error
  }
});

clearBtn.addEventListener('click', clearPreview);

clearGalleryBtn.addEventListener('click', () => {
  // Pedir confirmación al usuario
  if (confirm('¿Estás seguro de que quieres borrar toda la galería? Esta acción no se puede deshacer.')) {
    localStorage.removeItem(GALLERY_STORAGE_KEY);
    renderGallery();
    clearPreview();
  }
});

// --- Inicialización ---

// Renderizar la galería al cargar la página
document.addEventListener('DOMContentLoaded', renderGallery);
