# 📸 FotoConvierto

**Editor de Imágenes Web Completo y Moderno**

https://nelneu.github.io/fotoconvierto/

FotoConvierto es una aplicación web profesional de edición de imágenes que funciona 100% en el navegador. Permite editar, transformar, recortar, comparar y exportar imágenes con una interfaz intuitiva y moderna, sin necesidad de instalar software ni enviar datos a servidores externos.

---

## ✨ Características Principales

### 🎨 **Edición de Imágenes**
- **Filtros Interactivos en Tiempo Real**
  - Ajuste de brillo (0-200%)
  - Control de contraste (0-200%)
  - Saturación de colores (0-200%)
  - Desenfoque gaussiano (0-10px)
  - Conversión a blanco y negro (0-100%)
  - Reseteo instantáneo de todos los filtros
  - Previsualización en tiempo real con debouncing (50ms)

### 🔄 **Transformaciones Geométricas**
- Rotación 90° (izquierda y derecha)
- Volteo horizontal (espejo)
- Volteo vertical
- Aplicación instantánea sin pérdida de calidad
- Integración con filtros activos

### ✂️ **Herramienta de Recorte Profesional**
- Selección interactiva de área con mouse/touch
- Área móvil y redimensionable
- **Proporciones predefinidas:**
  - Libre (sin restricciones)
  - Cuadrado 1:1 (avatares, Instagram posts)
  - Paisaje 4:3 (fotografía clásica)
  - Panorámico 16:9 (videos, presentaciones)
  - Vertical 9:16 (Instagram Stories, TikTok, Reels)
  - Retrato 4:5 (feed de Instagram)
- Overlay visual con área oscurecida
- Regla de tercios para composición
- Handles en esquinas para redimensionamiento preciso
- Dimensiones en tiempo real
- Modo aplicar/cancelar

### ⚖️ **Comparación Antes/Después**
- **Modo Toggle:** Alterna entre original y editada con un clic
- **Vista Dividida (Split View):**
  - Slider interactivo para comparar lado a lado
  - Original a la izquierda, editada a la derecha
  - Línea divisoria con indicador visual
  - Control deslizante de 0-100%
- Indicadores visuales del modo activo
- Integración perfecta con todas las ediciones

### 💾 **Exportación Avanzada**
- **Formatos soportados:**
  - JPEG (comprimido, recomendado para fotos)
  - PNG (sin pérdida, transparencia)
  - WebP (moderno, eficiente)
- Control de calidad (1-100%) para JPEG y WebP
- Estimación de tamaño de archivo en tiempo real
- Información de dimensiones
- Nombre personalizable
- Descarga instantánea al navegador

### 💡 **Características Adicionales**
- **Persistencia Local:** Guarda automáticamente la última imagen y ediciones en localStorage
- **Interfaz Moderna:** Diseño con gradientes, animaciones suaves y feedback visual
- **100% Responsive:** Optimizado para móviles, tablets y escritorio
- **Sin Dependencias:** JavaScript vanilla puro, sin frameworks
- **Privacidad Total:** Procesamiento 100% local, sin subir datos a servidores
- **Rendimiento Optimizado:** Aceleración por GPU con CSS filters
- **Barra de Progreso:** Feedback visual durante la carga

---

## 🛠️ Stack Tecnológico

### Tecnologías Core
- **HTML5** - Estructura semántica y Canvas API
- **CSS3** - Diseño moderno con:
  - CSS Grid y Flexbox para layouts responsivos
  - Gradientes lineales para paneles
  - Transiciones y animaciones suaves
  - Custom range sliders
  - Media queries para responsive
- **JavaScript (ES6+)** - Lógica vanilla sin frameworks:
  - Clases ES6 para arquitectura modular
  - Async/await para operaciones asíncronas
  - Arrow functions y destructuring
  - Template literals
  - Promises para manejo de imágenes

### APIs Web Utilizadas
- **Canvas API** - Renderizado y manipulación de imágenes
- **FileReader API** - Lectura de archivos locales
- **LocalStorage API** - Persistencia de datos
- **Blob API** - Generación de archivos para descarga
- **CSS Filter Effects** - Aplicación de filtros por GPU

