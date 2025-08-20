// Seleccionamos los elementos por su ID (coinciden con el HTML)
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const downloadLink = document.getElementById('downloadLink');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const statusText = document.getElementById('status-text');

// Función para activar el botón de descarga
function activarDescarga(imgData, filename) {
  downloadLink.href = imgData;
  downloadLink.download = filename;
  downloadLink.style.display = 'block';
}

// Función para desactivar el botón de descarga
function desactivarDescarga() {
  downloadLink.style.display = 'none';
}

// ✅ 1. Mostrar la última imagen guardada al cargar la página
const ultimaImagen = localStorage.getItem("ultimaImagen");
const ultimaImagenNombre = localStorage.getItem("ultimaImagenNombre");
if (ultimaImagen) {
  preview.innerHTML = `<img src="${ultimaImagen}" alt="Imagen guardada">`;
  if (ultimaImagenNombre) {
    preview.innerHTML += `<p style="font-size: 12px; color: #555;">${ultimaImagenNombre}</p>`;
  }
  preview.style.border = "2px solid green";
  activarDescarga(ultimaImagen, ultimaImagenNombre || 'imagen.png');
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  statusText.textContent = ''; // Limpiar texto de estado anterior
  progressContainer.style.display = 'none'; // Ocultar por si acaso

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

      // Finalizar y mostrar mensaje de carga completa
      progressBar.style.width = '100%';
      statusText.textContent = 'Carga completa';
      setTimeout(() => {
        progressContainer.style.display = 'none';
        statusText.textContent = '';
      }, 1500);

      // ✅ 2. Mostrar imagen y nombre
      preview.innerHTML = `<img src="${imgData}" alt="Imagen cargada">`;
      preview.innerHTML += `<p style="font-size: 12px; color: #555;">${file.name}</p>`;
      preview.style.border = "2px solid green";

      // ✅ 3. Guardar en localStorage
      localStorage.setItem("ultimaImagen", imgData);
      localStorage.setItem("ultimaImagenNombre", file.name);

      // Activar descarga
      activarDescarga(imgData, file.name);
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "Archivo no válido";
    preview.style.border = "2px dashed #ccc";
    desactivarDescarga();
    progressContainer.style.display = 'none';
  }
});

clearBtn.addEventListener('click', () => {
  preview.innerHTML = "Aquí verás tu imagen";
  preview.style.border = "2px dashed #ccc";
  fileInput.value = "";

  // ✅ 4. Borrar también de localStorage
  localStorage.removeItem("ultimaImagen");
  localStorage.removeItem("ultimaImagenNombre");

  // Ocultar botón de descarga y progreso
  desactivarDescarga();
  progressContainer.style.display = 'none';
  statusText.textContent = '';
});
