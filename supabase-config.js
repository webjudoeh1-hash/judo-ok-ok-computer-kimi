// Supabase Configuration for Judo Academy - Production

// Detectar entorno
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// Configuración de Supabase
const SUPABASE_CONFIG = {
    // URL y claves desde variables de entorno o valores por defecto
    URL: import.meta.env?.VITE_SUPABASE_URL || 'https://yanivatvigbylzaxlavu.supabase.co',
    ANON_KEY: import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q',
    SERVICE_ROLE_KEY: import.meta.env?.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQxMDQyMywiZXhwIjoyMDc2OTg2NDIzfQ.ovMVW2lJfLOUl6r_pdn6xZzw8UGI7XqBwBXMCcpP_Ro'
};

// Configuración de la aplicación
const APP_CONFIG = {
    NAME: import.meta.env?.VITE_APP_NAME || 'Academia de Judo',
    DESCRIPTION: import.meta.env?.VITE_APP_DESCRIPTION || 'Disciplina, Respeto, Maestría',
    VERSION: import.meta.env?.VITE_APP_VERSION || '1.0.0',
    ENVIRONMENT: import.meta.env?.VITE_APP_ENVIRONMENT || 'development',
    
    // Feature flags
    ENABLE_REGISTRATION: import.meta.env?.VITE_ENABLE_REGISTRATION === 'true',
    ENABLE_ANALYTICS: import.meta.env?.VITE_ENABLE_ANALYTICS !== 'false',
    ENABLE_NOTIFICATIONS: import.meta.env?.VITE_ENABLE_NOTIFICATIONS !== 'false',
    ENABLE_STORAGE: import.meta.env?.VITE_ENABLE_STORAGE !== 'false',
    
    // Security settings
    SESSION_TIMEOUT: parseInt(import.meta.env?.VITE_SESSION_TIMEOUT) || 3600,
    MAX_LOGIN_ATTEMPTS: parseInt(import.meta.env?.VITE_MAX_LOGIN_ATTEMPTS) || 5,
    PASSWORD_MIN_LENGTH: parseInt(import.meta.env?.VITE_PASSWORD_MIN_LENGTH) || 8,
    
    // Storage settings
    MAX_FILE_SIZE: parseInt(import.meta.env?.VITE_MAX_FILE_SIZE) || 5242880,
    ALLOWED_FILE_TYPES: import.meta.env?.VITE_ALLOWED_FILE_TYPES?.split(',') || [
        'image/jpeg', 'image/png', 'image/webp', 'video/mp4'
    ]
};

// Database table names
const TABLES = {
    USERS: 'users',
    CONTENT: 'content',
    USER_PROGRESS: 'user_progress',
    CLASSES: 'classes',
    ATTENDANCE: 'attendance'
};

// User roles
const ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

// Content types
const CONTENT_TYPES = {
    TECHNIQUE: 'technique',
    THEORY: 'theory',
    VIDEO: 'video',
    DOCUMENT: 'document'
};

// Belt colors
const BELTS = {
    WHITE: 'Blanco',
    YELLOW: 'Amarillo',
    ORANGE: 'Naranja',
    GREEN: 'Verde',
    BLUE: 'Azul',
    BROWN: 'Marrón',
    BLACK: 'Negro'
};

// Configuración de esquema y tablas
const SCHEMA_CONFIG = {
    SCHEMA_NAME: isProduction ? 'judo_academy' : 'public',
    USE_SCHEMA: isProduction
};

// Tablas con esquema
const TABLES = {
    USERS: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.users' : 'users',
    CONTENT: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.content' : 'content',
    USER_PROGRESS: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.user_progress' : 'user_progress',
    CLASSES: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.classes' : 'classes',
    ATTENDANCE: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.attendance' : 'attendance',
    ACHIEVEMENTS: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.achievements' : 'achievements',
    USER_ACHIEVEMENTS: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.user_achievements' : 'user_achievements',
    NOTIFICATIONS: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.notifications' : 'notifications',
    CONTENT_CATEGORIES: SCHEMA_CONFIG.USE_SCHEMA ? 'judo_academy.content_categories' : 'content_categories'
};

// Roles y permisos
const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    INSTRUCTOR: 'instructor'
};

// Tipos de contenido
const CONTENT_TYPES = {
    TECHNIQUE: 'technique',
    THEORY: 'theory',
    VIDEO: 'video',
    DOCUMENT: 'document'
};

// Cinturones
const BELTS = {
    WHITE: 'Blanco',
    YELLOW: 'Amarillo',
    ORANGE: 'Naranja',
    GREEN: 'Verde',
    BLUE: 'Azul',
    BROWN: 'Marrón',
    BLACK: 'Negro'
};

// Niveles de dificultad
const DIFFICULTY_LEVELS = {
    BEGINNER: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado'
};

// Tipos de logros
const ACHIEVEMENT_TYPES = {
    BELT_PROMOTION: 'belt_promotion',
    TECHNIQUE_MASTER: 'technique_master',
    ATTENDANCE: 'attendance',
    SPECIAL: 'special'
};

// Configuración de almacenamiento
const STORAGE_CONFIG = {
    BUCKETS: {
        PROFILE_IMAGES: 'profile-images',
        CONTENT_MEDIA: 'content-media',
        ACHIEVEMENT_ICONS: 'achievement-icons'
    },
    PATHS: {
        PROFILES: 'profiles',
        CONTENT: 'content',
        ACHIEVEMENTS: 'achievements'
    }
};

// Configuración de notificaciones
const NOTIFICATION_CONFIG = {
    TYPES: {
        WELCOME: 'welcome',
        BELT_PROMOTION: 'belt_promotion',
        TECHNIQUE_COMPLETED: 'technique_completed',
        CLASS_REMINDER: 'class_reminder',
        ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
        SYSTEM: 'system'
    },
    DEFAULT_TTL: 2592000 // 30 días
};

// Exportar configuración completa
const CONFIG = {
    SUPABASE: SUPABASE_CONFIG,
    APP: APP_CONFIG,
    SCHEMA: SCHEMA_CONFIG,
    TABLES: TABLES,
    ROLES: ROLES,
    CONTENT_TYPES: CONTENT_TYPES,
    BELTS: BELTS,
    DIFFICULTY: DIFFICULTY_LEVELS,
    ACHIEVEMENTS: ACHIEVEMENT_TYPES,
    STORAGE: STORAGE_CONFIG,
    NOTIFICATIONS: NOTIFICATION_CONFIG,
    IS_PRODUCTION: isProduction
};

// Exportar para diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    // Navegador
    window.JUDO_CONFIG = CONFIG;
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.APP_CONFIG = APP_CONFIG;
} else {
    // Otros entornos
    global.JUDO_CONFIG = CONFIG;
}