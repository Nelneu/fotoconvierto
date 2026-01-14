/**
 * Main.js - Orquestación principal de FotoConvierto
 *
 * Inicializa la aplicación y gestiona los eventos de UI
 */

// Instancias globales
let canvasManager;
let imageFilters;
let imageTransforms;
let imageExporter;
let uiControls;

// Elementos del DOM
let fileInput;
let clearBtn;
let progressContainer;
let progressBar;
let statusText;
let placeholder;
let canvasContainer;
let editorControls;

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/**
 * Inicializa la aplicación
 */
function initializeApp() {
  // Inicializar CanvasManager
  try {
    canvasManager = new CanvasManager('mainCanvas');
    console.log('✅ CanvasManager inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar CanvasManager:', error);
    showStatus('Error al inicializar el editor', 'error');
    return;
  }

  // Inicializar ImageFilters
  try {
    imageFilters = new ImageFilters(canvasManager);
    console.log('✅ ImageFilters inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar ImageFilters:', error);
  }

  // Inicializar ImageTransforms
  try {
    imageTransforms = new ImageTransforms(canvasManager, imageFilters);
    console.log('✅ ImageTransforms inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar ImageTransforms:', error);
  }

  // Inicializar ImageExporter
  try {
    imageExporter = new ImageExporter(canvasManager);
    console.log('✅ ImageExporter inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar ImageExporter:', error);
  }

  // Inicializar UIControls (se inicializa después del DOM completo)
  try {
    uiControls = new UIControls(imageFilters);
    console.log('✅ UIControls inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar UIControls:', error);
  }

  // Obtener referencias a elementos del DOM
  getDOMReferences();

  // Configurar event listeners
  setupEventListeners();

  // Intentar cargar la última imagen guardada
  loadLastImage();
}

/**
 * Obtiene referencias a elementos del DOM
 */
function getDOMReferences() {
  fileInput = document.getElementById('fileInput');
  clearBtn = document.getElementById('clearBtn');
  progressContainer = document.getElementById('progress-container');
  progressBar = document.getElementById('progress-bar');
  statusText = document.getElementById('status-text');
  placeholder = document.getElementById('placeholder');
  canvasContainer = document.getElementById('canvas-container');
  editorControls = document.getElementById('editorControls');
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
  // Listener para cambio de archivo
  fileInput.addEventListener('change', handleFileSelect);

  // Listener para botón de limpiar
  clearBtn.addEventListener('click', handleClearImage);

  // Listeners para botones de transformación
  setupTransformListeners();

  // Listeners para exportación
  setupExportListeners();
}

/**
 * Configura los event listeners de transformaciones
 */
function setupTransformListeners() {
  const rotateLeftBtn = document.getElementById('rotate-left');
  const rotateRightBtn = document.getElementById('rotate-right');
  const flipHorizontalBtn = document.getElementById('flip-horizontal');
  const flipVerticalBtn = document.getElementById('flip-vertical');

  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', () => {
      if (imageTransforms) {
        imageTransforms.rotate90CCW();
        imageTransforms.saveToLocalStorage();
      }
    });
  }

  if (rotateRightBtn) {
    rotateRightBtn.addEventListener('click', () => {
      if (imageTransforms) {
        imageTransforms.rotate90CW();
        imageTransforms.saveToLocalStorage();
      }
    });
  }

  if (flipHorizontalBtn) {
    flipHorizontalBtn.addEventListener('click', () => {
      if (imageTransforms) {
        imageTransforms.flipHorizontal();
        imageTransforms.saveToLocalStorage();
      }
    });
  }

  if (flipVerticalBtn) {
    flipVerticalBtn.addEventListener('click', () => {
      if (imageTransforms) {
        imageTransforms.flipVertical();
        imageTransforms.saveToLocalStorage();
      }
    });
  }
}

/**
 * Configura los event listeners de exportación
 */
