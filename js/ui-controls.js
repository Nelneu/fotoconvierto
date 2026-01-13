/**
 * UIControls - Gestiona los controles de la interfaz de usuario
 *
 * Responsabilidades:
 * - Inicializar event listeners de sliders
 * - Actualizar valores mostrados en la UI
 * - Aplicar debouncing para mejor performance
 * - Sincronizar UI con estado de filtros
 */

class UIControls {
  constructor(imageFilters) {
    this.imageFilters = imageFilters;

    // Referencias a elementos del DOM
    this.sliders = {};
    this.valueDisplays = {};

    // Timeout para debouncing
    this.debounceTimeout = null;
    this.debounceDelay = 50; // milisegundos

    // Inicializar después de que el DOM esté listo
    this.initialize();
  }

  /**
   * Inicializa los controles de UI
   */
  initialize() {
    // Obtener referencias a los sliders
    this.sliders = {
      brightness: document.getElementById('brightness'),
      contrast: document.getElementById('contrast'),
      saturation: document.getElementById('saturation'),
      blur: document.getElementById('blur'),
      grayscale: document.getElementById('grayscale')
    };

    // Obtener referencias a los displays de valores
    this.valueDisplays = {
      brightness: document.getElementById('brightness-value'),
      contrast: document.getElementById('contrast-value'),
      saturation: document.getElementById('saturation-value'),
      blur: document.getElementById('blur-value'),
      grayscale: document.getElementById('grayscale-value')
    };

    // Configurar event listeners
    this.setupEventListeners();

    // Sincronizar UI con estado inicial
    this.syncUIWithState();

    console.log('✅ UIControls inicializado');
  }

  /**
   * Configura los event listeners de los sliders
   */
  setupEventListeners() {
    // Event listeners para cada slider
    Object.keys(this.sliders).forEach(filterName => {
      const slider = this.sliders[filterName];
      if (slider) {
        // Evento 'input' para actualización en tiempo real
        slider.addEventListener('input', (e) => {
          this.handleSliderInput(filterName, e.target.value);
        });

        // Evento 'change' para guardar al terminar
        slider.addEventListener('change', (e) => {
          this.handleSliderChange(filterName, e.target.value);
        });
      }
    });

    // Botón de resetear filtros
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetAllFilters();
      });
    }
  }

  /**
   * Maneja el evento 'input' del slider (tiempo real)
   * @param {string} filterName - Nombre del filtro
   * @param {string} value - Valor del slider
   */
  handleSliderInput(filterName, value) {
    const numValue = parseFloat(value);

    // Actualizar display del valor
    this.updateValueDisplay(filterName, numValue);

    // Aplicar filtro con debouncing para mejor performance
    this.applyFilterDebounced(filterName, numValue);
  }

  /**
   * Maneja el evento 'change' del slider (al terminar de arrastrar)
   * @param {string} filterName - Nombre del filtro
   * @param {string} value - Valor del slider
   */
  handleSliderChange(filterName, value) {
    const numValue = parseFloat(value);

    // Guardar estado en localStorage
    this.imageFilters.saveToLocalStorage();

    console.log(`✅ Filtro ${filterName} actualizado: ${numValue}`);
  }

  /**
   * Aplica un filtro con debouncing
   * @param {string} filterName - Nombre del filtro
   * @param {number} value - Valor del filtro
   */
  applyFilterDebounced(filterName, value) {
    // Cancelar timeout anterior
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Aplicar después del delay
    this.debounceTimeout = setTimeout(() => {
      this.imageFilters.updateFilter(filterName, value);
    }, this.debounceDelay);
  }

  /**
   * Actualiza el display del valor de un filtro
   * @param {string} filterName - Nombre del filtro
   * @param {number} value - Valor a mostrar
   */
  updateValueDisplay(filterName, value) {
    const display = this.valueDisplays[filterName];
    if (display) {
      // Formatear valor según el tipo de filtro
      let formattedValue;

      switch (filterName) {
        case 'brightness':
        case 'contrast':
        case 'saturation':
          // Mostrar como porcentaje relativo al 100%
          formattedValue = value;
          break;
        case 'blur':
          formattedValue = `${value}px`;
          break;
        case 'grayscale':
          formattedValue = `${value}%`;
          break;
        default:
          formattedValue = value;
      }

      display.textContent = formattedValue;
    }
  }

  /**
   * Resetea todos los filtros a valores por defecto
   */
  resetAllFilters() {
    // Resetear en el modelo
    const defaultState = this.imageFilters.resetFilters();

    // Sincronizar UI
    this.syncUIWithState(defaultState);

    // Guardar en localStorage
    this.imageFilters.saveToLocalStorage();

    console.log('✅ Todos los filtros reseteados');
  }

  /**
   * Sincroniza la UI con el estado actual de filtros
   * @param {Object} state - Estado de filtros (opcional)
   */
  syncUIWithState(state = null) {
    const filterState = state || this.imageFilters.getFilterState();

    Object.keys(filterState).forEach(filterName => {
      const slider = this.sliders[filterName];
      const value = filterState[filterName];

      if (slider) {
        slider.value = value;
        this.updateValueDisplay(filterName, value);
      }
    });
  }

  /**
   * Habilita o deshabilita todos los controles
   * @param {boolean} enabled - true para habilitar, false para deshabilitar
   */
  setEnabled(enabled) {
    Object.values(this.sliders).forEach(slider => {
      if (slider) {
        slider.disabled = !enabled;
      }
    });

    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.disabled = !enabled;
    }
  }

  /**
   * Carga un preset de filtros
   * @param {Object} preset - Objeto con valores de filtros
   */
  loadPreset(preset) {
    this.imageFilters.setFilterState(preset);
    this.syncUIWithState(preset);
    this.imageFilters.saveToLocalStorage();

    console.log('✅ Preset cargado:', preset);
  }

  /**
   * Obtiene la configuración actual como preset
   * @param {string} name - Nombre del preset
   * @returns {Object} Preset con nombre y valores
   */
  getCurrentAsPreset(name) {
    return {
      name: name,
      filters: this.imageFilters.getFilterState()
    };
  }
}
