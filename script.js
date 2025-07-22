// Seleccionamos los elementos por su ID (coinciden con el HTML)
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

// Evento de cambio en el input
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `<img src="${e.target.result}" alt="Imagen cargada">`;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = "Archivo no válido";
  }
});
