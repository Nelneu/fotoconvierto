# 📋 Plan de Implementación - FotoConvierto Editor de Fotos

## 🎯 Objetivo
Convertir FotoConvierto de una herramienta simple de carga de imágenes a un editor de fotos completo pero simple, manteniendo la filosofía vanilla (sin frameworks) y el enfoque educativo.

---

## 🏗️ Arquitectura Propuesta

### Estructura de Archivos Nueva
```
fotoconvierto/
├── index.html                  # HTML principal (refactorizado)
├── style.css                   # Estilos base (ampliado)
├── css/
│   ├── editor.css              # Estilos del panel de edición
│   └── filters.css             # Estilos de controles de filtros
├── js/
│   ├── main.js                 # Inicialización y orquestación
│   ├── canvas-manager.js       # Gestión del canvas y renderizado
│   ├── filters.js              # Funciones de filtros de imagen
│   ├── transforms.js           # Rotación, volteo, recorte
│   ├── text-tool.js            # Herramienta de texto
│   ├── history.js              # Deshacer/Rehacer
│   ├── export.js               # Descarga y exportación
│   └── ui-controls.js          # Gestión de controles UI
├── assets/
│   └── icons/                  # SVG icons (opcional)
├── script.js                   # LEGACY - Lo migraremos gradualmente
├── favicon.png
└── README.md
```

### Principios de Diseño
1. **Progressive Enhancement**: Cada fase añade funcionalidad sin romper la anterior
2. **Vanilla JavaScript**: Sin dependencias externas (excepto Google Fonts)
3. **Mobile-First**: Diseño responsive desde el inicio
4. **LocalStorage**: Mantener la persistencia actual y añadir configuraciones
5. **Educativo**: Código comentado en español

---

## 📅 FASES DE IMPLEMENTACIÓN

---

## **FASE 1: INTEGRAR CANVAS Y REFACTORIZAR ESTRUCTURA BASE**

### Objetivos
- Reemplazar el `<div id="preview">` con un `<canvas>` editable
- Mantener funcionalidad actual (carga, vista previa, borrar)
- Crear módulo `canvas-manager.js` para centralizar lógica de canvas

### Pasos Detallados

#### 1.1 Modificar HTML (`index.html`)
**Cambios:**
```html
<!-- ANTES -->
<div id="preview">Aquí verás tu imagen</div>

<!-- DESPUÉS -->
<div id="canvas-container">
  <canvas id="mainCanvas"></canvas>
  <div id="placeholder">📸 Sube una imagen para comenzar</div>
</div>
```

**Agregar estructura de controles:**
```html
<div class="editor-controls" style="display: none;">
  <div class="controls-section">
    <h3>🎨 Editar</h3>
    <!-- Se llenará en fases siguientes -->
  </div>
</div>
```

#### 1.2 Crear `js/canvas-manager.js`
**Responsabilidades:**
- Inicializar canvas con dimensiones adecuadas
- Cargar imagen en canvas desde FileReader
- Renderizar imagen actual
- Obtener datos de imagen para exportación
- Redimensionar canvas al cambiar ventana

**Funciones clave:**
```javascript
class CanvasManager {
  constructor(canvasId)
  loadImage(file)
  renderImage()
  getImageData()
  resetCanvas()
  exportImage(format, quality)
}
```

#### 1.3 Migrar lógica de `script.js` a `js/main.js`
**Mantener:**
- Event listeners de carga de archivo
- Barra de progreso
- LocalStorage (adaptar para canvas)
- Validación de archivos

**Adaptar:**
- En lugar de `preview.innerHTML`, usar `canvasManager.loadImage(file)`
- Guardar en localStorage como base64 del canvas

#### 1.4 Actualizar CSS (`style.css` y nuevo `css/editor.css`)
**Estilos para canvas:**
```css
#canvas-container {
  position: relative;
  max-width: 100%;
  max-height: 600px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

#mainCanvas {
  max-width: 100%;
  height: auto;
  display: block;
}

#placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ccc;
  pointer-events: none;
}
```

#### 1.5 Testing Fase 1
- ✅ Carga de imagen funciona y se muestra en canvas
- ✅ Barra de progreso sigue funcionando
- ✅ LocalStorage guarda y recupera imagen
- ✅ Botón borrar limpia canvas
- ✅ Responsive en móvil y desktop

**Tiempo estimado:** Base sólida para todo lo demás

---

## **FASE 2: IMPLEMENTAR FILTROS BÁSICOS**

### Objetivos
- Añadir sliders para 5 filtros básicos:
  - Brillo (-100 a 100)
  - Contraste (-100 a 100)
  - Saturación (0 a 200)
  - Desenfoque (0 a 10)
  - Escala de grises (0 a 100)

### Pasos Detallados

