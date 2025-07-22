# 🗺️ Guía de Aprendizaje Progresivo con FotoConvierto

¡Hola nuevamente! 👋  
Esta **guía paso a paso** está pensada para que vayas **aprendiendo desarrollo web de a poco, sin frustrarte** y mejorando esta misma app cada vez más.

---

## ✅ 1. Nivel 1: Conociendo el HTML y CSS (Bases)
### Objetivo: Entender cómo cambiar la apariencia de la página.

1. **Cambiar el título**  
   - En `index.html`, cambiá `<h1>📸 Sube tu foto</h1>` por algo como **“Mi primera app web”**.  
   - Guardá y recargá.

2. **Cambiar colores y fuentes**  
   - En `style.css`, cambiá:  
     ```css
     body {
       background: lightblue;
       font-family: Arial, sans-serif;
     }
     ```

3. **Jugar con el recuadro**  
   - Agrandalo: cambiá `width: 200px;` a `300px;`.  
   - Cambiá el color del borde `#ccc` por `green`.

✅ **Qué aprendés aquí:** Las bases de HTML (texto) y CSS (estilo).

---

## ✅ 2. Nivel 2: Interactuar con JavaScript (Primeros pasos)
### Objetivo: Empezar a hacer cosas con lógica.

1. **Cambiar el mensaje de error**  
   - En `script.js`, buscá:  
     ```javascript
     preview.innerHTML = "Archivo no válido";
     ```
   - Cambialo por:  
     ```javascript
     preview.innerHTML = "Por favor subí solo imágenes 🙂";
     ```

2. **Cambiar el borde al subir una imagen**  
   - Agregá esto dentro de `reader.onload` (antes de `preview.innerHTML = ...`):  
     ```javascript
     preview.style.border = "2px solid green";
     ```

✅ **Qué aprendés aquí:** Eventos y manipulación del DOM (cómo JS cambia lo que ves en la página).

---

## ✅ 3. Nivel 3: Nuevas funciones pequeñas
### Objetivo: Hacer que la app haga más cosas.

1. **Mostrar el nombre de la imagen**  
   - Después de mostrar la imagen, agregá:  
     ```javascript
     preview.innerHTML += `<p>${file.name}</p>`;
     ```

2. **Agregar un botón para borrar la imagen**  
   - En `index.html`, debajo del `preview`, agregá:  
     ```html
     <button id="clearBtn">Borrar imagen</button>
     ```
   - En `script.js`, al final:  
     ```javascript
     const clearBtn = document.getElementById('clearBtn');
     clearBtn.addEventListener('click', () => {
       preview.innerHTML = "Aquí verás tu imagen";
       preview.style.border = "2px dashed #ccc";
     });
     ```

✅ **Qué aprendés aquí:** Más eventos (`click`) y reutilizar IDs.

---

## ✅ 4. Nivel 4: Guardar información (Introducción a localStorage)
### Objetivo: Mantener la imagen aunque recargues la página.

1. **Guardar la imagen cuando se sube**  
   - Dentro de `reader.onload`:  
     ```javascript
     localStorage.setItem("ultimaImagen", e.target.result);
     ```

2. **Mostrarla al abrir la página**  
   - Al final del archivo, agregá:  
     ```javascript
     const ultimaImagen = localStorage.getItem("ultimaImagen");
     if (ultimaImagen) {
       preview.innerHTML = `<img src="${ultimaImagen}" alt="Imagen guardada">`;
       preview.style.border = "2px solid green";
     }
     ```

✅ **Qué aprendés aquí:** Qué es guardar datos en el navegador.

---

## ✅ 5. Nivel 5: Convertirlo en algo más pro
### Objetivo: Pensar como un desarrollador.

- **Hacer una galería**: que muestre varias imágenes una al lado de la otra.  
- **Poner un contador de imágenes subidas**.  
- **Diseñar un botón para descargar la imagen.**  
- **Cambiar el estilo con temas (modo claro/oscuro).**

Cada una de estas mejoras es un mini-proyecto.

---

## ✅ 6. Consejos para avanzar sin frustrarte

1. **Hacé un cambio por vez.** Probá y entendé qué hace.  
2. **Guardá seguido.** Si algo falla, volvé al commit anterior.  
3. **Anotá lo que aprendés** (un cuaderno o en el README).  
4. **Pedí ayuda cuando algo no salga**, pero primero tratá de leer el error y entenderlo.

---

## 🎯 ¡Meta final!

Cuando completes todos los niveles, vas a haber aprendido:  
✔ HTML (estructura)  
✔ CSS (diseño)  
✔ JavaScript (lógica básica e intermedia)  
✔ Conceptos de almacenamiento local y manejo de eventos

¡Con esto vas a estar listo para crear proyectos más grandes, como una galería de fotos o un mini-juego!

