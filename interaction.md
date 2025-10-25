# Sistema de Interacción - Academia de Judo

## Flujo de Usuario Principal
1. **Landing Page**: Usuario llega y ve información general sobre la academia
2. **Login/Registro**: Acceso al área privada (solo admin puede registrar nuevos usuarios)
3. **Dashboard**: Según el rol, se redirige a área correspondiente

## Roles y Permisos

### Administrador
- **Login**: Acceso completo al panel de administración
- **Gestión de Usuarios**: Crear, editar, eliminar usuarios con rol "usuario"
- **Gestión de Contenidos**: CRUD completo sobre contenidos protegidos
- **Dashboard Admin**: Vista general de usuarios y contenidos

### Usuario
- **Login**: Acceso limitado al área privada
- **Consulta de Contenidos**: Solo lectura de contenidos asignados
- **Perfil Personal**: Ver información básica
- **Dashboard Usuario**: Acceso a contenidos educativos

## Interacciones Específicas
1. **Sistema de Login**: Formulario con validación en tiempo real
2. **Panel de Administración**: 
   - Tabla de usuarios con acciones CRUD
   - Gestor de contenidos con editor enriquecido
   - Estadísticas básicas de uso
3. **Área de Usuario**: 
   - Catálogo de técnicas y videos
   - Sistema de marcadores para contenidos favoritos
   - Progreso de aprendizaje

## Seguridad
- Autenticación basada en JWT con Supabase
- Protección de rutas según roles
- Validación de permisos en cada acción crítica