# Visualizador 3D - Dormitorio Moderno

Un visualizador 3D interactivo construido con Three.js que muestra un modelo de dormitorio moderno con una interfaz de usuario similar a aplicaciones de arquitectura y diseño.

## 🚀 Características

- **Modelo 3D GLB**: Carga y visualiza el modelo `modern_bedroom.glb`
- **Interfaz Interactiva**: Paneles laterales con menús y controles
- **Navegación 3D**: Controles de órbita para explorar el modelo
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Sombras y Iluminación**: Renderizado realista con sombras

## 🛠️ Tecnologías

- **Three.js** - Motor 3D WebGL
- **HTML5 & CSS3** - Estructura e interfaz
- **JavaScript ES6** - Lógica de aplicación
- **GLTFLoader** - Carga de modelos 3D

## 📦 Deployment en Vercel

### Opción 1: Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer deployment
vercel --prod
```

### Opción 2: GitHub + Vercel
1. Sube el proyecto a GitHub
2. Conecta tu repositorio en [vercel.com](https://vercel.com)
3. El deployment será automático

### Opción 3: Drag & Drop
1. Ve a [vercel.com](https://vercel.com)
2. Arrastra la carpeta del proyecto
3. ¡Listo!

## 📁 Estructura del Proyecto

```
Modelo3DD/
├── index.html          # Página principal
├── styles.css          # Estilos de la interfaz
├── script.js           # Lógica Three.js
├── modern_bedroom.glb  # Modelo 3D
├── package.json        # Configuración del proyecto
├── vercel.json         # Configuración de Vercel
└── README.md           # Este archivo
```

## 🎮 Controles

- **Mouse**: Rotar y hacer zoom en la escena
- **Menú Lateral**: Navegar entre diferentes secciones
- **Puntos de Navegación**: Cambiar entre vistas predefinidas
- **Barra de Progreso**: Control interactivo (funcional)

## 🔧 Desarrollo Local

```bash
# Servidor HTTP simple
python -m http.server 8000

# O con Node.js
npx http-server
```

Luego abre: `http://localhost:8000`

## 📝 Notas Importantes

- El modelo GLB debe estar en la misma carpeta que el HTML
- Se requiere servidor HTTP (no funciona con file://)
- Los navegadores modernos soportan WebGL automáticamente

## 🐛 Troubleshooting

**Modelo no carga:**
- Verifica que `modern_bedroom.glb` esté en la carpeta raíz
- Revisa la consola del navegador para errores
- Asegúrate de usar HTTPS/HTTP (no file://)

**Performance lenta:**
- El modelo puede ser muy pesado, considera optimizarlo
- Ajusta la escala en `script.js` línea 86

---

¡Disfruta explorando tu dormitorio en 3D! 🏠✨
