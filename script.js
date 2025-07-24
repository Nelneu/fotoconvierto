// Seleccionamos los elementos por su ID (coinciden con el HTML)
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');

// ✅ 1. Mostrar la última imagen guardada al cargar la página
const ultimaImagen = localStorage.getItem("ultimaImagen");
if (ultimaImagen) {
  preview.innerHTML = `<img src="${ultimaImagen}" alt="Imagen guardada">`;
  preview.style.border = "2px solid green";
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imgData = e.target.result;

      // ✅ 2. Mostrar imagen
      preview.innerHTML = `<img src="${imgData}" alt="Imagen cargada">`;
      preview.style.border = "2px solid green";

      // ✅ 3. Guardar en localStorage
      localStorage.setItem("ultimaImagen", imgData);
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "Archivo no válido";
    preview.style.border = "2px dashed #ccc";
  }
});

clearBtn.addEventListener('click', () => {
  preview.innerHTML = "Aquí verás tu imagen";
  preview.style.border = "2px dashed #ccc";
  fileInput.value = "";

  // ✅ 4. Borrar también de localStorage
  localStorage.removeItem("ultimaImagen");
});