#### 2.1 Crear `js/filters.js`
**Estructura:**
```javascript
class ImageFilters {
  constructor(canvasManager)

  // Filtros individuales
  applyBrightness(value)
  applyContrast(value)
  applySaturation(value)
  applyBlur(value)
  applyGrayscale(value)

  // Aplicar todos los filtros acumulados
  applyAllFilters(filterState)

  // Resetear filtros
  resetFilters()
}
```

**Implementación técnica:**
- Usar `getImageData()` para manipular píxeles
- Para brillo/contraste: modificar valores RGB
- Para saturación: convertir a HSL, modificar S, volver a RGB
- Para blur: usar `ctx.filter = 'blur(Xpx)'`
- Para grayscale: promedio RGB o `ctx.filter = 'grayscale(X%)'`

#### 2.2 Actualizar HTML - Panel de Filtros
```html
<div class="controls-section" id="filters-panel">
  <h3>🎨 Filtros</h3>

  <div class="filter-control">
    <label for="brightness">☀️ Brillo</label>
    <input type="range" id="brightness" min="-100" max="100" value="0">
    <span class="filter-value">0</span>
  </div>

  <div class="filter-control">
    <label for="contrast">🌗 Contraste</label>
    <input type="range" id="contrast" min="-100" max="100" value="0">
    <span class="filter-value">0</span>
  </div>

  <!-- Repetir para saturación, blur, grayscale -->

  <button id="reset-filters" class="btn-secondary">↺ Resetear Filtros</button>
</div>
```

#### 2.3 Crear `js/ui-controls.js`
**Responsabilidad:**
- Escuchar eventos de sliders
- Actualizar valores mostrados
- Llamar a `filters.applyAllFilters()` en tiempo real
- Debouncing para performance (aplicar cada 100ms)

#### 2.4 Actualizar CSS (`css/filters.css`)
**Estilos modernos para sliders:**
```css
.filter-control {
  margin-bottom: 15px;
}

.filter-control label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, #ddd 0%, #ff6600 50%, #ddd 100%);
}

/* Custom thumb styling */
input[type="range"]::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  background: #ff6600;
  cursor: pointer;
  border-radius: 50%;
}
```

#### 2.5 Estado de Filtros
**Gestión de estado:**
```javascript
// Estado global de filtros
const filterState = {
  brightness: 0,
  contrast: 0,
  saturation: 100,
  blur: 0,
  grayscale: 0
};
```

**Persistencia:**
- Guardar `filterState` en localStorage
- Restaurar al recargar página
- Aplicar filtros guardados automáticamente

#### 2.6 Testing Fase 2
- ✅ Cada slider modifica la imagen en tiempo real
- ✅ Valores se muestran junto a cada slider
- ✅ Resetear filtros vuelve a la imagen original
- ✅ Filtros se combinan correctamente (no se sobreescriben)
- ✅ Performance aceptable (< 100ms de latencia)

---

## **FASE 3: AÑADIR ROTACIÓN Y VOLTEO**

### Objetivos
- Rotar imagen 90° (izquierda/derecha)
- Voltear horizontal y verticalmente
- Mantener calidad de imagen

### Pasos Detallados

#### 3.1 Crear `js/transforms.js`
```javascript
class ImageTransforms {
  constructor(canvasManager)

  rotate90CW()        // Rotar 90° sentido horario
  rotate90CCW()       // Rotar 90° antihorario
  flipHorizontal()    // Volteo horizontal
  flipVertical()      // Volteo vertical

  // Estado interno
  currentRotation = 0    // 0, 90, 180, 270
  isFlippedH = false
  isFlippedV = false
}
```

**Implementación:**
```javascript
rotate90CW() {
  const canvas = this.canvasManager.canvas;
  const ctx = canvas.getContext('2d');

  // Crear canvas temporal con dimensiones invertidas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.height;
  tempCanvas.height = canvas.width;
  const tempCtx = tempCanvas.getContext('2d');

  // Rotar y dibujar
  tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
  tempCtx.rotate(Math.PI / 2);
  tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  // Actualizar canvas principal
  canvas.width = tempCanvas.width;
  canvas.height = tempCanvas.height;
  ctx.drawImage(tempCanvas, 0, 0);

  this.currentRotation = (this.currentRotation + 90) % 360;
}
```

#### 3.2 Actualizar HTML - Panel de Transformaciones
```html
<div class="controls-section" id="transforms-panel">
  <h3>🔄 Transformar</h3>

  <div class="button-group">
    <button id="rotate-left" class="btn-icon" title="Rotar izquierda">↶</button>
    <button id="rotate-right" class="btn-icon" title="Rotar derecha">↷</button>
  </div>

  <div class="button-group">
    <button id="flip-horizontal" class="btn-icon" title="Voltear horizontal">↔️</button>
    <button id="flip-vertical" class="btn-icon" title="Voltear vertical">↕️</button>
  </div>
</div>
```

