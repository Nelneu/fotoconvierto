// Seleccionamos los elementos por su ID (coinciden con el HTML)
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const clearBtn = document.getElementById('clearBtn');

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Imagen cargada">`;
      preview.style.border = "2px solid green";
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
  fileInput.value = ""; // Permite volver a subir la misma imagen
});
