document.addEventListener('DOMContentLoaded', () => {
  // Seleccionamos los elementos por su ID (coinciden con el HTML)
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('preview');
  const clearBtn = document.getElementById('clearBtn');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const statusText = document.getElementById('status-text');

  // ✅ 1. Mostrar la última imagen guardada al cargar la página
  try {
    const ultimaImagen = localStorage.getItem("ultimaImagen");
    if (ultimaImagen) {
      preview.innerHTML = `<img src="${ultimaImagen}" alt="Imagen guardada">`;
      preview.style.border = "2px solid green";
    }
  } catch (e) {
    console.error("Error al cargar imagen de localStorage:", e);
    // Limpiar en caso de datos corruptos
    localStorage.removeItem("ultimaImagen");
  }


  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    statusText.textContent = '';
    progressContainer.style.display = 'none';

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadstart = function () {
        progressBar.style.width = '0%';
        progressContainer.style.display = 'block';
        statusText.textContent = 'Iniciando carga...';
      };

      reader.onprogress = function (e) {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          progressBar.style.width = progress + '%';
          statusText.textContent = `Cargando ${progress}%`;
        }
      };

      reader.onload = function (e) {
        const imgData = e.target.result;

        statusText.textContent = 'Carga completa';
        progressBar.style.width = '100%';

        setTimeout(() => {
          progressContainer.style.display = 'none';
          statusText.textContent = '';
        }, 1500);

        // ✅ 2. Mostrar imagen
        preview.innerHTML = `<img src="${imgData}" alt="Imagen cargada">`;
        preview.style.border = "2px solid green";

        // ✅ 3. Guardar en localStorage
        try {
          localStorage.setItem("ultimaImagen", imgData);
        } catch (err) {
          console.error("Error al guardar en localStorage:", err);
          statusText.textContent = 'Error al guardar imagen.';
        }

        // Limpiar el valor para permitir subir el mismo archivo otra vez
        fileInput.value = "";
      };

      reader.onerror = function () {
        statusText.textContent = 'Error al leer el archivo.';
        progressContainer.style.display = 'none';
      };

      reader.readAsDataURL(file);
    } else if (file) {
      preview.innerHTML = "Archivo no válido. Por favor, elige una imagen.";
      preview.style.border = "2px dashed #ccc";
      fileInput.value = "";
    }
  });

  clearBtn.addEventListener('click', () => {
    preview.innerHTML = "Aquí verás tu imagen";
    preview.style.border = "2px dashed #ccc";
    fileInput.value = "";

    // Ocultar elementos de carga
    progressContainer.style.display = 'none';
    statusText.textContent = '';

    // ✅ 4. Borrar también de localStorage
    localStorage.removeItem("ultimaImagen");
  });
});
