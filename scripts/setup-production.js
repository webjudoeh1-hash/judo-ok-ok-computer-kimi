#!/usr/bin/env node

// =========================================
// SCRIPT DE CONFIGURACIÓN PARA PRODUCCIÓN
// Academia de Judo - Setup Automation
// =========================================

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuración de colores para CLI
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Utilidades de consola
const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
    step: (msg) => console.log(`\n${colors.bright}${colors.blue}📋${colors.reset} ${colors.bright}${msg}${colors.reset}`),
    input: (msg) => `${colors.magenta}❓${colors.reset} ${msg}`
};

// Interfaz de línea de comandos
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

// Función principal
async function main() {
    console.log(`${colors.bright}${colors.green}`);
    console.log('🥋 ACADEMIA DE JUDO - SETUP DE PRODUCCIÓN');
    console.log('=========================================');
    console.log(`${colors.reset}`);
    
    log.info('Bienvenido al sistema de configuración para producción');
    log.info('Este script te guiará paso a paso para configurar tu aplicación');
    
    try {
        await checkProjectStructure();
        await configureEnvironment();
        await setupGitignore();
        await createPackageJson();
        await verifyConfiguration();
        
        log.success('🎉 ¡Configuración completada exitosamente!');
        log.info('Siguientes pasos:');
        log.info('1. Revisa el archivo .env que se ha creado');
        log.info('2. Ejecuta los scripts SQL en Supabase');
        log.info('3. Sube el proyecto a GitHub');
        log.info('4. Despliega en Vercel');
        log.info('📚 Lee el archivo DEPLOYMENT_GUIDE.md para instrucciones detalladas');
        
    } catch (error) {
        log.error(`Error en la configuración: ${error.message}`);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Verificar estructura del proyecto
async function checkProjectStructure() {
    log.step('Verificando estructura del proyecto...');
    
    const requiredFiles = [
        'index.html',
        'login.html',
        'admin.html',
        'dashboard.html',
        'main.js',
        'auth.js',
        'admin.js',
        'supabase-config.js',
        'resources/hero-judo.png'
    ];
    
    const missingFiles = [];
    
    for (const file of requiredFiles) {
        const filePath = path.join(process.cwd(), file);
        if (!fs.existsSync(filePath)) {
            missingFiles.push(file);
        }
    }
    
    if (missingFiles.length > 0) {
        log.warning('Archivos faltantes detectados:');
        missingFiles.forEach(file => log.warning(`  - ${file}`));
        
        const continueSetup = await question(log.input('¿Deseas continuar con la configuración? (s/n): '));
        if (continueSetup.toLowerCase() !== 's' && continueSetup.toLowerCase() !== 'si') {
            throw new Error('Configuración cancelada por el usuario');
        }
    } else {
        log.success('✅ Estructura del proyecto verificada correctamente');
    }
}

// Configurar variables de entorno
async function configureEnvironment() {
    log.step('Configurando variables de entorno...');
    
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    // Verificar si ya existe .env
    if (fs.existsSync(envPath)) {
        const overwrite = await question(log.input('El archivo .env ya existe. ¿Deseas sobrescribirlo? (s/n): '));
        if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'si') {
            log.info('Manteniendo el archivo .env existente');
            return;
        }
    }
    
    // Leer el archivo de ejemplo
    let envContent = '';
    if (fs.existsSync(envExamplePath)) {
        envContent = fs.readFileSync(envExamplePath, 'utf8');
    } else {
        // Crear contenido básico si no existe el ejemplo
        envContent = `# Variables de entorno - Academia de Judo
VITE_SUPABASE_URL=https://yanivatvigbylzaxlavu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q
VITE_APP_ENVIRONMENT=production
`;
    }
    
    // Solicitar credenciales de Supabase
    log.info('Por favor, ingresa tus credenciales de Supabase:');
    const supabaseUrl = await question(log.input('Supabase URL (deja vacío para usar el valor por defecto): '));
    const supabaseKey = await question(log.input('Supabase Anon Key (deja vacío para usar el valor por defecto): '));
    
    // Reemplazar valores si se proporcionan
    if (supabaseUrl.trim()) {
        envContent = envContent.replace(/VITE_SUPABASE_URL=.*/g, `VITE_SUPABASE_URL=${supabaseUrl.trim()}`);
    }
    
    if (supabaseKey.trim()) {
        envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.*/g, `VITE_SUPABASE_ANON_KEY=${supabaseKey.trim()}`);
    }
    
    // Escribir el archivo .env
    fs.writeFileSync(envPath, envContent);
    log.success('✅ Archivo .env creado exitosamente');
}