### Arquitectura
```
Patrón de diseño: Modular basado en clases
├── CanvasManager: Gestión del canvas y renderizado
├── ImageFilters: Sistema de filtros CSS
├── ImageTransforms: Transformaciones geométricas
├── ImageExporter: Exportación y descarga
├── ImageComparison: Comparación antes/después
├── CropTool: Herramienta de recorte
├── UIControls: Gestión de controles de interfaz
└── Main: Orquestación y coordinación
```

---


## 🎛️ Mini guía visual (Design System)

### Paleta semántica
- `--surface-1`: fondo base de app y bloques secundarios.
- `--surface-2`: superficies elevadas (paneles, tarjetas, controles).
- `--surface-3`: fondos suaves para hints, tags y estados neutros.
- `--text-primary` / `--text-secondary`: jerarquía principal de texto.
- `--accent`: acciones primarias y elementos interactivos activos.
- `--danger`: acciones destructivas o de riesgo.
- `--focus-ring`: anillo de enfoque accesible para teclado.

### Spacing
- Escala recomendada en `style.css`: `--space-1` (4px) a `--space-6` (24px).
- Para controles y formularios usar especialmente `--space-2`, `--space-3` y `--space-4`.
- Para separación entre secciones/paneles usar `--space-5` y `--space-6`.

### Tipografía
- Familia base: `Poppins, sans-serif` (`--font-family-base`).
- Tamaños clave:
  - Cuerpo: `--font-size-body`.
  - Ayuda/labels: `--font-size-helper`.
  - Títulos de sección: `--font-size-section`.

### Componentes base
- Botones: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`.
- Contenedores: `.panel`.
- Entradas: `.input`.
- Sliders: `.range`.
- Etiquetas contextuales: `.tag`.

### Estados
- Hover: elevar levemente y reforzar `--accent` en borde/color.
- Focus visible: usar `--focus-ring` en botones e inputs.
- Disabled: reducir opacidad y bloquear interacción visualmente.
- Estado activo: reforzar contraste con `--accent` y texto inverso.

---

## 📂 Estructura del Proyecto

```
fotoconvierto/
├── index.html                 # Estructura HTML principal
├── style.css                  # Estilos base y layout
├── favicon.png                # Icono de la aplicación
│
├── css/                       # Estilos modulares
│   ├── editor.css            # Estilos del editor principal
│   ├── filters.css           # Estilos de filtros y sliders
│   ├── transforms.css        # Estilos de transformaciones
│   ├── export.css            # Estilos del panel de exportación
│   ├── comparison.css        # Estilos de comparación
│   └── crop.css              # Estilos de herramienta de recorte
│
├── js/                        # Módulos JavaScript
│   ├── canvas-manager.js     # Gestión del canvas (246 líneas)
│   ├── filters.js            # Sistema de filtros (200 líneas)
│   ├── transforms.js         # Transformaciones (285 líneas)
│   ├── export.js             # Exportación (243 líneas)
│   ├── comparison.js         # Comparación antes/después (333 líneas)
│   ├── crop.js               # Herramienta de recorte (700+ líneas)
│   ├── ui-controls.js        # Controles de UI (215 líneas)
│   └── main.js               # Orquestación principal (680+ líneas)
│
├── PLAN_IMPLEMENTACION.md     # Plan detallado de desarrollo
└── README.md                  # Este archivo
```

**Total:** ~3,000 líneas de código JavaScript modular + ~1,500 líneas CSS

---

## 🚀 Instalación y Uso

### Uso Local

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Nelneu/fotoconvierto.git
cd fotoconvierto
```

2. **Abrir con un servidor local:**
```bash
# Opción 1: Python 3
python -m http.server 8000

# Opción 2: Python 2
python -m SimpleHTTPServer 8000

# Opción 3: Node.js con npx
npx serve

# Opción 4: PHP
php -S localhost:8000
```

