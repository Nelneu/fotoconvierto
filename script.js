// Seleccionamos los elementos por su ID (coinciden con el HTML)
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');
const downloadLink = document.getElementById('downloadLink');

// --- Funciones de ayuda ---
function activarDescarga(imgData, filename) {
  downloadLink.href = imgData;
  downloadLink.download = filename;
  downloadLink.style.display = 'inline-block';
}

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
  activarDescarga(ultimaImagen, ultimaImagenNombre || 'imagen-guardada.png');
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target.result;

      // ✅ 2. Mostrar imagen y nombre
      preview.innerHTML = `<img src="${imgData}" alt="Imagen cargada">`;
      preview.innerHTML += `<p style="font-size: 12px; color: #555;">${file.name}</p>`;
      preview.style.border = "2px solid green";

      // ✅ 3. Guardar en localStorage
      localStorage.setItem("ultimaImagen", imgData);
      localStorage.setItem("ultimaImagenNombre", file.name);

      // Activar el botón de descarga
      activarDescarga(imgData, file.name);
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "Archivo no válido";
    preview.style.border = "2px dashed #ccc";
    desactivarDescarga();
  }
});

clearBtn.addEventListener('click', () => {
  preview.innerHTML = "Aquí verás tu imagen";
  preview.style.border = "2px dashed #ccc";
  fileInput.value = "";

  // ✅ 4. Borrar también de localStorage
  localStorage.removeItem("ultimaImagen");
  localStorage.removeItem("ultimaImagenNombre");

  // Desactivar el botón de descarga
  desactivarDescarga();
});
