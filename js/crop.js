/**
 * CropTool - Herramienta de recorte de imágenes
 *
 * Responsabilidades:
 * - Permitir seleccionar un área rectangular en el canvas
 * - Soportar proporciones predefinidas (libre, 1:1, 4:3, 16:9, etc.)
 * - Dibujar overlay visual con área de recorte
 * - Permitir drag para crear/mover el área de recorte
 * - Aplicar el recorte al canvas
 */

class CropTool {
  constructor(canvasManager, imageFilters) {
    this.canvasManager = canvasManager;
    this.imageFilters = imageFilters;

    // Estado de recorte
    this.cropMode = false;
    this.cropRect = { x: 50, y: 50, width: 200, height: 200 };
    this.aspectRatio = null; // null = libre, número = proporción fija

    // Estado de interacción
    this.isDragging = false;
    this.isResizing = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragHandle = null; // 'tl', 'tr', 'bl', 'br', 'move'

    // Canvas overlay para dibujar el recorte
    this.overlayCanvas = null;
    this.overlayCtx = null;

    // Guardar estado antes de recortar
    this.savedImageData = null;
  }

  /**
   * Inicia el modo de recorte
   */
  startCrop() {
    if (!this.canvasManager.hasImage()) {
      console.warn('No hay imagen para recortar');
      return false;
    }

    this.cropMode = true;

    // Guardar el estado actual del canvas
    this.saveCurrentState();

    // Crear canvas overlay si no existe
    this.createOverlay();

    // Inicializar área de recorte centrada
    this.initializeCropRect();

    // Configurar event listeners
    this.setupEventListeners();

    // Dibujar overlay inicial
    this.drawCropOverlay();

    console.log('✂️ Modo recorte activado');
    return true;
  }

  /**
   * Guarda el estado actual del canvas antes de recortar
   */
  saveCurrentState() {
    const canvas = this.canvasManager.canvas;
    this.savedImageData = canvas.toDataURL();
  }

  /**
   * Crea el canvas overlay para dibujar el área de recorte
   */
  createOverlay() {
    if (!this.overlayCanvas) {
      this.overlayCanvas = document.createElement('canvas');
      this.overlayCtx = this.overlayCanvas.getContext('2d');

      // Posicionar sobre el canvas principal
      const mainCanvas = this.canvasManager.canvas;
      this.overlayCanvas.style.position = 'absolute';
      this.overlayCanvas.style.top = mainCanvas.offsetTop + 'px';
      this.overlayCanvas.style.left = mainCanvas.offsetLeft + 'px';
      this.overlayCanvas.style.pointerEvents = 'none';
      this.overlayCanvas.style.zIndex = '10';

      // Agregar al DOM
      mainCanvas.parentElement.appendChild(this.overlayCanvas);
    }

    // Ajustar tamaño al canvas principal
    const mainCanvas = this.canvasManager.canvas;
    this.overlayCanvas.width = mainCanvas.width;
    this.overlayCanvas.height = mainCanvas.height;
    this.overlayCanvas.style.width = mainCanvas.style.width || mainCanvas.width + 'px';
    this.overlayCanvas.style.height = mainCanvas.style.height || mainCanvas.height + 'px';
  }

  /**
   * Inicializa el rectángulo de recorte centrado
   */
  initializeCropRect() {
    const canvas = this.canvasManager.canvas;
    const width = Math.min(canvas.width * 0.6, 400);
    const height = this.aspectRatio ? width / this.aspectRatio : Math.min(canvas.height * 0.6, 300);

    this.cropRect = {
      x: (canvas.width - width) / 2,
      y: (canvas.height - height) / 2,
      width: width,
      height: height
    };
  }

  /**
   * Configura los event listeners para interacción con el canvas
   */
  setupEventListeners() {
    const canvas = this.canvasManager.canvas;

    // Guardar referencias para poder removerlas después
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);

