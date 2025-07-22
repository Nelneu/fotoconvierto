# 📘 Aprende Desarrollo Web con FotoConvierto

¡Hola! 👋  
Este proyecto se llama **FotoConvierto** y es perfecto para aprender las bases de **desarrollo web**.  
Acá vas a descubrir **cómo funciona cada parte del código**, **cómo trabajan juntas** y **qué mejoras podés hacer para seguir aprendiendo**.

---

## ✅ 1. ¿Qué es una aplicación web?

Una app web es simplemente una página que se ve en el navegador, pero que además **puede hacer cosas** (no solo mostrar texto).  
En este caso, **subimos una foto y la vemos en un recuadro**.

Para construirla usamos tres lenguajes que siempre trabajan juntos:

1. **HTML** → Es el **esqueleto** (estructura).  
2. **CSS** → Es la **ropa** (le da color, forma y estilo).  
3. **JavaScript (JS)** → Es el **cerebro** (le da lógica e interactividad).

Piensalo como una persona:  
- **HTML** son los huesos.  
- **CSS** son la ropa y el peinado.  
- **JS** es lo que te hace pensar y moverte.

---

## ✅ 2. ¿Qué hace cada archivo?

### 📄 **index.html** (El esqueleto)
Este archivo le dice al navegador **qué cosas tiene la página**.  
Por ejemplo:

- Un título (**"Sube tu foto"**).  
- Un botón para elegir la imagen.  
- Un recuadro donde mostrar la imagen.

En el código vas a ver etiquetas como `<div>`, `<h1>`, `<input>` o `<script>`.  
Cada una tiene un propósito especial.

Ejemplo de algo importante:  
```html
<input type="file" id="fileInput" accept="image/*">
<div id="preview">Aquí verás tu imagen</div>
```
- `id="fileInput"` → Es el **botón para subir la imagen**.  
- `id="preview"` → Es el **recuadro donde la imagen se va a mostrar**.

Estos IDs son como **nombres** que después vamos a usar en el JavaScript.

---

### 🎨 **style.css** (La ropa y el estilo)
Acá decidimos **cómo se ve todo**:  
- Colores de fondo.  
- Tamaño del recuadro.  
- Bordes redondeados.  
- Botones bonitos.

Por ejemplo:  
```css
#preview {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  border: 2px dashed #ccc;
}
```
Esto hace que el recuadro tenga un tamaño fijo, esquinas redondeadas y un borde punteado.

Podés jugar cambiando valores:  
- **`200px` → cambiá a 300px** y el recuadro será más grande.  
- **`#ccc` → cambiá el color por `red` o `blue`**.

---

### 🧠 **script.js** (El cerebro)
Este archivo le dice a la página **qué hacer cuando pasa algo**.

- Espera a que elijas una imagen.  
- La lee y la muestra en el recuadro.  

Código clave:
```javascript
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
```
**Traducción a palabras simples:**  
1. `addEventListener('change')` → "Cuando subas un archivo..."  
2. `FileReader()` → "Voy a leerlo para poder mostrarlo."  
3. `preview.innerHTML = ...` → "Pongo la imagen dentro del recuadro."

---

## ✅ 3. ¿Cómo trabajan juntos?

1. **HTML** pone un recuadro vacío.  
2. **CSS** lo pinta y lo hace lindo.  
3. **JS** lo llena con la foto cuando vos subís una.

Si falta uno, nada funciona bien:  
- Sin **HTML**, no hay recuadro.  
- Sin **CSS**, se ve feo.  
- Sin **JS**, no pasa nada cuando subís la foto.

---

## ✅ 4. Cómo abrirlo y probarlo

1. Abrí el archivo `index.html` con doble clic (se abre en el navegador).  
2. Elegí una foto con el botón.  
3. ¡Listo! Deberías verla en el recuadro.

Si cambiás algo en los archivos, **guardá y recargá la página (F5)**.

---

## ✅ 5. Rutas para seguir aprendiendo (pequeños retos)

Acá tenés ideas para ir mejorando la app, paso a paso:

1. **Cambiar colores y fuentes en `style.css`.**  
2. **Hacer que el recuadro sea más grande o más chico.**  
3. **Mostrar el nombre del archivo debajo de la foto.**  
4. **Agregar un botón "Borrar imagen" (JS básico).**  
5. **Guardar la última imagen en el navegador (introducción a `localStorage`).**  
6. **Cambiar el borde a verde cuando la imagen se carga correctamente.**  
7. **Poner un mensaje de error más lindo si no es una imagen.**

Cada cosa nueva te va a enseñar algo:  
- Cambiar CSS te enseña a **diseñar**.  
- Cambiar JS te enseña a **pensar la lógica**.

---

## ✅ 6. Próximos pasos grandes

Cuando ya domines esto:  
- Aprendé a **hacer varias imágenes en una galería**.  
- Hacé un botón para **descargar la imagen**.  
- Pasá a aprender un poco de **HTML avanzado** (formularios, más etiquetas).  
- Sumate a **JavaScript más avanzado** (eventos, funciones, objetos).

---

## 🏆 ¡Felicitaciones!

Con solo entender este proyecto, ya sabés **las bases del desarrollo web moderno**.  
Ahora, cada pequeño cambio que hagas te va a llevar un paso más lejos.

