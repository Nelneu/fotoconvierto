/**
 * CanvasManager - Gestiona el canvas principal y las operaciones de imagen
 *
 * Responsabilidades:
 * - Inicializar y dimensionar el canvas
 * - Cargar imágenes desde archivos o localStorage
 * - Renderizar la imagen actual en el canvas
 * - Exportar imagen para descarga
 * - Mantener referencia a la imagen original
 */

class CanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas con id "${canvasId}" no encontrado`);
    }

    this.ctx = this.canvas.getContext('2d');
    this.originalImage = null;  // Imagen original sin editar
    this.currentImage = null;   // Imagen actual (puede tener ediciones)

    // Configuración inicial del canvas
    this.setupCanvas();
  }

  /**
   * Configuración inicial del canvas
   */
  setupCanvas() {
    // El canvas se redimensionará cuando se cargue una imagen
    this.canvas.width = 600;
    this.canvas.height = 400;

    // Configurar propiedades de renderizado
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  /**
   * Carga una imagen desde un archivo File
   * @param {File} file - Archivo de imagen
   * @returns {Promise} Promise que resuelve cuando la imagen está cargada
   */
  loadImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('El archivo no es una imagen válida'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        this.loadImageFromDataURL(e.target.result)
          .then(resolve)
          .catch(reject);
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Carga una imagen desde una URL de datos (base64)
   * @param {string} dataURL - URL de datos de la imagen
   * @returns {Promise} Promise que resuelve cuando la imagen está cargada
   */
  loadImageFromDataURL(dataURL) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.originalImage = img;
        this.currentImage = img;
        this.resizeCanvasToImage(img);
        this.renderImage();
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };

      img.src = dataURL;
    });
  }

  /**
   * Redimensiona el canvas para que se ajuste a la imagen
   * manteniendo un tamaño máximo razonable
   * @param {Image} img - Imagen a ajustar
   */
  resizeCanvasToImage(img) {
    const maxWidth = 800;
    const maxHeight = 600;

    let width = img.width;
    let height = img.height;

    // Escalar si la imagen es muy grande
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
    }

    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Renderiza la imagen actual en el canvas
   */
  renderImage() {
    if (!this.currentImage) {
      console.warn('No hay imagen para renderizar');
      return;
    }

    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar imagen ajustada al canvas
    this.ctx.drawImage(
      this.currentImage,
      0, 0,
      this.canvas.width,
      this.canvas.height
    );
  }

  /**
   * Resetea el canvas al estado inicial (sin imagen)
   */
  resetCanvas() {
    this.originalImage = null;
    this.currentImage = null;

    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Resetear dimensiones por defecto
    this.canvas.width = 600;
    this.canvas.height = 400;
  }

  /**
   * Obtiene la imagen actual del canvas como DataURL
   * @param {string} format - Formato de imagen ('image/png', 'image/jpeg', 'image/webp')
   * @param {number} quality - Calidad (0-1) para formatos con compresión
   * @returns {string} DataURL de la imagen
   */
  getImageDataURL(format = 'image/png', quality = 0.92) {
    return this.canvas.toDataURL(format, quality);
  }

  /**
   * Verifica si hay una imagen cargada
   * @returns {boolean} true si hay imagen, false si no
   */
  hasImage() {
    return this.originalImage !== null;
  }

  /**
   * Obtiene las dimensiones actuales del canvas
   * @returns {Object} {width, height}
   */
  getDimensions() {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }

  /**
   * Guarda la imagen actual en localStorage
   * @param {string} key - Clave para localStorage
   */
  saveToLocalStorage(key = 'fotoconvierto-image') {
    try {
      if (!this.hasImage()) {
        console.warn('No hay imagen para guardar');
        return false;
      }

      const dataURL = this.getImageDataURL('image/jpeg', 0.8);
      localStorage.setItem(key, dataURL);
      return true;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);

      // Si el error es por exceder el límite de almacenamiento
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage lleno. Considera usar calidad menor o IndexedDB.');
      }

      return false;
    }
  }

  /**
   * Carga la imagen desde localStorage
   * @param {string} key - Clave de localStorage
   * @returns {Promise} Promise que resuelve cuando la imagen está cargada
   */
  loadFromLocalStorage(key = 'fotoconvierto-image') {
    return new Promise((resolve, reject) => {
      try {
        const dataURL = localStorage.getItem(key);

        if (!dataURL) {
          reject(new Error('No hay imagen guardada'));
          return;
        }

        this.loadImageFromDataURL(dataURL)
          .then(resolve)
          .catch(reject);
      } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
        reject(error);
      }
    });
  }

  /**
   * Elimina la imagen guardada en localStorage
   * @param {string} key - Clave de localStorage
   */
  removeFromLocalStorage(key = 'fotoconvierto-image') {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
      return false;
    }
  }
}