    canvas.addEventListener('mousedown', this.mouseDownHandler);
    canvas.addEventListener('mousemove', this.mouseMoveHandler);
    canvas.addEventListener('mouseup', this.mouseUpHandler);
    canvas.addEventListener('mouseleave', this.mouseUpHandler);
  }

  /**
   * Remueve los event listeners
   */
  removeEventListeners() {
    const canvas = this.canvasManager.canvas;

    canvas.removeEventListener('mousedown', this.mouseDownHandler);
    canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    canvas.removeEventListener('mouseup', this.mouseUpHandler);
    canvas.removeEventListener('mouseleave', this.mouseUpHandler);
  }

  /**
   * Maneja el evento mousedown
   */
  handleMouseDown(e) {
    if (!this.cropMode) return;

    const rect = this.canvasManager.canvas.getBoundingClientRect();
    const scaleX = this.canvasManager.canvas.width / rect.width;
    const scaleY = this.canvasManager.canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Verificar si está sobre un handle de redimensionamiento
    const handle = this.getHandleAtPosition(mouseX, mouseY);

    if (handle) {
      this.isResizing = true;
      this.dragHandle = handle;
    } else if (this.isInsideCropRect(mouseX, mouseY)) {
      // Si está dentro del rectángulo, mover
      this.isDragging = true;
      this.dragHandle = 'move';
    } else {
      // Si está fuera, crear nuevo rectángulo
      this.isDragging = true;
      this.dragHandle = 'create';
      this.cropRect.x = mouseX;
      this.cropRect.y = mouseY;
      this.cropRect.width = 0;
      this.cropRect.height = 0;
    }

    this.dragStartX = mouseX;
    this.dragStartY = mouseY;
    this.initialCropRect = { ...this.cropRect };
  }

  /**
   * Maneja el evento mousemove
   */
  handleMouseMove(e) {
    if (!this.cropMode) return;

    const rect = this.canvasManager.canvas.getBoundingClientRect();
    const scaleX = this.canvasManager.canvas.width / rect.width;
    const scaleY = this.canvasManager.canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Cambiar cursor según posición
    if (!this.isDragging && !this.isResizing) {
      this.updateCursor(mouseX, mouseY);
    }

    // Si está arrastrando o redimensionando
    if (this.isDragging || this.isResizing) {
      const deltaX = mouseX - this.dragStartX;
      const deltaY = mouseY - this.dragStartY;

      if (this.dragHandle === 'move') {
        // Mover el rectángulo
        this.cropRect.x = this.initialCropRect.x + deltaX;
        this.cropRect.y = this.initialCropRect.y + deltaY;

        // Limitar a los bordes del canvas
        this.constrainToCanvas();
      } else if (this.dragHandle === 'create') {
        // Crear nuevo rectángulo
        let width = deltaX;
        let height = deltaY;

        if (this.aspectRatio) {
          // Mantener proporción
          if (Math.abs(width) > Math.abs(height)) {
            height = width / this.aspectRatio;
          } else {
            width = height * this.aspectRatio;
          }
        }

        // Normalizar coordenadas para soportar drag en cualquier dirección
        if (width < 0) {
          this.cropRect.x = this.dragStartX + width;
          this.cropRect.width = Math.abs(width);
        } else {
          this.cropRect.x = this.dragStartX;
          this.cropRect.width = width;
        }

        if (height < 0) {
          this.cropRect.y = this.dragStartY + height;
          this.cropRect.height = Math.abs(height);
        } else {
          this.cropRect.y = this.dragStartY;
          this.cropRect.height = height;
        }
      } else {
        // Redimensionar desde un handle
        this.resizeFromHandle(mouseX, mouseY);
      }

      this.drawCropOverlay();
    }
  }

  /**
   * Maneja el evento mouseup
   */
  handleMouseUp(e) {
    this.isDragging = false;
    this.isResizing = false;
    this.dragHandle = null;
  }

  /**
   * Actualiza el cursor según la posición del mouse
   */
  updateCursor(mouseX, mouseY) {
    const canvas = this.canvasManager.canvas;
    const handle = this.getHandleAtPosition(mouseX, mouseY);

    if (handle) {
      if (handle === 'tl' || handle === 'br') {
        canvas.style.cursor = 'nwse-resize';
      } else if (handle === 'tr' || handle === 'bl') {
        canvas.style.cursor = 'nesw-resize';
      }
    } else if (this.isInsideCropRect(mouseX, mouseY)) {
      canvas.style.cursor = 'move';
    } else {
      canvas.style.cursor = 'crosshair';
    }
  }

  /**
   * Redimensiona el rectángulo desde un handle
   */
  resizeFromHandle(mouseX, mouseY) {
    const { x, y, width, height } = this.initialCropRect;

    switch (this.dragHandle) {
      case 'tl': // Top-left
        this.cropRect.x = mouseX;
        this.cropRect.y = mouseY;
        this.cropRect.width = x + width - mouseX;
        this.cropRect.height = y + height - mouseY;
        break;
      case 'tr': // Top-right
        this.cropRect.y = mouseY;
        this.cropRect.width = mouseX - x;
        this.cropRect.height = y + height - mouseY;
        break;
      case 'bl': // Bottom-left
        this.cropRect.x = mouseX;
        this.cropRect.width = x + width - mouseX;
        this.cropRect.height = mouseY - y;
        break;
      case 'br': // Bottom-right
        this.cropRect.width = mouseX - x;
        this.cropRect.height = mouseY - y;
        break;
    }

    // Aplicar aspect ratio si está definido
    if (this.aspectRatio) {
      this.cropRect.height = this.cropRect.width / this.aspectRatio;
    }

    // Asegurar dimensiones positivas
    if (this.cropRect.width < 0) {
      this.cropRect.x += this.cropRect.width;
      this.cropRect.width = Math.abs(this.cropRect.width);
    }
    if (this.cropRect.height < 0) {
      this.cropRect.y += this.cropRect.height;
      this.cropRect.height = Math.abs(this.cropRect.height);
    }
  }

  /**
   * Obtiene el handle en la posición dada (si hay alguno)
   */
  getHandleAtPosition(x, y) {
    const handleSize = 12;
    const handles = this.getHandlePositions();

    for (const [name, pos] of Object.entries(handles)) {
      if (
        x >= pos.x - handleSize / 2 &&
        x <= pos.x + handleSize / 2 &&
        y >= pos.y - handleSize / 2 &&
        y <= pos.y + handleSize / 2
      ) {
        return name;
      }
    }

    return null;
  }

  /**
   * Obtiene las posiciones de los handles de redimensionamiento
   */
  getHandlePositions() {
    const { x, y, width, height } = this.cropRect;

    return {
      tl: { x: x, y: y },
      tr: { x: x + width, y: y },
      bl: { x: x, y: y + height },
      br: { x: x + width, y: y + height }
    };
  }

  /**
   * Verifica si un punto está dentro del rectángulo de recorte
   */
  isInsideCropRect(x, y) {
    return (
      x >= this.cropRect.x &&
      x <= this.cropRect.x + this.cropRect.width &&
      y >= this.cropRect.y &&
      y <= this.cropRect.y + this.cropRect.height
    );
  }

  /**
   * Limita el rectángulo de recorte a los bordes del canvas
   */
  constrainToCanvas() {
    const canvas = this.canvasManager.canvas;

    if (this.cropRect.x < 0) this.cropRect.x = 0;
    if (this.cropRect.y < 0) this.cropRect.y = 0;
    if (this.cropRect.x + this.cropRect.width > canvas.width) {
      this.cropRect.x = canvas.width - this.cropRect.width;
    }
    if (this.cropRect.y + this.cropRect.height > canvas.height) {
      this.cropRect.y = canvas.height - this.cropRect.height;
    }
  }

  /**
   * Dibuja el overlay de recorte sobre el canvas
   */
  drawCropOverlay() {
    if (!this.overlayCanvas || !this.cropMode) return;

    const ctx = this.overlayCtx;
    const canvas = this.overlayCanvas;

    // Limpiar overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Oscurecer área fuera del recorte
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Limpiar área de recorte (mostrar imagen debajo)
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

    // Dibujar líneas de guía (regla de tercios)
    ctx.strokeStyle = 'rgba(255, 102, 0, 0.3)';
    ctx.lineWidth = 1;

    // Líneas verticales
    const thirdWidth = this.cropRect.width / 3;
    ctx.beginPath();
    ctx.moveTo(this.cropRect.x + thirdWidth, this.cropRect.y);
    ctx.lineTo(this.cropRect.x + thirdWidth, this.cropRect.y + this.cropRect.height);
    ctx.moveTo(this.cropRect.x + thirdWidth * 2, this.cropRect.y);
    ctx.lineTo(this.cropRect.x + thirdWidth * 2, this.cropRect.y + this.cropRect.height);
    ctx.stroke();

    // Líneas horizontales
    const thirdHeight = this.cropRect.height / 3;
    ctx.beginPath();
    ctx.moveTo(this.cropRect.x, this.cropRect.y + thirdHeight);
    ctx.lineTo(this.cropRect.x + this.cropRect.width, this.cropRect.y + thirdHeight);
    ctx.moveTo(this.cropRect.x, this.cropRect.y + thirdHeight * 2);
    ctx.lineTo(this.cropRect.x + this.cropRect.width, this.cropRect.y + thirdHeight * 2);
    ctx.stroke();

    // Dibujar handles en las esquinas
    this.drawHandles();

    // Mostrar dimensiones
    this.drawDimensions();
  }

  /**
   * Dibuja los handles de redimensionamiento
   */
  drawHandles() {
    const ctx = this.overlayCtx;
    const handleSize = 12;
    const handles = this.getHandlePositions();

    ctx.fillStyle = '#ff6600';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    for (const pos of Object.values(handles)) {
      ctx.fillRect(
        pos.x - handleSize / 2,
        pos.y - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.strokeRect(
        pos.x - handleSize / 2,
        pos.y - handleSize / 2,
        handleSize,
        handleSize
      );
    }
  }

  /**
   * Dibuja las dimensiones del área de recorte
   */
  drawDimensions() {
    const ctx = this.overlayCtx;
    const text = `${Math.round(this.cropRect.width)} × ${Math.round(this.cropRect.height)}`;

    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#ff6600';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;

    const textX = this.cropRect.x + this.cropRect.width / 2;
    const textY = this.cropRect.y - 10;

    ctx.strokeText(text, textX - ctx.measureText(text).width / 2, textY);
    ctx.fillText(text, textX - ctx.measureText(text).width / 2, textY);
  }

  /**
   * Aplica el recorte al canvas
   */
  applyCrop() {
    if (!this.cropMode) {
      console.warn('No está en modo recorte');
      return false;
    }

    // Validar que el área de recorte tenga dimensiones válidas
    if (this.cropRect.width <= 0 || this.cropRect.height <= 0) {
      console.warn('Área de recorte inválida');
      return false;
    }

    const mainCanvas = this.canvasManager.canvas;
    const mainCtx = this.canvasManager.ctx;

    // Crear canvas temporal con la imagen recortada
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = Math.round(this.cropRect.width);
    croppedCanvas.height = Math.round(this.cropRect.height);
    const croppedCtx = croppedCanvas.getContext('2d');

    // Copiar el área recortada
    croppedCtx.drawImage(
      mainCanvas,
      Math.round(this.cropRect.x),
      Math.round(this.cropRect.y),
      Math.round(this.cropRect.width),
      Math.round(this.cropRect.height),
      0,
      0,
      Math.round(this.cropRect.width),
      Math.round(this.cropRect.height)
    );

    // Actualizar el canvas principal
    mainCanvas.width = croppedCanvas.width;
    mainCanvas.height = croppedCanvas.height;
    mainCtx.drawImage(croppedCanvas, 0, 0);

    // Actualizar la imagen original en el canvasManager
    // Crear nueva imagen desde el canvas recortado
    const img = new Image();
    img.onload = () => {
      this.canvasManager.originalImage = img;
      this.canvasManager.currentImage = img;

      // Reaplicar filtros si existen
      if (this.imageFilters) {
        this.imageFilters.applyAllFilters();
      }
    };
    img.src = croppedCanvas.toDataURL();

    // Salir del modo recorte
    this.cancelCrop();

    console.log('✂️ Recorte aplicado exitosamente');
    return true;
  }

  /**
   * Cancela el modo de recorte sin aplicar cambios
   */
  cancelCrop() {
    if (!this.cropMode) return;

    this.cropMode = false;

    // Remover event listeners
    this.removeEventListeners();

    // Remover overlay
    if (this.overlayCanvas && this.overlayCanvas.parentElement) {
      this.overlayCanvas.parentElement.removeChild(this.overlayCanvas);
      this.overlayCanvas = null;
      this.overlayCtx = null;
    }

    // Restaurar cursor
    const canvas = this.canvasManager.canvas;
    canvas.style.cursor = 'default';

    console.log('✂️ Modo recorte cancelado');
  }

  /**
   * Establece la proporción de aspecto
   * @param {number|null} ratio - Proporción (null para libre)
   */
  setAspectRatio(ratio) {
    this.aspectRatio = ratio;

    // Ajustar área de recorte actual si hay proporción
    if (this.cropMode && ratio) {
      this.cropRect.height = this.cropRect.width / ratio;
      this.drawCropOverlay();
    }

    console.log(`📐 Proporción establecida: ${ratio ? ratio.toFixed(2) : 'libre'}`);
  }

  /**
   * Resetea el estado de recorte
   */
  reset() {
    this.cancelCrop();
    this.aspectRatio = null;
    this.savedImageData = null;
  }
}
