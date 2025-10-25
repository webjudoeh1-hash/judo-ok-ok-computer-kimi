# Estructura del Proyecto - Academia de Judo

## Archivos Principales

### Frontend (HTML/CSS/JS)
- `index.html` - Landing page pública
- `login.html` - Sistema de autenticación
- `admin.html` - Panel de administración
- `dashboard.html` - Área de usuario
- `main.js` - Lógica principal de la aplicación
- `auth.js` - Sistema de autenticación
- `admin.js` - Funciones administrativas

### Backend (Supabase)
- Configuración de base de datos y autenticación
- Tablas: users, content, roles, permissions
- Políticas de seguridad y acceso

### Recursos
- `resources/hero-judo.png` - Imagen hero principal
- `resources/icons/` - Iconografía de la aplicación
- `resources/videos/` - Contenido multimedia

## Estructura de Carpetas
```
/mnt/okcomputer/output/
├── index.html
├── login.html
├── admin.html
├── dashboard.html
├── main.js
├── auth.js
├── admin.js
├── design.md
├── interaction.md
├── outline.md
├── resources/
│   ├── hero-judo.png
│   └── (otros recursos)
└── README.md
```

## Funcionalidades por Archivo

### index.html
- Hero con imagen de judo
- Información general de la academia
- Sección de horarios y ubicación
- Galería de técnicas básicas
- Footer con información de contacto

### login.html
- Formulario de autenticación
- Validación en tiempo real
- Opciones de recuperación de contraseña
- Redirección según rol de usuario

### admin.html
- Dashboard administrativo
- Gestión de usuarios (CRUD)
- Gestión de contenidos
- Estadísticas y reportes básicos

### dashboard.html
- Área personal del usuario
- Acceso a contenidos educativos
- Sistema de progreso
- Marcadores y favoritos

### main.js
- Configuración general de la aplicación
- Navegación y routing
- Animaciones y efectos visuales
- Integración con librerías externas

### auth.js
- Sistema de autenticación con Supabase
- Gestión de sesiones
- Control de permisos y roles
- Seguridad y validación

### admin.js
- Funciones administrativas específicas
- CRUD de usuarios
- CRUD de contenidos
- Gestión de permisos