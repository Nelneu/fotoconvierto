/**
 * ImageComparison - Gestiona la comparación antes/después de ediciones
 *
 * Responsabilidades:
 * - Toggle entre imagen original y editada
 * - Vista dividida con slider para comparar lado a lado
 * - Guardar estado de comparación
 * - Indicadores visuales del modo actual
 */

class ImageComparison {
  constructor(canvasManager, imageFilters) {
    this.canvasManager = canvasManager;
    this.imageFilters = imageFilters;

    // Estado de comparación
    this.isComparing = false;
    this.comparisonMode = 'toggle'; // 'toggle' o 'split'
    this.splitPosition = 0.5; // Posición del divisor (0-1)

    // Canvas temporal para guardar la imagen editada durante comparación
    this.editedCanvas = document.createElement('canvas');
    this.editedCtx = this.editedCanvas.getContext('2d');
  }

  /**
   * Activa o desactiva el modo de comparación
   */
  toggleComparison() {
    if (!this.canvasManager.hasImage()) {
      console.warn('No hay imagen para comparar');
      return;
    }

    this.isComparing = !this.isComparing;

    if (this.isComparing) {
      this.enterComparisonMode();
    } else {
      this.exitComparisonMode();
    }

    return this.isComparing;
  }

  /**
   * Entra al modo de comparación
   */
  enterComparisonMode() {
    // Guardar el canvas editado actual
    this.saveEditedCanvas();

    // Mostrar la imagen original sin filtros
    this.showOriginal();

    console.log('🔍 Modo comparación activado');
  }

  /**
   * Sale del modo de comparación
   */
  exitComparisonMode() {
    // Restaurar la imagen editada
    this.showEdited();

    console.log('✅ Modo comparación desactivado');
  }

  /**
   * Guarda el estado actual del canvas editado
   */
  saveEditedCanvas() {
    const mainCanvas = this.canvasManager.canvas;

    // Redimensionar el canvas temporal al tamaño del canvas principal
    this.editedCanvas.width = mainCanvas.width;
    this.editedCanvas.height = mainCanvas.height;

    // Copiar el contenido del canvas principal
    this.editedCtx.drawImage(mainCanvas, 0, 0);
  }

  /**
   * Muestra la imagen original sin ediciones
   */
  showOriginal() {
    if (!this.canvasManager.originalImage) {
      console.warn('No hay imagen original disponible');
      return;
    }

    const canvas = this.canvasManager.canvas;
    const ctx = this.canvasManager.ctx;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la imagen original sin filtros
    ctx.drawImage(
      this.canvasManager.originalImage,
      0, 0,
      canvas.width,
      canvas.height
    );
  }

  /**
   * Muestra la imagen editada restaurando los filtros
   */
  showEdited() {
    // Renderizar la imagen base
    this.canvasManager.renderImage();

    // Aplicar todos los filtros actuales
    if (this.imageFilters) {
      this.imageFilters.applyAllFilters();
    }
  }

  /**
   * Cambia al modo de vista dividida (split view)
   * @param {number} position - Posición del divisor (0-1)
   */
  setSplitMode(position) {
    if (!this.canvasManager.hasImage()) {
      console.warn('No hay imagen para comparar');
      return;
    }

    this.comparisonMode = 'split';
    this.splitPosition = position;
    this.isComparing = true;

    // Guardar el canvas editado si aún no está guardado
    if (this.editedCanvas.width === 0) {
      this.saveEditedCanvas();
    }

    // Renderizar vista dividida
    this.renderSplitView(position);
  }

  /**
   * Renderiza la vista dividida (original | editada)
   * @param {number} splitPosition - Posición del divisor (0-1)
   */
  renderSplitView(splitPosition) {
    if (!this.canvasManager.originalImage) {
      console.warn('No hay imagen original disponible');
      return;
    }

    const canvas = this.canvasManager.canvas;
    const ctx = this.canvasManager.ctx;
    const width = canvas.width;
    const height = canvas.height;

    // Calcular la posición de división en píxeles
    const splitX = Math.floor(width * splitPosition);

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Guardar estado del contexto
    ctx.save();

    // MITAD IZQUIERDA: Imagen original
    if (splitX > 0) {
      ctx.save();

      // Crear región de recorte para la mitad izquierda
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();

      // Dibujar imagen original
      ctx.drawImage(
        this.canvasManager.originalImage,
        0, 0,
        width, height
      );

      ctx.restore();
    }

    // MITAD DERECHA: Imagen editada
    if (splitX < width) {
      ctx.save();

      // Crear región de recorte para la mitad derecha
      ctx.beginPath();
      ctx.rect(splitX, 0, width - splitX, height);
      ctx.clip();

      // Dibujar imagen editada desde el canvas temporal
      ctx.drawImage(
        this.editedCanvas,
        0, 0,
        width, height
      );

      ctx.restore();
    }

    // Dibujar línea divisoria
    this.drawDividerLine(ctx, splitX, height);

    // Restaurar estado del contexto
    ctx.restore();
  }

  /**
   * Dibuja la línea divisoria en la vista dividida
   * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
   * @param {number} x - Posición X de la línea
   * @param {number} height - Altura del canvas
   */
  drawDividerLine(ctx, x, height) {
    // Línea divisoria blanca con sombra
    ctx.save();

    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 0;

    // Línea
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    // Círculo en el centro de la línea
    const centerY = height / 2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, centerY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Flechas izquierda y derecha en el círculo
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⟷', x, centerY);

    ctx.restore();
  }

  /**
   * Actualiza la posición del divisor en modo split
   * @param {number} position - Nueva posición (0-1)
   */
  updateSplitPosition(position) {
    this.splitPosition = Math.max(0, Math.min(1, position));
    this.renderSplitView(this.splitPosition);
  }

  /**
   * Desactiva el modo split y vuelve al modo toggle
   */
  exitSplitMode() {
    this.comparisonMode = 'toggle';
    if (this.isComparing) {
      this.showOriginal();
    } else {
      this.showEdited();
    }
  }

  /**
   * Obtiene el estado actual de comparación
   * @returns {Object} Estado de comparación
   */
  getState() {
    return {
      isComparing: this.isComparing,
      mode: this.comparisonMode,
      splitPosition: this.splitPosition
    };
  }

  /**
   * Guarda el estado en localStorage
   */
  saveToLocalStorage() {
    try {
      const state = this.getState();
      localStorage.setItem('fotoconvierto-comparison', JSON.stringify(state));
    } catch (error) {
      console.error('Error al guardar estado de comparación:', error);
    }
  }

  /**
   * Carga el estado desde localStorage
   */
  loadFromLocalStorage() {
    try {
      const savedState = localStorage.getItem('fotoconvierto-comparison');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.isComparing = state.isComparing || false;
        this.comparisonMode = state.mode || 'toggle';
        this.splitPosition = state.splitPosition || 0.5;
      }
    } catch (error) {
      console.error('Error al cargar estado de comparación:', error);
    }
  }

  /**
   * Resetea el estado de comparación
   */
  reset() {
    this.isComparing = false;
    this.comparisonMode = 'toggle';
    this.splitPosition = 0.5;

    // Limpiar canvas temporal
    if (this.editedCanvas.width > 0) {
      this.editedCtx.clearRect(0, 0, this.editedCanvas.width, this.editedCanvas.height);
      this.editedCanvas.width = 0;
      this.editedCanvas.height = 0;
    }
  }
}