// Configurar .gitignore
async function setupGitignore() {
    log.step('Configurando .gitignore...');
    
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables (CRÍTICO PARA SEGURIDAD)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/

# Vercel
.vercel

# Supabase
.supabase

# Local env files
.env*.local

# Vite
.vite/

# Archivos de respaldo
*.backup
*.bak

# Archivos temporales
*.tmp
*.temp

# Configuraciones personales
config.local.js
settings.local.json
`;
    
    if (fs.existsSync(gitignorePath)) {
        const overwrite = await question(log.input('El archivo .gitignore ya existe. ¿Deseas sobrescribirlo? (s/n): '));
        if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'si') {
            log.info('Manteniendo el archivo .gitignore existente');
            return;
        }
    }
    
    fs.writeFileSync(gitignorePath, gitignoreContent);
    log.success('✅ Archivo .gitignore configurado exitosamente');
}

// Crear package.json si no existe
async function createPackageJson() {
    log.step('Verificando package.json...');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packagePath)) {
        log.info('package.json ya existe, verificando configuración...');
        return;
    }
    
    const packageContent = {
        name: "judo-academy-web",
        version: "1.0.0",
        description: "Aplicación web completa para academia de Judo",
        main: "index.html",
        scripts: {
            dev: "vite",
            build: "vite build",
            preview: "vite preview",
            deploy: "vercel --prod"
        },
        keywords: ["judo", "academy", "martial-arts", "web-app", "supabase"],
        author: "Academia de Judo",
        license: "MIT",
        devDependencies: {
            vite: "^4.5.0",
            vercel: "^32.5.0"
        },
        dependencies: {
            "@supabase/supabase-js": "^2.38.4"
        }
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
    log.success('✅ Archivo package.json creado exitosamente');
}

// Verificar configuración final
async function verifyConfiguration() {
    log.step('Verificando configuración final...');
    
    const checks = [
        {
            name: 'Archivo .env',
            path: path.join(process.cwd(), '.env'),
            required: true
        },
        {
            name: 'Archivo .gitignore',
            path: path.join(process.cwd(), '.gitignore'),
            required: true
        },
        {
            name: 'Archivo package.json',
            path: path.join(process.cwd(), 'package.json'),
            required: true
        },
        {
            name: 'Archivo vercel.json',
            path: path.join(process.cwd(), 'vercel.json'),
            required: false
        }
    ];
    
    let allGood = true;
    
    for (const check of checks) {
        const exists = fs.existsSync(check.path);
        const status = exists ? '✅' : (check.required ? '❌' : '⚠️');
        const color = exists ? colors.green : (check.required ? colors.red : colors.yellow);
        
        console.log(`  ${status} ${check.name}`);
        
        if (!exists && check.required) {
            allGood = false;
        }
    }
    
    if (allGood) {
        log.success('✅ Verificación completada. El proyecto está listo para producción');
    } else {
        log.warning('⚠️ Algunos archivos requeridos no existen. Revisa la configuración');
    }
}

// Ejecutar script principal
if (require.main === module) {
    main().catch(error => {
        console.error('Error fatal:', error);
        process.exit(1);
    });
}

// Exportar funciones para uso en otros scripts
module.exports = {
    checkProjectStructure,
    configureEnvironment,
    setupGitignore,
    createPackageJson,
    verifyConfiguration,
    log,
    colors
};