function setupExportListeners() {
  const downloadBtn = document.getElementById('download-btn');
  const formatSelect = document.getElementById('format-select');
  const qualitySlider = document.getElementById('quality-slider');
  const qualityValue = document.getElementById('quality-value');
  const filenameInput = document.getElementById('filename');
  const qualityControl = document.getElementById('quality-control');

  // Botón de descarga
  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownload);
  }

  // Cambio de formato
  if (formatSelect) {
    formatSelect.addEventListener('change', (e) => {
      const format = e.target.value;
      updateQualityControlVisibility(format);
      updateFileSizeEstimate();
    });
  }

  // Cambio de calidad
  if (qualitySlider && qualityValue) {
    qualitySlider.addEventListener('input', (e) => {
      qualityValue.textContent = `${e.target.value}%`;
    });

    qualitySlider.addEventListener('change', () => {
      updateFileSizeEstimate();
    });
  }

  // Cambio de nombre de archivo
  if (filenameInput) {
    filenameInput.addEventListener('input', (e) => {
      // Sanear el nombre en tiempo real
      e.target.value = e.target.value.replace(/[<>:"/\\|?*]/g, '');
    });
  }
}

/**
 * Actualiza la visibilidad del control de calidad según el formato
 * @param {string} format - Formato seleccionado
 */
function updateQualityControlVisibility(format) {
  const qualityControl = document.getElementById('quality-control');
  if (!qualityControl || !imageExporter) return;

  const supportsQuality = imageExporter.formatSupportsQuality(format);

  if (supportsQuality) {
    qualityControl.style.display = 'block';
  } else {
    qualityControl.style.display = 'none';
  }
}

/**
 * Actualiza la estimación del tamaño del archivo
 */
async function updateFileSizeEstimate() {
  const fileSizeElement = document.getElementById('file-size');
  if (!fileSizeElement || !imageExporter) return;

  const formatSelect = document.getElementById('format-select');
  const qualitySlider = document.getElementById('quality-slider');

  if (!formatSelect || !qualitySlider) return;

  const format = formatSelect.value;
  const quality = parseFloat(qualitySlider.value) / 100;

  try {
    const size = await imageExporter.getApproximateSize(format, quality);
    fileSizeElement.textContent = imageExporter.formatFileSize(size);
  } catch (error) {
    fileSizeElement.textContent = '-';
  }
}

/**
 * Actualiza la información de la imagen
 */
function updateImageInfo() {
  const dimensionsElement = document.getElementById('image-dimensions');

  if (dimensionsElement && imageExporter) {
    const dims = imageExporter.getImageDimensions();
    dimensionsElement.textContent = `${dims.width} × ${dims.height}px`;
  }

  updateFileSizeEstimate();
}

/**
 * Maneja la descarga de la imagen
 */
function handleDownload() {
  if (!imageExporter || !canvasManager.hasImage()) {
    console.error('No hay imagen para descargar');
    return;
  }

  const filenameInput = document.getElementById('filename');
  const formatSelect = document.getElementById('format-select');
  const qualitySlider = document.getElementById('quality-slider');
  const downloadBtn = document.getElementById('download-btn');

  const filename = filenameInput?.value || imageExporter.generateDefaultFilename();
  const format = formatSelect?.value || 'jpeg';
  const quality = qualitySlider ? parseFloat(qualitySlider.value) / 100 : 0.9;

  // Feedback visual
  if (downloadBtn) {
    downloadBtn.classList.add('success');
    setTimeout(() => {
      downloadBtn.classList.remove('success');
    }, 600);
  }

  // Descargar
  imageExporter.downloadImage(filename, format, quality);

  console.log(`📥 Descargando: ${filename}.${format} (calidad: ${Math.round(quality * 100)}%)`);
}

/**
 * Maneja la selección de archivo
 * @param {Event} event - Evento de cambio
 */
function handleFileSelect(event) {
  const file = fileInput.files[0];

  // Reset UI
  hideStatus();
  hideProgress();

  if (!file) {
    return;
  }

  // Validar que sea una imagen
  if (!file.type.startsWith('image/')) {
    showStatus('❌ Archivo no válido. Por favor, elige una imagen.', 'error');
    fileInput.value = '';
    return;
  }

  // Mostrar progreso
  showProgress();
  updateProgress(0);
  showStatus('Iniciando carga...', 'info');

  // Simular progreso (FileReader no provee progreso real para archivos pequeños)
  simulateProgress();

  // Cargar imagen usando CanvasManager
  canvasManager.loadImage(file)
    .then(() => {
      // Carga exitosa
      updateProgress(100);
      showStatus('¡Cargada con éxito!', 'success');

      // Ocultar placeholder y mostrar canvas
      hidePlaceholder();
      showEditorControls();

      // Guardar en localStorage
      canvasManager.saveToLocalStorage('ultimaImagen');

      // Cargar filtros guardados (si existen) o aplicar los actuales
      if (imageFilters) {
        imageFilters.loadFromLocalStorage();
        imageFilters.applyAllFilters();
      }

      // Habilitar controles
      if (uiControls) {
        uiControls.setEnabled(true);
      }

      // Actualizar información de la imagen
      updateImageInfo();

      // Ocultar progreso después de un delay
      setTimeout(() => {
        hideProgress();
        hideStatus();
      }, 2500);

      // Limpiar el input para permitir cargar el mismo archivo de nuevo
      fileInput.value = '';
    })
    .catch((error) => {
      console.error('Error al cargar imagen:', error);
      showStatus('❌ Error al cargar la imagen', 'error');
      hideProgress();
      fileInput.value = '';
    });
}

/**
 * Maneja el botón de limpiar imagen
 */
function handleClearImage() {
  // Resetear canvas
  canvasManager.resetCanvas();

  // Limpiar localStorage
  canvasManager.removeFromLocalStorage('ultimaImagen');

  // Resetear filtros
  if (imageFilters) {
    imageFilters.resetFilters();
  }

  // Resetear transformaciones
  if (imageTransforms) {
    imageTransforms.resetTransforms();
  }

  // Deshabilitar controles
  if (uiControls) {
    uiControls.setEnabled(false);
  }

  // Reset UI
  fileInput.value = '';
  hideProgress();
  hideStatus();
  showPlaceholder();
  hideEditorControls();

  console.log('✅ Imagen limpiada correctamente');
}

/**
 * Intenta cargar la última imagen guardada en localStorage
 */
function loadLastImage() {
  canvasManager.loadFromLocalStorage('ultimaImagen')
    .then(() => {
      console.log('✅ Última imagen restaurada desde localStorage');
      hidePlaceholder();
      showEditorControls();

      // Cargar y aplicar filtros guardados
      if (imageFilters) {
        imageFilters.loadFromLocalStorage();
        imageFilters.applyAllFilters();
      }

      // Habilitar controles
      if (uiControls) {
        uiControls.setEnabled(true);
      }

      // Actualizar información de la imagen
      updateImageInfo();
    })
    .catch((error) => {
      // No hay imagen guardada o error al cargar (normal en primera visita)
      console.log('ℹ️ No hay imagen previa guardada');
      showPlaceholder();

      // Deshabilitar controles si no hay imagen
      if (uiControls) {
        uiControls.setEnabled(false);
      }
    });
}

/**
 * Simula el progreso de carga (para mejor UX)
 */
function simulateProgress() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 90) {
      progress = 90;
      clearInterval(interval);
    }
    updateProgress(Math.floor(progress));
  }, 100);
}