#### 3.3 CSS para Botones de Transformación
```css
.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-icon {
  flex: 1;
  padding: 12px;
  font-size: 20px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: #ff6600;
  color: white;
  border-color: #ff6600;
  transform: scale(1.05);
}
```

#### 3.4 Integrar con Historial (preparación para Fase 8)
- Cada transformación guarda el estado previo
- Permite deshacer/rehacer

#### 3.5 Testing Fase 3
- ✅ Rotación cambia dimensiones correctamente
- ✅ Volteos no distorsionan la imagen
- ✅ Múltiples transformaciones se acumulan bien
- ✅ Filtros persisten después de transformar

---

## **FASE 4: IMPLEMENTAR FUNCIONALIDAD DE DESCARGA**

### Objetivos
- Descargar imagen editada
- Selector de formato (PNG, JPEG, WebP)
- Selector de calidad (solo JPEG)
- Nombre de archivo personalizable

### Pasos Detallados

#### 4.1 Crear `js/export.js`
```javascript
class ImageExporter {
  constructor(canvasManager)

  downloadImage(filename, format, quality)
  getFormats() // ['png', 'jpeg', 'webp']

  // Utilidades
  sanitizeFilename(name)
  getDefaultFilename()
}
```

**Implementación descarga:**
```javascript
downloadImage(filename, format, quality) {
  const canvas = this.canvasManager.canvas;
  const mimeType = `image/${format}`;

  // Convertir canvas a blob
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, mimeType, quality);
}
```

#### 4.2 Actualizar HTML - Panel de Exportación
```html
<div class="controls-section" id="export-panel">
  <h3>💾 Exportar</h3>

  <div class="form-group">
    <label for="filename">Nombre de archivo</label>
    <input type="text" id="filename" value="mi-foto-editada" placeholder="sin extensión">
  </div>

  <div class="form-group">
    <label for="format">Formato</label>
    <select id="format">
      <option value="png">PNG (sin pérdida)</option>
      <option value="jpeg" selected>JPEG (comprimido)</option>
      <option value="webp">WebP (moderno)</option>
    </select>
  </div>

  <div class="form-group" id="quality-group">
    <label for="quality">Calidad JPEG: <span id="quality-value">90</span>%</label>
    <input type="range" id="quality" min="1" max="100" value="90">
  </div>

  <button id="download-btn" class="btn-primary">⬇️ Descargar Imagen</button>
</div>
```

#### 4.3 Lógica de UI
- Mostrar/ocultar slider de calidad según formato
- Validar nombre de archivo
- Preview del tamaño estimado (opcional)

#### 4.4 Testing Fase 4
- ✅ Descarga funciona en Chrome, Firefox, Safari
- ✅ Formatos PNG, JPEG, WebP se generan correctamente
- ✅ Calidad JPEG afecta el tamaño del archivo
- ✅ Nombre de archivo se respeta
- ✅ Caracteres especiales en nombre se sanean

---

## **FASE 5: AÑADIR COMPARACIÓN ANTES/DESPUÉS**

### Objetivos
- Toggle para ver imagen original vs editada
- Slider divisor (antes/después lado a lado)
- Botón de comparación rápida

### Pasos Detallados

#### 5.1 Guardar Imagen Original
**En `canvas-manager.js`:**
```javascript
class CanvasManager {
  originalImage = null;  // Guardar Image() original

  loadImage(file) {
    const img = new Image();
    img.onload = () => {
      this.originalImage = img;  // ✅ Guardar referencia
      // ... renderizar en canvas
    };
  }
}
```

#### 5.2 Crear Modo Comparación
**Opción A: Toggle Simple**
```javascript
toggleComparison() {
  if (this.showingOriginal) {
    this.renderEditedImage();
  } else {
    this.renderOriginalImage();
  }
  this.showingOriginal = !this.showingOriginal;
}
```

**Opción B: Slider Divisor (más avanzado)**
```javascript
// Renderizar mitad original, mitad editada
renderSplitView(splitPosition) {
  const ctx = this.canvas.getContext('2d');
  const width = this.canvas.width;
  const height = this.canvas.height;

  // Mitad izquierda: original
  ctx.drawImage(this.originalImage,
    0, 0, width * splitPosition, height,
    0, 0, width * splitPosition, height
  );

  // Mitad derecha: editada
  ctx.drawImage(this.editedCanvas,
    width * splitPosition, 0, width * (1 - splitPosition), height,
    width * splitPosition, 0, width * (1 - splitPosition), height
  );
}
```

