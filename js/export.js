/**
 * ImageExporter - Clase para exportar y descargar imágenes editadas
 *
 * Responsabilidades:
 * - Exportar canvas a diferentes formatos (PNG, JPEG, WebP)
 * - Permitir selección de calidad para formatos con compresión
 * - Generar nombre de archivo personalizable
 * - Descargar archivo al dispositivo del usuario
 */

class ImageExporter {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;

    // Formatos soportados
    this.supportedFormats = {
      png: {
        mimeType: 'image/png',
        extension: 'png',
        label: 'PNG (sin pérdida)',
        supportsQuality: false,
        defaultQuality: 1.0
      },
      jpeg: {
        mimeType: 'image/jpeg',
        extension: 'jpg',
        label: 'JPEG (comprimido)',
        supportsQuality: true,
        defaultQuality: 0.90
      },
      webp: {
        mimeType: 'image/webp',
        extension: 'webp',
        label: 'WebP (moderno)',
        supportsQuality: true,
        defaultQuality: 0.90
      }
    };

    // Configuración por defecto
    this.defaultFormat = 'jpeg';
    this.defaultQuality = 0.90;
  }

  /**
   * Descarga la imagen actual del canvas
   * @param {string} filename - Nombre del archivo (sin extensión)
   * @param {string} format - Formato: 'png', 'jpeg', 'webp'
   * @param {number} quality - Calidad (0-1) para formatos con compresión
   */
  downloadImage(filename = 'imagen-editada', format = 'jpeg', quality = 0.90) {
    if (!this.canvasManager.hasImage()) {
      console.error('No hay imagen para descargar');
      return false;
    }

    // Validar formato
    if (!this.supportedFormats[format]) {
      console.error(`Formato no soportado: ${format}`);
      format = this.defaultFormat;
    }

    const formatInfo = this.supportedFormats[format];
    const canvas = this.canvasManager.canvas;

    try {
      // Convertir canvas a blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error('Error al generar blob de la imagen');
            return;
          }

          // Crear URL del blob
          const url = URL.createObjectURL(blob);

          // Crear elemento de descarga
          const link = document.createElement('a');
          link.href = url;
          link.download = `${this.sanitizeFilename(filename)}.${formatInfo.extension}`;

          // Trigger descarga
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Limpiar URL
          setTimeout(() => URL.revokeObjectURL(url), 100);

          console.log(`✅ Imagen descargada: ${link.download}`);
          return true;
        },
        formatInfo.mimeType,
        quality
      );
    } catch (error) {
      console.error('Error al descargar imagen:', error);
      return false;
    }
  }

  /**
   * Sanea el nombre de archivo removiendo caracteres no permitidos
   * @param {string} filename - Nombre del archivo
   * @returns {string} Nombre saneado
   */
  sanitizeFilename(filename) {
    // Remover caracteres no permitidos en nombres de archivo
    return filename
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Caracteres prohibidos
      .replace(/\s+/g, '-') // Espacios a guiones
      .replace(/\.+/g, '.') // Múltiples puntos a uno
      .replace(/^\.+/, '') // Puntos al inicio
      .replace(/\.+$/, '') // Puntos al final
      .substring(0, 200) // Limitar longitud
      || 'imagen'; // Fallback si queda vacío
  }

  /**
   * Obtiene información sobre un formato
   * @param {string} format - Formato a consultar
   * @returns {Object|null} Información del formato
   */
  getFormatInfo(format) {
    return this.supportedFormats[format] || null;
  }

  /**
   * Obtiene lista de formatos soportados
   * @returns {Array} Array de objetos con información de formatos
   */
  getSupportedFormats() {
    return Object.keys(this.supportedFormats).map(key => ({
      value: key,
      ...this.supportedFormats[key]
    }));
  }

  /**
   * Verifica si un formato soporta ajuste de calidad
   * @param {string} format - Formato a verificar
   * @returns {boolean} true si soporta calidad
   */
  formatSupportsQuality(format) {
    const formatInfo = this.supportedFormats[format];
    return formatInfo ? formatInfo.supportsQuality : false;
  }

  /**
   * Obtiene el tamaño aproximado de la imagen
   * @param {string} format - Formato
   * @param {number} quality - Calidad
   * @returns {Promise<number>} Tamaño en bytes
   */
  async getApproximateSize(format = 'jpeg', quality = 0.90) {
    return new Promise((resolve, reject) => {
      if (!this.canvasManager.hasImage()) {
        reject(new Error('No hay imagen'));
        return;
      }

      const formatInfo = this.supportedFormats[format];
      if (!formatInfo) {
        reject(new Error('Formato no válido'));
        return;
      }

      const canvas = this.canvasManager.canvas;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob.size);
          } else {
            reject(new Error('Error al generar blob'));
          }
        },
        formatInfo.mimeType,
        quality
      );
    });
  }

  /**
   * Formatea el tamaño en bytes a una cadena legible
   * @param {number} bytes - Tamaño en bytes
   * @returns {string} Tamaño formateado (ej: "2.5 MB")
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Obtiene las dimensiones actuales de la imagen
   * @returns {Object} {width, height}
   */
  getImageDimensions() {
    return this.canvasManager.getDimensions();
  }

  /**
   * Genera un nombre de archivo por defecto basado en la fecha
   * @returns {string} Nombre de archivo
   */
  generateDefaultFilename() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `fotoconvierto-${year}${month}${day}-${hours}${minutes}${seconds}`;
  }

  /**
   * Verifica si el navegador soporta un formato específico
   * @param {string} format - Formato a verificar
   * @returns {boolean} true si es soportado
   */
  isSupportedByBrowser(format) {
    const formatInfo = this.supportedFormats[format];
    if (!formatInfo) return false;

    // Crear un canvas temporal para verificar soporte
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 1;
    testCanvas.height = 1;

    try {
      const dataURL = testCanvas.toDataURL(formatInfo.mimeType, 0.5);
      return dataURL.startsWith(`data:${formatInfo.mimeType}`);
    } catch (e) {
      return false;
    }
  }
}