/**
 * Actualiza la barra de progreso
 * @param {number} percent - Porcentaje (0-100)
 */
function updateProgress(percent) {
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
  if (statusText && percent < 100) {
    statusText.textContent = `Cargando ${percent}%`;
  }
}

/**
 * Muestra la barra de progreso
 */
function showProgress() {
  if (progressContainer) {
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
  }
}

/**
 * Oculta la barra de progreso
 */
function hideProgress() {
  if (progressContainer) {
    progressContainer.style.display = 'none';
  }
}

/**
 * Muestra un mensaje de estado
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'info', 'success', 'error'
 */
function showStatus(message, type = 'info') {
  if (!statusText) return;

  statusText.textContent = message;
  statusText.className = `status-${type}`;
}

/**
 * Oculta el mensaje de estado
 */
function hideStatus() {
  if (statusText) {
    statusText.textContent = '';
    statusText.className = '';
  }
}

/**
 * Muestra el placeholder
 */
function showPlaceholder() {
  if (placeholder) {
    placeholder.classList.add('placeholder-visible');
  }
  if (canvasContainer) {
    canvasContainer.classList.remove('has-image');
  }
}

/**
 * Oculta el placeholder
 */
function hidePlaceholder() {
  if (placeholder) {
    placeholder.classList.remove('placeholder-visible');
  }
  if (canvasContainer) {
    canvasContainer.classList.add('has-image');
  }
}

/**
 * Muestra los controles del editor
 */
function showEditorControls() {
  if (editorControls) {
    editorControls.style.display = 'block';
  }
}

/**
 * Oculta los controles del editor
 */
function hideEditorControls() {
  if (editorControls) {
    editorControls.style.display = 'none';
  }
}