#### 5.3 HTML - Controles de Comparación
```html
<div class="controls-section" id="comparison-panel">
  <h3>⚖️ Comparar</h3>

  <button id="toggle-comparison" class="btn-secondary">
    👁️ Ver Original
  </button>

  <!-- Opcional: Slider divisor -->
  <div id="split-view-control" style="display: none;">
    <input type="range" id="split-slider" min="0" max="100" value="50">
    <div class="split-labels">
      <span>Original</span>
      <span>Editada</span>
    </div>
  </div>
</div>
```

#### 5.4 CSS - Indicador Visual
```css
#canvas-container.comparing::before {
  content: 'ORIGINAL';
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
}
```

#### 5.5 Testing Fase 5
- ✅ Toggle muestra original sin ediciones
- ✅ Volver a editada restaura filtros
- ✅ Slider divisor funciona suavemente
- ✅ Indicador visual claro de qué se está mostrando

---

## **FASE 6: IMPLEMENTAR HERRAMIENTA DE RECORTE**

### Objetivos
- Selector de área rectangular con drag
- Proporciones predefinidas (libre, 1:1, 4:3, 16:9)
- Botón "Aplicar recorte"

### Pasos Detallados

#### 6.1 Añadir a `js/transforms.js`
```javascript
class CropTool {
  constructor(canvasManager)

  // Estado de recorte
  cropRect = { x: 0, y: 0, width: 0, height: 0 }
  isDragging = false
  aspectRatio = null  // null = libre, 1 = 1:1, 4/3, 16/9

  // Métodos
  startCrop()
  updateCropRect(x, y, width, height)
  applyCrop()
  cancelCrop()
  setAspectRatio(ratio)
}
```

#### 6.2 Dibujar Selector Visual
```javascript
drawCropOverlay() {
  const ctx = this.canvas.getContext('2d');

  // Oscurecer área fuera del recorte
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  // Limpiar área de recorte
  ctx.clearRect(
    this.cropRect.x,
    this.cropRect.y,
    this.cropRect.width,
    this.cropRect.height
  );

  // Dibujar borde del recorte
  ctx.strokeStyle = '#ff6600';
  ctx.lineWidth = 3;
  ctx.strokeRect(
    this.cropRect.x,
    this.cropRect.y,
    this.cropRect.width,
    this.cropRect.height
  );

  // Dibujar handles en las esquinas (para redimensionar)
  this.drawHandles();
}
```

#### 6.3 Event Listeners para Drag
```javascript
canvas.addEventListener('mousedown', (e) => {
  if (!this.cropMode) return;
  this.isDragging = true;
  this.startX = e.offsetX;
  this.startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (!this.isDragging) return;

  let width = e.offsetX - this.startX;
  let height = e.offsetY - this.startY;

  // Aplicar aspect ratio si está definido
  if (this.aspectRatio) {
    height = width / this.aspectRatio;
  }

  this.updateCropRect(this.startX, this.startY, width, height);
  this.drawCropOverlay();
});

canvas.addEventListener('mouseup', () => {
  this.isDragging = false;
});
```

#### 6.4 HTML - Panel de Recorte
```html
<div class="controls-section" id="crop-panel">
  <h3>✂️ Recortar</h3>

  <div class="form-group">
    <label>Proporción</label>
    <select id="crop-ratio">
      <option value="free">Libre</option>
      <option value="1">Cuadrado (1:1)</option>
      <option value="1.33">4:3</option>
      <option value="1.78">16:9 (Instagram)</option>
      <option value="0.56">9:16 (Stories)</option>
    </select>
  </div>

  <button id="start-crop" class="btn-secondary">Iniciar Recorte</button>
  <button id="apply-crop" class="btn-primary" style="display:none;">✓ Aplicar</button>
  <button id="cancel-crop" class="btn-secondary" style="display:none;">✗ Cancelar</button>
</div>
```

#### 6.5 Aplicar Recorte
```javascript
applyCrop() {
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = this.cropRect.width;
  croppedCanvas.height = this.cropRect.height;

  const ctx = croppedCanvas.getContext('2d');
  ctx.drawImage(
    this.canvas,
    this.cropRect.x, this.cropRect.y,
    this.cropRect.width, this.cropRect.height,
    0, 0,
    this.cropRect.width, this.cropRect.height
  );

  // Reemplazar canvas principal
  this.canvas.width = croppedCanvas.width;
  this.canvas.height = croppedCanvas.height;
  this.canvas.getContext('2d').drawImage(croppedCanvas, 0, 0);

  this.cropMode = false;
}
```

#### 6.6 Testing Fase 6
- ✅ Selector de área funciona con mouse y touch
- ✅ Proporciones se mantienen correctamente
- ✅ Recorte aplicado reduce dimensiones del canvas
- ✅ Cancelar recorte restaura estado anterior
- ✅ Handles de redimensionamiento funcionan

