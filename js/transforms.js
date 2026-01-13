/**
 * ImageTransforms - Clase para transformaciones geométricas de imágenes
 *
 * Responsabilidades:
 * - Rotar imagen 90° (sentido horario y antihorario)
 * - Voltear imagen (horizontal y vertical)
 * - Mantener estado de transformaciones acumuladas
 * - Aplicar filtros después de transformar
 */

class ImageTransforms {
  constructor(canvasManager, imageFilters = null) {
    this.canvasManager = canvasManager;
    this.imageFilters = imageFilters;

    // Estado de transformaciones
    this.rotation = 0;      // Rotación acumulada en grados (0, 90, 180, 270)
    this.flippedH = false;  // Volteado horizontal
    this.flippedV = false;  // Volteado vertical
  }

  /**
   * Rota la imagen 90 grados en sentido horario
   */
  rotate90CW() {
    this.rotation = (this.rotation + 90) % 360;
    this.applyRotation(90);
    console.log(`✅ Rotado 90° horario (total: ${this.rotation}°)`);
  }

  /**
   * Rota la imagen 90 grados en sentido antihorario
   */
  rotate90CCW() {
    this.rotation = (this.rotation - 90 + 360) % 360;
    this.applyRotation(-90);
    console.log(`✅ Rotado 90° antihorario (total: ${this.rotation}°)`);
  }

  /**
   * Aplica una rotación de 90 grados
   * @param {number} degrees - Grados a rotar (90 o -90)
   */
  applyRotation(degrees) {
    if (!this.canvasManager.hasImage()) {
      console.warn('No hay imagen para rotar');
      return;
    }

    const canvas = this.canvasManager.canvas;
    const ctx = this.canvasManager.ctx;

    // Crear canvas temporal con las dimensiones actuales
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Copiar la imagen actual al canvas temporal
    tempCtx.drawImage(canvas, 0, 0);

    // Intercambiar dimensiones del canvas (rotar 90° cambia ancho por alto)
    const newWidth = canvas.height;
    const newHeight = canvas.width;
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Guardar estado del contexto
    ctx.save();

    // Mover el origen al centro del canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Rotar
    const radians = (degrees * Math.PI) / 180;
    ctx.rotate(radians);

    // Dibujar la imagen rotada (centrada en el origen)
    ctx.drawImage(
      tempCanvas,
      -tempCanvas.width / 2,
      -tempCanvas.height / 2,
      tempCanvas.width,
      tempCanvas.height
    );

    // Restaurar estado del contexto
    ctx.restore();

    // Actualizar la referencia de la imagen original con la transformada
    this.updateOriginalImage();

    // Reaplicar filtros si existen
    this.reapplyFilters();
  }

  /**
   * Voltea la imagen horizontalmente (espejo)
   */
  flipHorizontal() {
    this.flippedH = !this.flippedH;
    this.applyFlip('horizontal');
    console.log(`✅ Volteado horizontal: ${this.flippedH ? 'Sí' : 'No'}`);
  }

  /**
   * Voltea la imagen verticalmente
   */
  flipVertical() {
    this.flippedV = !this.flippedV;
    this.applyFlip('vertical');
    console.log(`✅ Volteado vertical: ${this.flippedV ? 'Sí' : 'No'}`);
  }

  /**
   * Aplica un volteo a la imagen
   * @param {string} direction - 'horizontal' o 'vertical'
   */
  applyFlip(direction) {
    if (!this.canvasManager.hasImage()) {
      console.warn('No hay imagen para voltear');
      return;
    }

    const canvas = this.canvasManager.canvas;
    const ctx = this.canvasManager.ctx;

    // Crear canvas temporal
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Copiar la imagen actual
    tempCtx.drawImage(canvas, 0, 0);

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Guardar estado
    ctx.save();

    if (direction === 'horizontal') {
      // Voltear horizontalmente
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    } else if (direction === 'vertical') {
      // Voltear verticalmente
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
    }

    // Dibujar la imagen volteada
    ctx.drawImage(tempCanvas, 0, 0);

    // Restaurar estado
    ctx.restore();

    // Actualizar la referencia de la imagen original
    this.updateOriginalImage();

    // Reaplicar filtros si existen
    this.reapplyFilters();
  }

  /**
   * Actualiza la imagen original del CanvasManager con el estado actual del canvas
   * Esto es necesario para que las transformaciones se mantengan al aplicar filtros
   */
  updateOriginalImage() {
    const canvas = this.canvasManager.canvas;
    const dataURL = canvas.toDataURL('image/png');

    // Crear una nueva imagen desde el canvas actual
    const img = new Image();
    img.onload = () => {
      this.canvasManager.originalImage = img;
      this.canvasManager.currentImage = img;
    };
    img.src = dataURL;
  }

  /**
   * Reaplica los filtros después de una transformación
   */
  reapplyFilters() {
    if (this.imageFilters && this.imageFilters.hasActiveFilters()) {
      // Pequeño delay para asegurar que la imagen se actualizó
      setTimeout(() => {
        this.imageFilters.applyAllFilters();
      }, 10);
    }
  }

  /**
   * Resetea todas las transformaciones
   */
  resetTransforms() {
    this.rotation = 0;
    this.flippedH = false;
    this.flippedV = false;
    console.log('✅ Transformaciones reseteadas');
  }

  /**
   * Obtiene el estado actual de las transformaciones
   * @returns {Object} Estado de transformaciones
   */
  getTransformState() {
    return {
      rotation: this.rotation,
      flippedH: this.flippedH,
      flippedV: this.flippedV
    };
  }

  /**
   * Guarda el estado de transformaciones en localStorage
   * @param {string} key - Clave para localStorage
   */
  saveToLocalStorage(key = 'fotoconvierto-transforms') {
    try {
      const state = this.getTransformState();
      localStorage.setItem(key, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Error al guardar transformaciones:', error);
      return false;
    }
  }

  /**
   * Carga el estado de transformaciones desde localStorage
   * @param {string} key - Clave de localStorage
   */
  loadFromLocalStorage(key = 'fotoconvierto-transforms') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const state = JSON.parse(saved);
        this.rotation = state.rotation || 0;
        this.flippedH = state.flippedH || false;
        this.flippedV = state.flippedV || false;
        console.log('✅ Transformaciones restauradas:', state);
        return state;
      }
      return null;
    } catch (error) {
      console.error('Error al cargar transformaciones:', error);
      return null;
    }
  }
}