3. **Abrir en el navegador:**
```
http://localhost:8000
```

### Despliegue en Producción

#### ✅ GitHub Pages (Actual)
```bash
# Ya está desplegado en:
https://nelneu.github.io/fotoconvierto/
```

#### ✅ Netlify
1. Conectar repositorio de GitHub
2. Build command: (ninguno necesario)
3. Publish directory: `/`
4. Deploy automático en cada push

#### ✅ Vercel
```bash
npm i -g vercel
vercel
```

---

## 📖 Guía de Uso

### 1. Cargar Imagen
- Clic en "Elegir imagen"
- Seleccionar archivo JPG, PNG, WebP, etc.
- Previsualización instantánea con barra de progreso

### 2. Aplicar Filtros
- Ajustar sliders de brillo, contraste, saturación
- Aplicar desenfoque o escala de grises
- Clic en "Resetear Filtros" para restaurar

### 3. Transformar
- Rotar 90° izquierda o derecha
- Voltear horizontal o verticalmente
- Las transformaciones se aplican instantáneamente

### 4. Recortar
- Clic en "Iniciar Recorte"
- Seleccionar proporción deseada (o libre)
- Arrastrar para crear área de recorte
- Mover el área o redimensionar desde esquinas
- Clic en "✓ Aplicar" o "✗ Cancelar"

### 5. Comparar
- Clic en "Ver Original" para toggle entre original/editada
- Activar "Vista dividida" para comparación lado a lado
- Ajustar slider para mover línea divisoria

### 6. Exportar
- Elegir formato (JPEG, PNG, WebP)
- Ajustar calidad (solo JPEG/WebP)
- Personalizar nombre de archivo
- Clic en "Descargar Imagen"

---

## 🎯 Roadmap / Funcionalidades Futuras

### Implementadas ✅
- [x] Fase 1: Canvas y estructura base
- [x] Fase 2: Filtros interactivos
- [x] Fase 3: Transformaciones (rotar, voltear)
- [x] Fase 4: Exportación con múltiples formatos
- [x] Fase 5: Comparación antes/después
- [x] Fase 6: Herramienta de recorte

### En Desarrollo / Planificadas 🚧
- [ ] Fase 7: Añadir texto sobre imagen
- [ ] Fase 8: Historial de cambios (Undo/Redo)
- [ ] Fase 9: Dibujo libre y formas
- [ ] Fase 10: Stickers y overlays

### Ideas Futuras 💡
- [ ] Procesamiento por lotes (múltiples imágenes)
- [ ] Presets de filtros (ej: "Vintage", "B&N Dramático")
- [ ] Herramienta de selección inteligente
- [ ] Corrección automática de color
- [ ] Redimensionamiento inteligente con IA
- [ ] Exportar como video (slideshow)
- [ ] Integración con APIs de IA (eliminación de fondos)
- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro

---

## 🏗️ Arquitectura Técnica

### Flujo de Datos
```
Usuario → FileInput → CanvasManager → Renderizado
                           ↓
                    ImageFilters (CSS filters)
                           ↓
                    ImageTransforms (rotate/flip)
                           ↓
                    CropTool (recorte)
                           ↓
                    ImageExporter (descarga)
```

### Gestión de Estado
- **Canvas Principal:** Contiene la imagen renderizada con todas las ediciones
- **Imagen Original:** Se mantiene en memoria para comparaciones
- **Canvas Temporal:** Usado por CropTool para overlay
- **LocalStorage:** Persiste última imagen y configuración de filtros

### Optimizaciones
- **Debouncing:** Los filtros se aplican cada 50ms para evitar lag
- **GPU Acceleration:** Filtros CSS aprovechan aceleración por hardware
- **Canvas Reutilización:** Un solo canvas principal para todas las operaciones
- **Event Delegation:** Minimiza listeners en elementos dinámicos
- **Lazy Loading:** Módulos se cargan solo cuando son necesarios

---

## 🔧 Desarrollo

### Ejecutar en Modo Desarrollo
```bash
# Con live reload
npx live-server

# O con Python
python -m http.server 8000
```