---

## **FASE 7: AÑADIR TEXTO SOBRE IMAGEN**

### Objetivos
- Input de texto que se renderiza sobre el canvas
- Selección de fuente, tamaño y color
- Posicionamiento con drag & drop

### Pasos Detallados

#### 7.1 Crear `js/text-tool.js`
```javascript
class TextTool {
  constructor(canvasManager)

  // Estado de textos
  textElements = []  // Array de objetos { text, x, y, font, size, color }
  selectedText = null

  // Métodos
  addText(text, x, y, options)
  deleteText(index)
  updateText(index, newText)
  renderAllTexts()
  selectText(x, y)  // Click para seleccionar
  moveText(dx, dy)  // Drag para mover
}
```

#### 7.2 Renderizar Texto en Canvas
```javascript
renderAllTexts() {
  const ctx = this.canvas.getContext('2d');

  this.textElements.forEach((textEl, index) => {
    ctx.font = `${textEl.size}px ${textEl.font}`;
    ctx.fillStyle = textEl.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra para legibilidad
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(textEl.text, textEl.x, textEl.y);

    // Si está seleccionado, dibujar borde
    if (index === this.selectedText) {
      this.drawTextBounds(textEl);
    }
  });
}
```

#### 7.3 Drag & Drop para Posicionar
```javascript
canvas.addEventListener('mousedown', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  // Verificar si se clickeó un texto
  this.selectedText = this.findTextAt(x, y);
  if (this.selectedText !== null) {
    this.isDraggingText = true;
    this.dragStartX = x;
    this.dragStartY = y;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!this.isDraggingText || this.selectedText === null) return;

  const dx = e.offsetX - this.dragStartX;
  const dy = e.offsetY - this.dragStartY;

  this.textElements[this.selectedText].x += dx;
  this.textElements[this.selectedText].y += dy;

  this.dragStartX = e.offsetX;
  this.dragStartY = e.offsetY;

  this.renderAllTexts();
});
```

#### 7.4 HTML - Panel de Texto
```html
<div class="controls-section" id="text-panel">
  <h3>🔤 Texto</h3>

  <div class="form-group">
    <input type="text" id="text-input" placeholder="Escribe tu texto aquí">
  </div>

  <div class="form-group">
    <label for="text-font">Fuente</label>
    <select id="text-font">
      <option value="Poppins">Poppins</option>
      <option value="Arial">Arial</option>
      <option value="Impact">Impact</option>
      <option value="Georgia">Georgia</option>
    </select>
  </div>

  <div class="form-group">
    <label for="text-size">Tamaño: <span id="text-size-value">32</span>px</label>
    <input type="range" id="text-size" min="12" max="120" value="32">
  </div>

  <div class="form-group">
    <label for="text-color">Color</label>
    <input type="color" id="text-color" value="#ffffff">
  </div>

  <button id="add-text" class="btn-primary">+ Añadir Texto</button>
  <button id="delete-text" class="btn-secondary" disabled>🗑️ Eliminar</button>
</div>
```

#### 7.5 Guardar Textos con LocalStorage
```javascript
saveToLocalStorage() {
  const state = {
    image: this.canvas.toDataURL(),
    texts: this.textElements,
    filters: this.filterState
  };
  localStorage.setItem('fotoconvierto-state', JSON.stringify(state));
}
```

#### 7.6 Testing Fase 7
- ✅ Texto se añade al centro del canvas
- ✅ Drag & drop mueve el texto seleccionado
- ✅ Color y fuente se aplican correctamente
- ✅ Múltiples textos pueden coexistir
- ✅ Eliminar texto funciona
- ✅ Textos persisten en localStorage

---

## **FASE 8: IMPLEMENTAR DESHACER/REHACER (HISTORIAL)**

### Objetivos
- Stack de estados del canvas
- Botones Deshacer (Ctrl+Z) y Rehacer (Ctrl+Shift+Z)
- Límite de historial (últimos 20 estados)

### Pasos Detallados

#### 8.1 Crear `js/history.js`
```javascript
class HistoryManager {
  constructor(canvasManager, maxStates = 20)

  // Stacks
  undoStack = []
  redoStack = []

  // Métodos
  saveState(description)
  undo()
  redo()
  clear()
  canUndo()
  canRedo()
}
```

#### 8.2 Guardar Estados como DataURL
```javascript
saveState(description = 'Cambio') {
  const state = {
    imageData: this.canvasManager.canvas.toDataURL(),
    filters: { ...this.canvasManager.filterState },
    texts: [...this.canvasManager.textElements],
    timestamp: Date.now(),
    description: description
  };

  this.undoStack.push(state);

  // Limitar tamaño del stack
  if (this.undoStack.length > this.maxStates) {
    this.undoStack.shift();
  }

  // Limpiar redo stack al hacer nuevo cambio
  this.redoStack = [];

  this.updateUI();
}
```

