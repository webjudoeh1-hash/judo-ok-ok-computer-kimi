# 📋 Guía Completa de Despliegue - Academia de Judo

## 🎯 Objetivo
Esta guía te llevará paso a paso para configurar el backend completo en Supabase y desplegar la aplicación en producción con Vercel.

## 📋 Requisitos Previos
- [ ] Cuenta en GitHub
- [ ] Cuenta en Supabase (gratuita)
- [ ] Cuenta en Vercel (gratuita)
- [ ] Git instalado en tu computadora
- [ ] Editor de código (VS Code recomendado)

---

## 🔧 PASO 1: CONFIGURACIÓN DE SUPABASE

### 1.1 Crear Proyecto en Supabase

1. Ir a [https://supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Registrarse con GitHub
4. Crear nuevo proyecto:
   - **Name**: `judo-academy-prod`
   - **Database Password**: Generar una contraseña segura y guardarla
   - **Region**: Seleccionar la más cercana (EU Central recomendado para España)

### 1.2 Configurar Variables de Entorno

Copiar las credenciales que aparecen en el dashboard:
```
URL: https://yanivatvigbylzaxlavu.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q
SERVICE ROLE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQxMDQyMywiZXhwIjoyMDc2OTg2NDIzfQ.ovMVW2lJfLOUl6r_pdn6xZzw8UGI7XqBwBXMCcpP_Ro
```

### 1.3 Ejecutar Scripts SQL

1. En el dashboard de Supabase, ir a **SQL Editor**
2. Copiar TODO el contenido del archivo `supabase-production-setup.sql`
3. Pegar en el editor y ejecutar (click en "Run")

**⚠️ IMPORTANTE**: Esto creará:
- ✅ Esquema `judo_academy`
- ✅ Todas las tablas necesarias
- ✅ Funciones y triggers
- ✅ Políticas de seguridad RLS
- ✅ Datos de prueba
- ✅ Configuración de almacenamiento

### 1.4 Configurar Autenticación

1. Ir a **Authentication** → **Providers**
2. Verificar que **Email** está habilitado
3. Ir a **Authentication** → **Policies**
4. Configurar:
   - **Confirm email**: Opcional (recomendado: false para demo)
   - **Secure password change**: true

### 1.5 Configurar Almacenamiento

1. Ir a **Storage**
2. Verificar que los buckets están creados:
   - `profile-images`
   - `content-media`
   - `achievement-icons`

---

## 📁 PASO 2: PREPARAR ARCHIVOS DEL PROYECTO

### 2.1 Crear Archivo de Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:
```bash
# Copiar desde el ejemplo
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://yanivatvigbylzaxlavu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q
VITE_APP_ENVIRONMENT="production"
```

### 2.2 Actualizar Configuración de Supabase

Asegurarse de que `supabase-config.js` esté configurado correctamente:
```javascript
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://yanivatvigbylzaxlavu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
```

### 2.3 Verificar Estructura de Archivos

La estructura debe ser:
```
/
├── index.html
├── login.html
├── admin.html
├── dashboard.html
├── main.js
├── auth.js (o auth-production.js)
├── admin.js
├── supabase-config.js
├── resources/
│   └── hero-judo.png
├── .env
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 PASO 3: SUBIR A GITHUB

### 3.1 Inicializar Repositorio

```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "Initial commit: Judo Academy Web App"
git branch -M main
```

### 3.2 Crear Repositorio en GitHub

1. Ir a [https://github.com/new](https://github.com/new)
2. Crear repositorio: `judo-academy-web`
3. NO inicializar con README (ya tenemos uno)

### 3.3 Conectar y Subir

```bash
# Agregar origen remoto (cambia tu-usuario por tu usuario de GitHub)
git remote add origin https://github.com/tu-usuario/judo-academy-web.git

# Subir código
git push -u origin main
```

---

## 🌐 PASO 4: DESPLEGAR EN VERCEL

### 4.1 Método 1: Desde la Web

1. Ir a [https://vercel.com](https://vercel.com)
2. Login con GitHub
3. Click en "New Project"
4. Importar desde GitHub
5. Seleccionar el repositorio `judo-academy-web`
6. Configurar:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (o dejar vacío para sitio estático)
   - **Output Directory**: `./`

### 4.2 Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, ir a **Settings** → **Environment Variables** y agregar:

```
VITE_SUPABASE_URL = https://yanivatvigbylzaxlavu.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q
VITE_APP_ENVIRONMENT = production
```

### 4.3 Deploy

Click en **Deploy** y esperar a que termine el despliegue.

**🎉 ¡Tu aplicación estará disponible en una URL como:**
`https://judo-academy-web.vercel.app`

---

## 🔍 PASO 5: VERIFICACIÓN Y PRUEBAS

### 5.1 Verificar Funcionalidades

1. **Landing Page**: Verificar que carga correctamente
2. **Login**: Probar con credenciales de demo
3. **Panel Admin**: Verificar acceso con admin@judoacademy.com
4. **Dashboard Usuario**: Verificar acceso con user@judoacademy.com
5. **Responsive**: Probar en móvil y desktop

### 5.2 Credenciales de Demo

```
ADMINISTRADOR:
- Email: admin@judoacademy.com
- Password: admin123
- Acceso: Panel completo de administración

USUARIO:
- Email: user@judoacademy.com  
- Password: user123
- Acceso: Dashboard personal

MARIA:
- Email: maria@judoacademy.com
- Password: maria123
- Acceso: Dashboard personal
```

### 5.3 Verificar Backend

1. **Supabase Dashboard** → **Table Editor**
2. Verificar que las tablas tienen datos
3. **Authentication** → **Users**: Ver usuarios registrados

---

## 🛠️ PASO 6: MANTENIMIENTO Y ACTUALIZACIONES

### 6.1 Actualizar Código

```bash
# Hacer cambios en los archivos
git add .
git commit -m "Update: nueva funcionalidad"
git push origin main

# Vercel desplegará automáticamente
```

### 6.2 Monitoreo

- **Vercel Analytics**: Métricas de uso
- **Supabase Dashboard**: Uso de base de datos
- **GitHub**: Control de versiones

### 6.3 Respaldos

- **Supabase**: Backups automáticos diarios
- **GitHub**: Todo el código versionado
- **Local**: Mantener copia local del proyecto

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### Problema: "Failed to fetch" o errores de CORS
**Solución**: 
1. Verificar que las variables de entorno estén correctas en Vercel
2. Verificar que las políticas RLS estén configuradas en Supabase
3. Verificar que el proyecto Supabase esté activo

### Problema: "User not found" al hacer login
**Solución**:
1. Verificar que los usuarios de prueba existen en Supabase
2. Ejecutar nuevamente los scripts SQL si es necesario
3. Verificar que la autenticación por email esté habilitada

### Problema: Imágenes no cargan
**Solución**:
1. Verificar que los buckets de Storage estén creados
2. Verificar las políticas de Storage
3. Verificar que las imágenes estén en `resources/`

### Problema: Estilos no se aplican
**Solución**:
1. Verificar que Tailwind CSS esté cargando
2. Verificar la consola del navegador por errores
3. Verificar que los archivos CSS estén correctos

---

## 📞 SOPORTE Y CONTACTO

Si encuentras problemas:

1. **Verificar logs en Vercel**: Dashboard → Deployments → View Logs
2. **Verificar Supabase**: Dashboard → Logs
3. **Abrir Issue en GitHub**: [Crear nuevo issue](https://github.com/tu-usuario/judo-academy-web/issues)

---

## 🎉 ¡FELICITACIONES!

Has desplegado exitosamente una aplicación web completa con:

- ✅ **Backend robusto** con Supabase
- ✅ **Sistema de autenticación** seguro
- ✅ **Panel de administración** completo
- ✅ **Diseño moderno** y responsive
- ✅ **Despliegue automático** con Vercel

**🥋 Tu Academia de Judo está lista para producción!**

---

## 📚 RECURSOS ADICIONALES

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [GitHub Actions](https://github.com/features/actions)

**¿Necesitas ayuda adicional?** No dudes en preguntar!