### Estructura de Commits
Formato: `tipo: descripción`

Tipos:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplo:
```bash
git commit -m "feat: add crop tool with aspect ratio support"
```

### Convenciones de Código
- **Nomenclatura:** camelCase para variables, PascalCase para clases
- **Comentarios:** JSDoc para funciones públicas
- **Idioma:** Código y comentarios en español (educativo)
- **Modularidad:** Una clase por archivo
- **Separación:** CSS modular por funcionalidad

---

## 🐛 Solución de Problemas

### La imagen no se carga
- Verificar que el archivo sea una imagen válida (JPG, PNG, WebP, GIF)
- Comprobar que el tamaño no exceda límites del navegador (~10MB)
- Limpiar localStorage si está lleno: `localStorage.clear()`

### Los filtros no se aplican
- Verificar que hay una imagen cargada
- Comprobar consola del navegador para errores
- Probar en navegador actualizado (Chrome, Firefox, Safari modernos)

### El recorte no funciona en móvil
- La herramienta soporta touch events
- Asegurar que el navegador móvil sea reciente
- Probar en modo landscape si es necesario

### LocalStorage lleno
```javascript
// Ejecutar en consola del navegador
localStorage.clear();
location.reload();
```

---

## 🌐 Compatibilidad de Navegadores

| Navegador | Versión Mínima | Soporte |
|-----------|----------------|---------|
| Chrome    | 90+            | ✅ Completo |
| Firefox   | 88+            | ✅ Completo |
| Safari    | 14+            | ✅ Completo |
| Edge      | 90+            | ✅ Completo |
| Opera     | 76+            | ✅ Completo |
| iOS Safari| 14+            | ✅ Completo |
| Chrome Android | 90+       | ✅ Completo |

**Requisitos:**
- Canvas API
- CSS Filter Effects
- FileReader API
- ES6+ (Clases, Arrow Functions, Async/Await)

---

## 📊 Rendimiento

### Métricas
- **Carga inicial:** < 100ms
- **Aplicación de filtro:** < 16ms (60 FPS)
- **Recorte de imagen:** < 100ms
- **Exportación:** < 500ms (imagen 1920x1080)
- **Tamaño total:** ~50KB (HTML + CSS + JS comprimido)

### Optimizaciones Aplicadas
- Debouncing en sliders (50ms)
- CSS Filters por GPU
- Canvas offscreen para operaciones pesadas
- Compresión de imágenes en localStorage
- Lazy initialization de módulos

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Áreas de Contribución
- 🐛 Reportar bugs
- 💡 Sugerir nuevas funcionalidades
- 📝 Mejorar documentación
- 🎨 Mejorar diseño UI/UX
- ⚡ Optimizaciones de rendimiento
- 🌍 Traducciones (i18n)

---

## 📄 Licencia

MIT License - Libre para usar, modificar y distribuir.

---

## 👤 Autor

**Nelson Pullella**

Creado con ❤️ como proyecto educativo de edición de imágenes en el navegador.

---

## 🙏 Agradecimientos

- Canvas API Documentation (MDN)
- Comunidad de JavaScript
- Diseño inspirado en editores modernos como Figma y Canva
- Font Poppins de Google Fonts

---

## 📞 Contacto y Soporte

- **GitHub Issues:** Para reportar bugs o solicitar features
- **Pull Requests:** Para contribuir código
- **Repositorio:** https://github.com/Nelneu/fotoconvierto

---

## 📚 Recursos Adicionales

- [PLAN_IMPLEMENTACION.md](./PLAN_IMPLEMENTACION.md) - Plan detallado de desarrollo
- [Canvas API - MDN](https://developer.mozilla.org/es/docs/Web/API/Canvas_API)
- [CSS Filter Effects](https://developer.mozilla.org/es/docs/Web/CSS/filter)
- [FileReader API](https://developer.mozilla.org/es/docs/Web/API/FileReader)

---

**Última actualización:** Enero 2026 - Fase 6 completada ✅