#### 8.3 Restaurar Estado
```javascript
undo() {
  if (!this.canUndo()) return;

  // Guardar estado actual en redo stack
  const currentState = this.getCurrentState();
  this.redoStack.push(currentState);

  // Restaurar estado anterior
  const previousState = this.undoStack.pop();
  this.restoreState(previousState);

  this.updateUI();
}

restoreState(state) {
  const img = new Image();
  img.onload = () => {
    this.canvasManager.loadImageFromDataURL(state.imageData);
    this.canvasManager.filterState = state.filters;
    this.canvasManager.textElements = state.texts;
    this.canvasManager.render();
  };
  img.src = state.imageData;
}
```

#### 8.4 Integrar con Todas las Acciones
**En cada función que modifica el canvas:**
```javascript
// Ejemplo: Al aplicar filtro
applyFilter(filterName, value) {
  this.historyManager.saveState(`Aplicar ${filterName}`);
  // ... aplicar filtro
}

// Al rotar
rotate90() {
  this.historyManager.saveState('Rotar 90°');
  // ... rotar
}

// Al recortar
applyCrop() {
  this.historyManager.saveState('Recortar imagen');
  // ... recortar
}
```

#### 8.5 HTML - Botones de Historial
```html
<div class="history-controls">
  <button id="undo-btn" class="btn-icon" title="Deshacer (Ctrl+Z)" disabled>
    ↶ Deshacer
  </button>
  <button id="redo-btn" class="btn-icon" title="Rehacer (Ctrl+Shift+Z)" disabled>
    ↷ Rehacer
  </button>
</div>
```

#### 8.6 Atajos de Teclado
```javascript
document.addEventListener('keydown', (e) => {
  // Ctrl+Z: Deshacer
  if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    this.historyManager.undo();
  }

  // Ctrl+Shift+Z: Rehacer
  if (e.ctrlKey && e.shiftKey && e.key === 'z') {
    e.preventDefault();
    this.historyManager.redo();
  }

  // Ctrl+S: Descargar
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    this.exporter.downloadImage();
  }
});
```

#### 8.7 Optimización de Memoria
**Problema:** DataURLs consumen mucha memoria

**Solución:**
- Comprimir estados antiguos
- Limitar a 20 estados máximo
- Usar IndexedDB para historial grande (opcional)

#### 8.8 Testing Fase 8
- ✅ Deshacer restaura el estado anterior
- ✅ Rehacer funciona después de deshacer
- ✅ Nuevo cambio limpia el redo stack
- ✅ Botones se deshabilitan cuando no hay estados
- ✅ Atajos de teclado funcionan
- ✅ No hay fugas de memoria con muchos deshacer/rehacer

---

## **FASE 9: AÑADIR MÁS FILTROS Y EFECTOS ESPECIALES**

### Objetivos
- Filtros adicionales (Sepia, Invertir, Nitidez)
- Viñeta (oscurecer bordes)
- Presets de filtros (Vintage, Dramático, Cálido)

### Pasos Detallados

#### 9.1 Ampliar `js/filters.js`

**Nuevos filtros:**
```javascript
// Sepia
applySepia(intensity) {
  const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }

  this.ctx.putImageData(imageData, 0, 0);
}

// Invertir colores
applyInvert() {
  const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];       // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
  }

  this.ctx.putImageData(imageData, 0, 0);
}

// Viñeta
applyVignette(intensity) {
  const gradient = this.ctx.createRadialGradient(
    this.canvas.width / 2, this.canvas.height / 2, 0,
    this.canvas.width / 2, this.canvas.height / 2,
    Math.max(this.canvas.width, this.canvas.height) / 2
  );

  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);

  this.ctx.fillStyle = gradient;
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
```

#### 9.2 Sistema de Presets
```javascript
const filterPresets = {
  vintage: {
    brightness: -10,
    contrast: 20,
    saturation: 80,
    sepia: 40,
    vignette: 0.3
  },
  dramatic: {
    brightness: -20,
    contrast: 50,
    saturation: 120,
    vignette: 0.5
  },
  warm: {
    brightness: 10,
    saturation: 110,
    // Tinte cálido personalizado
  },
  cold: {
    brightness: 5,
    saturation: 90,
    // Tinte frío personalizado
  }
};

applyPreset(presetName) {
  const preset = filterPresets[presetName];
  Object.keys(preset).forEach(filter => {
    this.filterState[filter] = preset[filter];
  });
  this.applyAllFilters();
}
```

