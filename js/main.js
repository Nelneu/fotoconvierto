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
let imageComparison;
let cropTool;
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
let quickUploadBtn;
let quickResetFiltersBtn;
let quickCompareBtn;
let quickDownloadBtn;
let editorSectionTabs;
let editorSectionPanels;
let editorSectionAccordionTriggers;
let activeEditorSectionId = 'filters-panel';

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

  // Inicializar ImageComparison
  try {
    imageComparison = new ImageComparison(canvasManager, imageFilters);
    console.log('✅ ImageComparison inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar ImageComparison:', error);
  }

  // Inicializar CropTool
  try {
    cropTool = new CropTool(canvasManager, imageFilters);
    console.log('✅ CropTool inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar CropTool:', error);
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
  quickUploadBtn = document.getElementById('quick-upload');
  quickResetFiltersBtn = document.getElementById('quick-reset-filters');
  quickCompareBtn = document.getElementById('quick-compare');
  quickDownloadBtn = document.getElementById('quick-download');
  editorSectionTabs = document.querySelectorAll('.editor-section-tab');
  editorSectionPanels = document.querySelectorAll('.section-panel');
  editorSectionAccordionTriggers = document.querySelectorAll('.section-accordion-trigger');
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

  // Listeners para comparación
  setupComparisonListeners();

  // Listeners para recorte
  setupCropListeners();

  // Listeners de acciones rápidas
  setupQuickActionsListeners();

  // Listeners de navegación entre secciones (tabs/accordion)
  setupEditorSectionNavigation();
}

/**
 * Configura navegación de secciones con tabs (desktop) y acordeón (mobile)
 */
function setupEditorSectionNavigation() {
  if (!editorSectionPanels?.length) return;

  editorSectionTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      setActiveEditorSection(targetId);
    });

    tab.addEventListener('keydown', (event) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const tabs = Array.from(editorSectionTabs);
      const currentIndex = tabs.indexOf(tab);
      const isHorizontal = ['ArrowLeft', 'ArrowRight'].includes(event.key);
      const isVertical = ['ArrowUp', 'ArrowDown'].includes(event.key);

      if (!isHorizontal && !isVertical && !['Home', 'End'].includes(event.key)) return;

      let nextIndex = currentIndex;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;

      const nextTab = tabs[nextIndex];
      if (!nextTab) return;
      setActiveEditorSection(nextTab.dataset.target);
      nextTab.focus();
    });
  });

  editorSectionAccordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.dataset.target;
      setActiveEditorSection(targetId);
    });
  });

  // Estado inicial: una sola sección abierta por defecto
  setActiveEditorSection(activeEditorSectionId);
}

/**
 * Activa una sección del editor y desactiva el resto
 * @param {string|null} sectionId - ID de la sección a activar
 */
