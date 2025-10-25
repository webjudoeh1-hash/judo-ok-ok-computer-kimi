# Academia de Judo - Aplicación Web

Una aplicación web completa para la gestión de una academia de Judo con sistema de autenticación, panel de administración y área de usuarios.

## Características

### 🥋 Área Pública
- Landing page con diseño moderno y animaciones
- Información sobre la filosofía del Judo
- Técnicas fundamentales y horarios
- Diseño totalmente responsive

### 🔐 Sistema de Autenticación
- Login seguro con diferentes roles
- Dos tipos de usuarios: Administrador y Usuario
- Gestión de sesiones y permisos

### 👨‍💼 Panel de Administración
- Dashboard con estadísticas generales
- Gestión completa de usuarios (CRUD)
- Gestión de contenidos educativos
- Sistema de analíticas y reportes

### 👤 Área de Usuario
- Dashboard personal con progreso
- Catálogo de técnicas disponibles
- Sistema de favoritos y marcadores
- Progreso de cinturones

## Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **Tailwind CSS** - Framework de estilos
- **JavaScript ES6+** - Lógica de aplicación
- **Plotly.js** - Gráficos y analíticas
- **Vanta.js** - Efectos visuales y fondos animados

### Backend
- **Supabase** - Backend como servicio
  - Autenticación y autorización
  - Base de datos PostgreSQL
  - Almacenamiento de archivos
  - Funciones edge

## Estructura del Proyecto

```
/
├── index.html              # Landing page pública
├── login.html              # Sistema de autenticación
├── admin.html              # Panel de administración
├── dashboard.html          # Área de usuario
├── main.js                 # Lógica principal
├── auth.js                 # Sistema de autenticación
├── admin.js                # Funciones administrativas
├── resources/              # Recursos multimedia
│   └── hero-judo.png       # Imagen hero principal
└── README.md               # Este archivo
```

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/judo-academy.git
cd judo-academy
```

### 2. Configurar Supabase

1. Crear una cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. Configurar las tablas necesarias:

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    belt VARCHAR(50) DEFAULT 'Blanco',
    techniques_completed INTEGER DEFAULT 0,
    classes_attended INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contenidos
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso de usuarios
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    favorite BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. Configurar las políticas de seguridad (Row Level Security):

```sql
-- Políticas para usuarios
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver su propia información
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Administradores pueden ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Políticas para contenidos
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden ver contenidos
CREATE POLICY "Authenticated users can view content" ON content
    FOR SELECT USING (auth.role() = 'authenticated');

-- Solo administradores pueden modificar contenidos
CREATE POLICY "Only admins can modify content" ON content
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env` con las credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://yanivatvigbylzaxlavu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q
```

### 4. Instalar Dependencias

```bash
# Instalar Supabase CLI (opcional)
npm install -g @supabase/cli

# Instalar dependencias del proyecto
npm install
```

## Despliegue en Vercel

### Método 1: Desde GitHub

1. Subir el proyecto a GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/judo-academy.git
git push -u origin main
```

2. Conectar con Vercel:
   - Ir a [Vercel](https://vercel.com)
   - Importar proyecto desde GitHub
   - Seleccionar el repositorio
   - Configurar variables de entorno
   - Desplegar

### Método 2: Desde CLI

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Desplegar:
```bash
vercel --prod
```

3. Configurar variables de entorno en el panel de Vercel:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

## Credenciales de Demo

### Administrador
- **Email:** admin@judoacademy.com
- **Contraseña:** admin123

### Usuario
- **Email:** user@judoacademy.com
- **Contraseña:** user123

## Funcionalidades Implementadas

### Sistema de Autenticación
- ✅ Login seguro con validación
- ✅ Differentes roles de usuario
- ✅ Gestión de sesiones
- ✅ Protección de rutas

### Panel de Administración
- ✅ Dashboard con estadísticas
- ✅ CRUD de usuarios
- ✅ CRUD de contenidos
- ✅ Sistema de analíticas

### Área de Usuario
- ✅ Progreso personal
- ✅ Catálogo de técnicas
- ✅ Sistema de favoritos
- ✅ Progreso de cinturones

### Diseño y UX
- ✅ Diseño responsive
- ✅ Animaciones y efectos visuales
- ✅ Interfaz moderna y intuitiva
- ✅ Accesibilidad mejorada

## Personalización

### Colores
Los colores principales se pueden modificar en los archivos CSS:
- Dorado: `#D4AF37`
- Negro: `#1A1A1A`
- Gris: `#2D2D2D`

### Contenido
- Las técnicas de Judo se pueden modificar en `main.js`
- Los datos de usuario se gestionan en `auth.js`
- El contenido administrativo se maneja en `admin.js`

## Soporte y Contribuciones

Para reportar problemas o sugerir mejoras:
1. Crear un Issue en GitHub
2. Enviar un Pull Request con las mejoras
3. Contactar al equipo de desarrollo

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

---

**Academia de Judo** - Desarrollado con ❤️ para la comunidad de Judo