#### 9.3 HTML - Panel de Efectos
```html
<div class="controls-section" id="effects-panel">
  <h3>✨ Efectos Especiales</h3>

  <div class="filter-control">
    <label for="sepia">🍂 Sepia</label>
    <input type="range" id="sepia" min="0" max="100" value="0">
    <span class="filter-value">0</span>
  </div>

  <div class="filter-control">
    <label for="vignette">🌑 Viñeta</label>
    <input type="range" id="vignette" min="0" max="100" value="0">
    <span class="filter-value">0</span>
  </div>

  <button id="invert-btn" class="btn-secondary">🔄 Invertir Colores</button>

  <hr>
  <h4>Presets Rápidos</h4>
  <div class="preset-buttons">
    <button class="btn-preset" data-preset="vintage">📷 Vintage</button>
    <button class="btn-preset" data-preset="dramatic">🎭 Dramático</button>
    <button class="btn-preset" data-preset="warm">🔥 Cálido</button>
    <button class="btn-preset" data-preset="cold">❄️ Frío</button>
  </div>
</div>
```

#### 9.4 CSS - Botones de Presets
```css
.preset-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-preset {
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s;
}

.btn-preset:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
```

#### 9.5 Testing Fase 9
- ✅ Nuevos filtros se aplican correctamente
- ✅ Presets cargan combinaciones de filtros
- ✅ Viñeta se ve natural
- ✅ Invertir colores funciona
- ✅ Presets se pueden modificar manualmente después

---

## **FASE 10: MEJORAR UI/UX Y HACER RESPONSIVE COMPLETO**

### Objetivos
- Layout profesional con sidebar de controles
- Modo claro/oscuro
- Responsive perfecto (móvil/tablet/desktop)
- Animaciones y micro-interacciones
- Tutorial de primer uso

### Pasos Detallados

#### 10.1 Rediseñar Layout Principal
```html
<body>
  <header class="app-header">
    <h1>📸 FotoConvierto</h1>
    <div class="header-actions">
      <button id="theme-toggle">🌙</button>
      <button id="help-btn">❓</button>
    </div>
  </header>

  <main class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <label for="fileInput" class="upload-btn-new">
          📁 Cargar Imagen
        </label>
        <input type="file" id="fileInput" accept="image/*" hidden>
      </div>

      <div class="controls-wrapper">
        <!-- Todos los paneles de control aquí -->
      </div>
    </aside>

    <section class="canvas-area">
      <div id="canvas-container">
        <canvas id="mainCanvas"></canvas>
        <div id="placeholder">📸 Sube una imagen para comenzar</div>
      </div>

      <div class="canvas-footer">
        <div class="history-controls"><!-- Deshacer/Rehacer --></div>
        <div class="zoom-controls"><!-- Zoom in/out --></div>
      </div>
    </section>
  </main>

  <div id="tutorial-overlay" class="hidden">
    <!-- Tutorial interactivo -->
  </div>
</body>
```

#### 10.2 CSS Responsive
```css
/* Mobile First */
.app-container {
  display: flex;
  flex-direction: column;
}

.sidebar {
  width: 100%;
  max-height: 40vh;
  overflow-y: auto;
}

.canvas-area {
  flex: 1;
  padding: 20px;
}

/* Tablet y Desktop */
@media (min-width: 768px) {
  .app-container {
    flex-direction: row;
  }

  .sidebar {
    width: 320px;
    max-height: 100vh;
    border-right: 1px solid #ddd;
  }

  .canvas-area {
    flex: 1;
  }
}
```

#### 10.3 Tema Claro/Oscuro
```javascript
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.applyTheme(this.currentTheme);
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }
}
```

**CSS Variables:**
```css
:root.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent: #ff6600;
  --border: #ddd;
}

:root.dark-theme {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --accent: #ff8833;
  --border: #444;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
}
```

#### 10.4 Tutorial Interactivo
```javascript
class Tutorial {
  steps = [
    {
      target: '#fileInput',
      title: '1. Carga tu imagen',
      description: 'Haz clic aquí para seleccionar una foto de tu dispositivo'
    },
    {
      target: '#filters-panel',
      title: '2. Aplica filtros',
      description: 'Usa los sliders para ajustar brillo, contraste y más'
    },
    {
      target: '#download-btn',
      title: '3. Descarga tu creación',
      description: 'Cuando estés listo, descarga tu foto editada'
    }
  ];

  show() {
    // Mostrar overlay con steps
    // Highlight del elemento target
    // Botones Siguiente/Anterior/Saltar
  }
}
```

