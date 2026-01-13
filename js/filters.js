/**
 * ImageFilters - Clase para aplicar filtros a imágenes en canvas
 *
 * Responsabilidades:
 * - Aplicar filtros CSS (brightness, contrast, saturation, blur, grayscale)
 * - Gestionar estado de filtros activos
 * - Combinar múltiples filtros
 * - Resetear filtros a valores por defecto
 */

class ImageFilters {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;

    // Estado de filtros (valores por defecto)
    this.filterState = {
      brightness: 100,    // 0-200 (100 = normal)
      contrast: 100,      // 0-200 (100 = normal)
      saturation: 100,    // 0-200 (100 = normal)
      blur: 0,            // 0-10 (píxeles)
      grayscale: 0        // 0-100 (porcentaje)
    };

    // Imagen sin filtros (cache)
    this.originalImageData = null;
  }

  /**
   * Aplica todos los filtros activos al canvas
   */
  applyAllFilters() {
    if (!this.canvasManager.hasImage()) {
      console.warn('No hay imagen para aplicar filtros');
      return;
    }

    const ctx = this.canvasManager.ctx;
    const canvas = this.canvasManager.canvas;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Construir string de filtros CSS
    const filterString = this.buildFilterString();

    // Aplicar filtros
    ctx.filter = filterString;

    // Redibujar imagen con filtros
    ctx.drawImage(
      this.canvasManager.originalImage,
      0, 0,
      canvas.width,
      canvas.height
    );

    // Resetear filtro para futuros dibujos
    ctx.filter = 'none';
  }

  /**
   * Construye el string de filtros CSS
   * @returns {string} String de filtros (ej: "brightness(120%) contrast(110%)")
   */
  buildFilterString() {
    const filters = [];

    // Brillo (brightness)
    if (this.filterState.brightness !== 100) {
      filters.push(`brightness(${this.filterState.brightness}%)`);
    }

    // Contraste (contrast)
    if (this.filterState.contrast !== 100) {
      filters.push(`contrast(${this.filterState.contrast}%)`);
    }

    // Saturación (saturate)
    if (this.filterState.saturation !== 100) {
      filters.push(`saturate(${this.filterState.saturation}%)`);
    }

    // Desenfoque (blur)
    if (this.filterState.blur > 0) {
      filters.push(`blur(${this.filterState.blur}px)`);
    }

    // Escala de grises (grayscale)
    if (this.filterState.grayscale > 0) {
      filters.push(`grayscale(${this.filterState.grayscale}%)`);
    }

    // Si no hay filtros, retornar 'none'
    return filters.length > 0 ? filters.join(' ') : 'none';
  }

  /**
   * Actualiza un filtro específico
   * @param {string} filterName - Nombre del filtro
   * @param {number} value - Valor del filtro
   */
  updateFilter(filterName, value) {
    if (this.filterState.hasOwnProperty(filterName)) {
      this.filterState[filterName] = value;
      this.applyAllFilters();
    } else {
      console.error(`Filtro "${filterName}" no existe`);
    }
  }

  /**
   * Actualiza brillo
   * @param {number} value - Valor 0-200 (100 = normal)
   */
  setBrightness(value) {
    this.updateFilter('brightness', value);
  }

  /**
   * Actualiza contraste
   * @param {number} value - Valor 0-200 (100 = normal)
   */
  setContrast(value) {
    this.updateFilter('contrast', value);
  }

  /**
   * Actualiza saturación
   * @param {number} value - Valor 0-200 (100 = normal)
   */
  setSaturation(value) {
    this.updateFilter('saturation', value);
  }

  /**
   * Actualiza desenfoque
   * @param {number} value - Valor 0-10 (píxeles)
   */
  setBlur(value) {
    this.updateFilter('blur', value);
  }

  /**
   * Actualiza escala de grises
   * @param {number} value - Valor 0-100 (porcentaje)
   */
  setGrayscale(value) {
    this.updateFilter('grayscale', value);
  }

  /**
   * Resetea todos los filtros a valores por defecto
   */
  resetFilters() {
    this.filterState = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0
    };

    this.applyAllFilters();

    console.log('✅ Filtros reseteados');
    return this.filterState;
  }

  /**
   * Obtiene el estado actual de los filtros
   * @returns {Object} Estado de filtros
   */
  getFilterState() {
    return { ...this.filterState };
  }

  /**
   * Establece el estado completo de los filtros
   * @param {Object} state - Nuevo estado de filtros
   */
  setFilterState(state) {
    this.filterState = { ...this.filterState, ...state };
    this.applyAllFilters();
  }

  /**
   * Verifica si hay algún filtro activo (distinto del valor por defecto)
   * @returns {boolean} true si hay filtros activos
   */
  hasActiveFilters() {
    return this.filterState.brightness !== 100 ||
           this.filterState.contrast !== 100 ||
           this.filterState.saturation !== 100 ||
           this.filterState.blur !== 0 ||
           this.filterState.grayscale !== 0;
  }

  /**
   * Guarda el estado de filtros en localStorage
   * @param {string} key - Clave para localStorage
   */
  saveToLocalStorage(key = 'fotoconvierto-filters') {
    try {
      localStorage.setItem(key, JSON.stringify(this.filterState));
      return true;
    } catch (error) {
      console.error('Error al guardar filtros en localStorage:', error);
      return false;
    }
  }

  /**
   * Carga el estado de filtros desde localStorage
   * @param {string} key - Clave de localStorage
   */
  loadFromLocalStorage(key = 'fotoconvierto-filters') {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const state = JSON.parse(saved);
        this.setFilterState(state);
        console.log('✅ Filtros restaurados desde localStorage');
        return state;
      }
      return null;
    } catch (error) {
      console.error('Error al cargar filtros desde localStorage:', error);
      return null;
    }
  }

  /**
   * Obtiene la imagen con filtros aplicados como DataURL
   * @param {string} format - Formato de imagen
   * @param {number} quality - Calidad (0-1)
   * @returns {string} DataURL de la imagen con filtros
   */
  getFilteredImageDataURL(format = 'image/png', quality = 0.92) {
    return this.canvasManager.getImageDataURL(format, quality);
  }
}
