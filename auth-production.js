// Authentication System for Judo Academy - Production Version

// Importar configuración
const SUPABASE_URL = 'https://yanivatvigbylzaxlavu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q';

// Variables globales para Supabase
let supabaseClient = null;
let currentUser = null;
let authState = {
    isAuthenticated: false,
    user: null,
    session: null
};

// Inicializar cliente de Supabase
function initializeSupabase() {
    try {
        // Verificar si Supabase está disponible
        if (typeof createClient !== 'undefined') {
            supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized successfully');
            return true;
        } else {
            console.warn('⚠️ Supabase client not available, using mock authentication');
            return false;
        }
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return false;
    }
}

// Sistema de autenticación mejorado
class AuthService {
    constructor() {
        this.supabaseAvailable = initializeSupabase();
        this.initAuth();
    }

    // Inicializar sistema de autenticación
    initAuth() {
        this.setupEventListeners();
        this.checkAuthState();
        this.initPasswordToggle();
    }

    // Configurar event listeners
    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        const logoutBtn = document.getElementById('logout-btn');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Escuchar cambios en la autenticación
        if (this.supabaseAvailable && supabaseClient) {
            supabaseClient.auth.onAuthStateChange((event, session) => {
                this.handleAuthStateChange(event, session);
            });
        }
    }

    // Manejar el formulario de login
    async handleLogin(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('login-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoading = document.getElementById('btn-loading');

        // Validación básica
        if (!email || !password) {
            this.showError('Por favor, completa todos los campos');
            return;
        }

        // Mostrar estado de carga
        this.setLoadingState(loginBtn, btnText, btnLoading, true);
        this.hideMessages();

        try {
            let userData = null;
            let sessionData = null;

            if (this.supabaseAvailable && supabaseClient) {
                // Autenticación con Supabase
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;

                userData = data.user;
                sessionData = data.session;

                // Obtener información adicional del usuario desde nuestra tabla
                const { data: userInfo, error: userError } = await supabaseClient
                    .from('judo_academy.users')
                    .select('*')
                    .eq('id', userData.id)
                    .single();

                if (userInfo) {
                    userData = { ...userData, ...userInfo };
                }

            } else {
                // Autenticación mock para desarrollo
                const mockUsers = [
                    {
                        id: 'admin-123',
                        email: 'admin@judoacademy.com',
                        name: 'Administrador Principal',
                        role: 'admin',
                        belt: 'Negro',
                        techniques_completed: 50,
                        classes_attended: 200,
                        password: 'admin123'
                    },
                    {
                        id: 'user-456',
                        email: 'user@judoacademy.com',
                        name: 'Juan Domínguez',
                        role: 'user',
                        belt: 'Naranja',
                        techniques_completed: 12,
                        classes_attended: 47,
                        password: 'user123'
                    },
                    {
                        id: 'user-789',
                        email: 'maria@judoacademy.com',
                        name: 'María Ángeles',
                        role: 'user',
                        belt: 'Amarillo',
                        techniques_completed: 8,
                        classes_attended: 32,
                        password: 'maria123'
                    }
                ];

                const user = mockUsers.find(u => u.email === email && u.password === password);
                if (!user) {
                    throw new Error('Credenciales inválidas');
                }

                userData = { ...user };
                delete userData.password;
            }

            if (userData) {
                // Actualizar estado de autenticación
                this.setAuthState(true, userData, sessionData);
                
                // Guardar en localStorage
                this.saveAuthState();
                
                // Actualizar UI
                this.updateUIForAuth();
                
                // Redirigir según rol
                this.redirectToDashboard();
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showError(this.getErrorMessage(error));
            this.setLoadingState(loginBtn, btnText, btnLoading, false);
        }
    }

    // Manejar logout
    async handleLogout() {
        try {
            if (this.supabaseAvailable && supabaseClient) {
                await supabaseClient.auth.signOut();
            }

            // Limpiar estado
            this.clearAuthState();
            
            // Redirigir a login
            window.location.href = 'login.html';

        } catch (error) {
            console.error('Logout error:', error);
            // Forzar logout incluso si hay error
            this.clearAuthState();
            window.location.href = 'login.html';
        }
    }

    // Manejar cambios en el estado de autenticación
    handleAuthStateChange(event, session) {
        console.log('Auth state change:', event, session);
        
        switch (event) {
            case 'SIGNED_IN':
                this.setAuthState(true, session.user, session);
                this.saveAuthState();
                this.updateUIForAuth();
                break;
                
            case 'SIGNED_OUT':
                this.clearAuthState();
                break;
                
            case 'TOKEN_REFRESHED':
                this.setAuthState(true, session.user, session);
                this.saveAuthState();
                break;
                
            case 'USER_UPDATED':
                this.setAuthState(true, session.user, session);
                this.saveAuthState();
                this.updateUIForAuth();
                break;
        }
    }

    // Verificar estado de autenticación
    async checkAuthState() {
        try {
            if (this.supabaseAvailable && supabaseClient) {
                const { data: { session }, error } = await supabaseClient.auth.getSession();
                
                if (session) {
                    // Obtener información adicional del usuario
                    const { data: userInfo, error: userError } = await supabaseClient
                        .from('judo_academy.users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (userInfo) {
                        this.setAuthState(true, { ...session.user, ...userInfo }, session);
                    } else {
                        this.setAuthState(true, session.user, session);
                    }
                }
            } else {
                // Verificar localStorage para mock auth
                const storedUser = localStorage.getItem('judo_user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    this.setAuthState(true, userData, null);
                }
            }

            this.updateUIForAuth();
            this.validateRouteAccess();

        } catch (error) {
            console.error('Error checking auth state:', error);
            this.clearAuthState();
        }
    }

    // Validar acceso a rutas según autenticación y rol
    validateRouteAccess() {
        const currentPath = window.location.pathname;
        const isAuthenticated = this.isAuthenticated();
        const userRole = this.getCurrentUserRole();

        // Páginas públicas
        const publicPages = ['/', '/index.html', '/login.html'];
        const isPublicPage = publicPages.some(page => currentPath.includes(page));

        // Si no está autenticado y no es página pública
        if (!isAuthenticated && !isPublicPage) {
            window.location.href = 'login.html';
            return;
        }

        // Si está autenticado, validar acceso según rol
        if (isAuthenticated) {
            if (currentPath.includes('admin.html') && userRole !== 'admin') {
                window.location.href = 'dashboard.html';
                return;
            }
        }
    }

    // Actualizar UI para usuario autenticado
    updateUIForAuth() {
        if (!this.isAuthenticated()) return;

        const user = this.getCurrentUser();
        if (!user) return;

        // Actualizar nombre de usuario
        const userNameElements = document.querySelectorAll('#user-name, #admin-name');
        userNameElements.forEach(el => {
            if (el) el.textContent = user.name || user.email;
        });

        // Actualizar iniciales
        const userInitialsElements = document.querySelectorAll('#user-initials');
        userInitialsElements.forEach(el => {
            if (el) {
                const name = user.name || user.email;
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                el.textContent = initials.substring(0, 2);
            }
        });

        // Actualizar estadísticas del dashboard
        this.updateDashboardStats();
    }

    // Actualizar estadísticas del dashboard
    updateDashboardStats() {
        const user = this.getCurrentUser();
        if (!user) return;

        // Actualizar progreso de técnicas
        const techniquesProgress = document.getElementById('techniques-progress');
        const techniquesBar = document.getElementById('techniques-bar');

        if (techniquesProgress && user.techniques_completed !== undefined) {
            techniquesProgress.textContent = `${user.techniques_completed}/20`;
        }

        if (techniquesBar && user.techniques_completed !== undefined) {
            const percentage = Math.round((user.techniques_completed / 20) * 100);
            techniquesBar.style.width = `${percentage}%`;
        }

        // Actualizar clases asistidas
        const classesAttended = document.getElementById('classes-attended');
        if (classesAttended && user.classes_attended !== undefined) {
            classesAttended.textContent = user.classes_attended.toString();
        }

        // Actualizar cinturón
        this.updateBeltDisplay();
    }

    // Actualizar visualización del cinturón
    updateBeltDisplay() {
        const user = this.getCurrentUser();
        if (!user || !user.belt) return;

        const beltDiv = document.querySelector('[class*="belt-"]');
        if (!beltDiv) return;

        const beltColors = {
            'Blanco': 'belt-white',
            'Amarillo': 'belt-yellow',
            'Naranja': 'belt-orange',
            'Verde': 'belt-green',
            'Azul': 'belt-blue',
            'Marrón': 'belt-brown',
            'Negro': 'belt-black'
        };

        // Limpiar clases existentes
        Object.values(beltColors).forEach(cls => {
            beltDiv.classList.remove(cls);
        });

        // Agregar nueva clase de cinturón
        const beltClass = beltColors[user.belt] || 'belt-orange';
        beltDiv.classList.add(beltClass);

        // Actualizar texto
        const beltText = beltDiv.parentElement?.querySelector('p');
        if (beltText) {
            beltText.textContent = `Cinturón ${user.belt}`;
        }
    }

    // Redirigir al dashboard apropiado
    redirectToDashboard() {
        const user = this.getCurrentUser();
        if (!user) return;

        const targetPage = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
        
        // Solo redirigir si no estamos ya en la página correcta
        if (!window.location.pathname.includes(targetPage)) {
            window.location.href = targetPage;
        }
    }

    // Configurar toggle de contraseña
    initPasswordToggle() {
        const toggleBtn = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');

        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        }
    }

    // Funciones de utilidad
    setLoadingState(button, btnText, btnLoading, isLoading) {
        if (!button) return;

        button.disabled = isLoading;
        
        if (btnText && btnLoading) {
            if (isLoading) {
                btnText.classList.add('hidden');
                btnLoading.classList.remove('hidden');
            } else {
                btnText.classList.remove('hidden');
                btnLoading.classList.add('hidden');
            }
        }
    }

    getErrorMessage(error) {
        if (typeof error === 'string') return error;
        
        if (error.message) {
            // Mapear errores comunes de Supabase
            const errorMap = {
                'Invalid login credentials': 'Credenciales inválidas',
                'Email not confirmed': 'Email no confirmado',
                'User not found': 'Usuario no encontrado',
                'Invalid password': 'Contraseña inválida'
            };
            
            return errorMap[error.message] || error.message;
        }
        
        return 'Error desconocido';
    }

    // Gestión del estado de autenticación
    setAuthState(isAuthenticated, user, session) {
        authState = {
            isAuthenticated,
            user,
            session
        };
        currentUser = user;
    }

    saveAuthState() {
        if (authState.user) {
            localStorage.setItem('judo_user', JSON.stringify(authState.user));
            localStorage.setItem('judo_auth_state', JSON.stringify({
                isAuthenticated: authState.isAuthenticated,
                timestamp: Date.now()
            }));
        }
    }

    clearAuthState() {
        authState = {
            isAuthenticated: false,
            user: null,
            session: null
        };
        currentUser = null;
        
        localStorage.removeItem('judo_user');
        localStorage.removeItem('judo_auth_state');
    }

    // Métodos públicos
    isAuthenticated() {
        return authState.isAuthenticated;
    }

    getCurrentUser() {
        return currentUser;
    }

    getCurrentUserRole() {
        return currentUser?.role || 'user';
    }

    isAdmin() {
        return this.getCurrentUserRole() === 'admin';
    }

    // Funciones de mensajes
    showError(message) {
        const errorMessage = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        if (errorMessage && errorText) {
            errorText.textContent = message;
            errorMessage.classList.remove('hidden');
            
            setTimeout(() => {
                this.hideMessages();
            }, 5000);
        }
    }

    showSuccess(message) {
        const successMessage = document.getElementById('success-message');
        const successText = document.getElementById('success-text');
        
        if (successMessage && successText) {
            successText.textContent = message;
            successMessage.classList.remove('hidden');
            
            setTimeout(() => {
                this.hideMessages();
            }, 3000);
        }
    }

    hideMessages() {
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        
        if (errorMessage) errorMessage.classList.add('hidden');
        if (successMessage) successMessage.classList.add('hidden');
    }
}

// Instancia global del servicio de autenticación
let authService = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    authService = new AuthService();
    
    // Validar acceso a rutas protegidas
    authService.validateRouteAccess();
});

// Exportar funciones para uso global
window.AuthService = AuthService;
window.authService = authService;

// Funciones de utilidad para compatibilidad con código anterior
window.handleLogin = function(event) {
    return authService ? authService.handleLogin(event) : null;
};

window.handleLogout = function() {
    return authService ? authService.handleLogout() : null;
};

window.getCurrentUser = function() {
    return authService ? authService.getCurrentUser() : null;
};

window.isAdmin = function() {
    return authService ? authService.isAdmin() : false;
};

window.showSuccess = function(message) {
    return authService ? authService.showSuccess(message) : null;
};

window.showError = function(message) {
    return authService ? authService.showError(message) : null;
};