function setActiveEditorSection(sectionId) {
  activeEditorSectionId = sectionId;

  editorSectionPanels.forEach((panel) => {
    const isActive = panel.id === sectionId;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    panel.toggleAttribute('hidden', !isActive);
  });

  editorSectionTabs.forEach((tab) => {
    const isActive = tab.dataset.target === sectionId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  editorSectionAccordionTriggers.forEach((trigger) => {
    const isActive = trigger.dataset.target === sectionId;
    trigger.classList.toggle('active', isActive);
    trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });
}

/**
 * Configura la barra de acciones rápidas
 */
function setupQuickActionsListeners() {
  if (quickUploadBtn) {
    quickUploadBtn.addEventListener('click', () => {
      fileInput?.click();
    });
  }

  if (quickResetFiltersBtn) {
    quickResetFiltersBtn.addEventListener('click', () => {
      if (!canvasManager?.hasImage() || !uiControls) return;
      uiControls.resetAllFilters();
    });
  }

  if (quickCompareBtn) {
    quickCompareBtn.addEventListener('click', () => {
      const toggleComparisonBtn = document.getElementById('toggle-comparison');
      if (!toggleComparisonBtn) return;
      toggleComparisonBtn.click();
    });
  }

  if (quickDownloadBtn) {
    quickDownloadBtn.addEventListener('click', handleDownload);
  }
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
 * Configura los event listeners de comparación
 */
function setupComparisonListeners() {
  const toggleBtn = document.getElementById('toggle-comparison');
  const splitModeToggle = document.getElementById('split-mode-toggle');
  const splitSlider = document.getElementById('split-slider');
  const splitSliderValue = document.getElementById('split-slider-value');
  const splitSliderContainer = document.getElementById('split-slider-container');
  const splitViewControl = document.getElementById('split-view-control');

  // Botón de toggle comparación
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!imageComparison || !canvasManager.hasImage()) {
        console.warn('No hay imagen para comparar');
        return;
      }

      const isComparing = imageComparison.toggleComparison();

      // Actualizar UI del botón
      if (isComparing) {
        toggleBtn.classList.add('active');
        toggleBtn.querySelector('.btn-text').textContent = 'Ver Editada';
        toggleBtn.setAttribute('aria-pressed', 'true');
        toggleBtn.setAttribute('aria-expanded', 'true');
        canvasContainer.classList.add('comparing');
        quickCompareBtn?.classList.add('active');

        // Mostrar controles de split view
        if (splitViewControl) {
          splitViewControl.classList.remove('hidden');
          splitViewControl.setAttribute('aria-hidden', 'false');
        }
      } else {
        toggleBtn.classList.remove('active');
        toggleBtn.querySelector('.btn-text').textContent = 'Ver Original';
        toggleBtn.setAttribute('aria-pressed', 'false');
        toggleBtn.setAttribute('aria-expanded', 'false');
        canvasContainer.classList.remove('comparing');
        canvasContainer.classList.remove('split-view');
        quickCompareBtn?.classList.remove('active');

        // Ocultar controles de split view
        if (splitViewControl) {
          splitViewControl.classList.add('hidden');
          splitViewControl.setAttribute('aria-hidden', 'true');
        }

        // Resetear split mode
        if (splitModeToggle) {
          splitModeToggle.checked = false;
        }
        if (splitSliderContainer) {
          splitSliderContainer.style.display = 'none';
          splitSliderContainer.setAttribute('aria-hidden', 'true');
        }
      }
    });
  }

  // Checkbox de modo split
  if (splitModeToggle) {
    splitModeToggle.addEventListener('change', (e) => {
      if (!imageComparison || !canvasManager.hasImage()) return;

      if (e.target.checked) {
        // Activar modo split
        imageComparison.setSplitMode(0.5);
        canvasContainer.classList.remove('comparing');
        canvasContainer.classList.add('split-view');

        // Mostrar slider
        if (splitSliderContainer) {
          splitSliderContainer.style.display = 'block';
          splitSliderContainer.setAttribute('aria-hidden', 'false');
        }
        splitModeToggle.setAttribute('aria-expanded', 'true');
      } else {
        // Desactivar modo split, volver a toggle
        imageComparison.exitSplitMode();
        canvasContainer.classList.add('comparing');
        canvasContainer.classList.remove('split-view');

        // Ocultar slider
        if (splitSliderContainer) {
          splitSliderContainer.style.display = 'none';
          splitSliderContainer.setAttribute('aria-hidden', 'true');
        }
        splitModeToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Slider de división
  if (splitSlider && splitSliderValue) {
    splitSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      const position = value / 100;

      // Actualizar valor mostrado
      splitSliderValue.textContent = `${value}%`;

      // Actualizar vista dividida
      if (imageComparison) {
        imageComparison.updateSplitPosition(position);
      }
    });
  }
}

/**
 * Configura los event listeners de recorte
 */
function setupCropListeners() {
  const startCropBtn = document.getElementById('start-crop');
  const applyCropBtn = document.getElementById('apply-crop');
  const cancelCropBtn = document.getElementById('cancel-crop');
  const cropRatioSelect = document.getElementById('crop-ratio');
  const cropActions = document.getElementById('crop-actions');
  const cropInstructions = document.getElementById('crop-instructions');

  // Botón para iniciar recorte
  if (startCropBtn) {
    startCropBtn.addEventListener('click', () => {
      if (!cropTool || !canvasManager.hasImage()) {
        console.warn('No hay imagen para recortar');
        return;
      }

      // Iniciar modo recorte
      const started = cropTool.startCrop();

      if (started) {
        // Mostrar botones de acción y ocultar botón de iniciar
        startCropBtn.style.display = 'none';
        if (cropActions) {
          cropActions.classList.add('active');
          cropActions.setAttribute('aria-hidden', 'false');
        }

        // Mostrar instrucciones
        if (cropInstructions) {
          cropInstructions.classList.add('active');
          cropInstructions.setAttribute('aria-hidden', 'false');
        }
        startCropBtn.setAttribute('aria-expanded', 'true');

        // Agregar clase al canvas container
        canvasContainer.classList.add('crop-active');

        // Deshabilitar comparación mientras se recorta
        if (imageComparison && imageComparison.isComparing) {
          imageComparison.toggleComparison();
        }

        console.log('✂️ Modo recorte iniciado');
      }
    });
  }

  // Botón para aplicar recorte
  if (applyCropBtn) {
    applyCropBtn.addEventListener('click', () => {
      if (!cropTool) return;

      // Aplicar el recorte
      const applied = cropTool.applyCrop();

      if (applied) {
        // Restaurar UI
        exitCropMode();

        // Actualizar información de la imagen
        updateImageInfo();

        // Guardar en localStorage
        canvasManager.saveToLocalStorage('ultimaImagen');

        console.log('✂️ Recorte aplicado');
      }
    });
  }

  // Botón para cancelar recorte
  if (cancelCropBtn) {
    cancelCropBtn.addEventListener('click', () => {
      if (!cropTool) return;

      // Cancelar recorte
      cropTool.cancelCrop();

      // Restaurar UI
      exitCropMode();

      console.log('✂️ Recorte cancelado');
    });
  }

  // Selector de proporción
  if (cropRatioSelect) {
    cropRatioSelect.addEventListener('change', (e) => {
      if (!cropTool) return;

      const value = e.target.value;
      let ratio = null;

      if (value !== 'free') {
        ratio = parseFloat(value);
      }

      cropTool.setAspectRatio(ratio);
    });
  }
}

/**
 * Sale del modo de recorte y restaura la UI
 */
function exitCropMode() {
  const startCropBtn = document.getElementById('start-crop');
  const cropActions = document.getElementById('crop-actions');
  const cropInstructions = document.getElementById('crop-instructions');

  // Mostrar botón de iniciar y ocultar botones de acción
  if (startCropBtn) {
    startCropBtn.style.display = 'flex';
  }
  if (cropActions) {
    cropActions.classList.remove('active');
    cropActions.setAttribute('aria-hidden', 'true');
  }

  // Ocultar instrucciones
  if (cropInstructions) {
    cropInstructions.classList.remove('active');
    cropInstructions.setAttribute('aria-hidden', 'true');
  }
  startCropBtn?.setAttribute('aria-expanded', 'false');

  // Remover clase del canvas container
  canvasContainer.classList.remove('crop-active');
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

  // Resetear comparación
  if (imageComparison) {
    imageComparison.reset();
  }

  // Resetear recorte
  if (cropTool) {
    cropTool.reset();
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

  // Remover clases del canvas
  canvasContainer.classList.remove('comparing');
  canvasContainer.classList.remove('split-view');
  canvasContainer.classList.remove('crop-active');

  // Resetear botón de comparación
  const toggleBtn = document.getElementById('toggle-comparison');
  if (toggleBtn) {
    toggleBtn.classList.remove('active');
    toggleBtn.querySelector('.btn-text').textContent = 'Ver Original';
    toggleBtn.setAttribute('aria-pressed', 'false');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
  quickCompareBtn?.classList.remove('active');

  // Resetear UI del recorte
  exitCropMode();

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
    progressBar.setAttribute('aria-valuenow', String(percent));
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
    progressContainer.setAttribute('aria-hidden', 'false');
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', '0');
  }
}

/**
 * Oculta la barra de progreso
 */
function hideProgress() {
  if (progressContainer) {
    progressContainer.style.display = 'none';
    progressContainer.setAttribute('aria-hidden', 'true');
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
    editorControls.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Oculta los controles del editor
 */
function hideEditorControls() {
  if (editorControls) {
    editorControls.style.display = 'none';
    editorControls.setAttribute('aria-hidden', 'true');
  }
}