#### 10.5 Animaciones y Transiciones
```css
/* Loading spinner al cargar imagen */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--accent);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

/* Fade in para paneles */
.controls-section {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hover effects */
button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

#### 10.6 Toasts para Notificaciones
```javascript
class Toast {
  show(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Uso
toast.show('✅ Imagen descargada correctamente', 'success');
toast.show('⚠️ Error al aplicar filtro', 'error');
```

#### 10.7 Testing Fase 10
- ✅ Responsive funciona en móvil, tablet y desktop
- ✅ Tema oscuro/claro se cambia suavemente
- ✅ Tutorial se muestra en primer uso
- ✅ Animaciones no causan lag
- ✅ Touch gestures funcionan en móvil
- ✅ Accesibilidad (navegación por teclado, labels)

---

## 🎯 RESUMEN DE PRIORIDADES

### **MVP (Mínimo Producto Viable) - Implementar primero:**
1. ✅ Fase 1: Canvas base
2. ✅ Fase 2: Filtros básicos
3. ✅ Fase 3: Rotación/volteo
4. ✅ Fase 4: Descarga
5. ✅ Fase 8: Deshacer/Rehacer (crítico para UX)

**Con esto ya tienes un editor funcional básico.**

---

### **Fase 2 - Funcionalidades Intermedias:**
6. ✅ Fase 5: Comparación antes/después
7. ✅ Fase 9: Más filtros y presets
8. ✅ Fase 10: UI/UX mejorada

**Con esto tienes un editor competitivo.**

---

### **Fase 3 - Funcionalidades Avanzadas:**
9. ✅ Fase 6: Recorte (complejo pero muy útil)
10. ✅ Fase 7: Texto sobre imagen

**Con esto tienes un editor completo.**

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

```
SPRINT 1 (Base fundamental):
- Fase 1: Canvas + Refactorización
- Fase 2: Filtros básicos
- Fase 4: Descarga

SPRINT 2 (Transformaciones):
- Fase 3: Rotación y volteo
- Fase 8: Historial (Deshacer/Rehacer)

SPRINT 3 (Funcionalidades cool):
- Fase 5: Comparación antes/después
- Fase 9: Más filtros y presets

SPRINT 4 (Avanzado):
- Fase 6: Herramienta de recorte
- Fase 7: Texto sobre imagen

SPRINT 5 (Polish):
- Fase 10: UI/UX profesional
- Testing exhaustivo
- Documentación actualizada
```

---

## 📊 ESTIMACIÓN DE COMPLEJIDAD

| Fase | Complejidad | Impacto en UX | Prioridad |
|------|-------------|---------------|-----------|
| 1. Canvas base | Media | 🔥🔥🔥🔥🔥 | CRÍTICA |
| 2. Filtros básicos | Media | 🔥🔥🔥🔥 | ALTA |
| 3. Rotación/volteo | Baja | 🔥🔥🔥 | ALTA |
| 4. Descarga | Baja | 🔥🔥🔥🔥🔥 | CRÍTICA |
| 5. Comparación | Baja | 🔥🔥 | MEDIA |
| 6. Recorte | Alta | 🔥🔥🔥🔥 | MEDIA |
| 7. Texto | Media-Alta | 🔥🔥🔥 | BAJA |
| 8. Historial | Media | 🔥🔥🔥🔥🔥 | ALTA |
| 9. Más filtros | Baja | 🔥🔥🔥 | BAJA |
| 10. UI/UX | Media | 🔥🔥🔥🔥 | MEDIA |

---

## ✅ CRITERIOS DE ÉXITO

Al finalizar todas las fases, FotoConvierto deberá:

### Funcionalidades
- ✅ Cargar imágenes (JPG, PNG, WebP)
- ✅ Aplicar 10+ filtros y efectos
- ✅ Rotar, voltear, recortar
- ✅ Añadir texto personalizable
- ✅ Deshacer/rehacer ilimitado (últimos 20 estados)
- ✅ Comparar antes/después
- ✅ Descargar en múltiples formatos
- ✅ Persistir trabajo en LocalStorage

### UX/UI
- ✅ Responsive en móvil, tablet, desktop
- ✅ Tema claro/oscuro
- ✅ Feedback visual inmediato
- ✅ Tutorial de primer uso
- ✅ Atajos de teclado

### Técnico
- ✅ 100% vanilla JavaScript
- ✅ Código modular y mantenible
- ✅ Performance: < 100ms latencia en filtros
- ✅ Sin dependencias npm
- ✅ Compatible con navegadores modernos

### Educativo
- ✅ Código comentado en español
- ✅ Documentación actualizada
- ✅ Guías de aprendizaje revisadas

---

## 🎓 NOTAS FINALES

Este plan mantiene la filosofía educativa de FotoConvierto mientras lo transforma en una herramienta profesional. Cada fase es independiente y puede implementarse incrementalmente sin romper funcionalidad existente.

**Ventajas de este enfoque:**
- No requiere frameworks pesados
- Código educativo y legible
- Funciona 100% offline
- Rápido y ligero
- Fácil de mantener

**Próximo paso:** ¿Empezamos con la Fase 1?
