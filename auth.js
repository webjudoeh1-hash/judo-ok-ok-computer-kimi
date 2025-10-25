// Authentication System for Judo Academy

// Supabase configuration
const SUPABASE_URL = 'https://yanivatvigbylzaxlavu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhbml2YXR2aWdieWx6YXhsYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTA0MjMsImV4cCI6MjA3Njk4NjQyM30.Oxsv9YIa_d6vf3TZamhEHraWchHYyg4IohQpauG7l-Q';

// Initialize Supabase client
let supabase;
if (typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    // Fallback for when Supabase library is not loaded
    console.warn('Supabase client not available. Using mock authentication.');
}

// Mock user database for demo purposes
const mockUsers = [
    {
        id: '1',
        email: 'admin@judoacademy.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin',
        belt: 'Negro',
        techniques_completed: 20,
        classes_attended: 150
    },
    {
        id: '2',
        email: 'user@judoacademy.com',
        password: 'user123',
        name: 'Juan Domínguez',
        role: 'user',
        belt: 'Naranja',
        techniques_completed: 12,
        classes_attended: 47
    },
    {
        id: '3',
        email: 'maria@judoacademy.com',
        password: 'maria123',
        name: 'María Ángeles',
        role: 'user',
        belt: 'Amarillo',
        techniques_completed: 8,
        classes_attended: 32
    }
];

// Current user state
let currentUser = null;

// Initialize authentication system
function initAuth() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Check for existing session
    checkAuthState();
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    // Show loading state
    loginBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    hideMessages();

    try {
        // Try Supabase authentication first
        if (supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            
            currentUser = data.user;
        } else {
            // Fallback to mock authentication
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = user;
                // Remove password from user object
                delete currentUser.password;
            } else {
                throw new Error('Credenciales inválidas');
            }
        }

        if (currentUser) {
            // Store user session
            localStorage.setItem('judo_user', JSON.stringify(currentUser));
            
            // Redirect based on role
            redirectToDashboard();
        }

    } catch (error) {
        // Show error message
        showError(error.message || 'Error al iniciar sesión');
        
        // Reset button state
        loginBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('judo_user');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Check authentication state
function checkAuthState() {
    const storedUser = localStorage.getItem('judo_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForAuth();
    } else if (!window.location.pathname.includes('login.html') && 
               !window.location.pathname.includes('index.html') &&
               window.location.pathname !== '/') {
        // Redirect to login if not authenticated and not on public pages
        window.location.href = 'login.html';
    }
}

// Redirect to appropriate dashboard
function redirectToDashboard() {
    if (currentUser) {
        if (currentUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
}

// Update UI for authenticated user
function updateUIForAuth() {
    if (!currentUser) return;

    // Update user name and initials
    const userNameElements = document.querySelectorAll('#user-name, #admin-name');
    const userInitialsElements = document.querySelectorAll('#user-initials');

    userNameElements.forEach(el => {
        if (el) el.textContent = currentUser.name || currentUser.email;
    });

    userInitialsElements.forEach(el => {
        if (el) {
            const name = currentUser.name || currentUser.email;
            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
            el.textContent = initials.substring(0, 2);
        }
    });

    // Update dashboard stats if on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboardStats();
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    if (!currentUser) return;

    // Update progress based on user data
    const techniquesProgress = document.getElementById('techniques-progress');
    const techniquesBar = document.getElementById('techniques-bar');
    const classesAttended = document.getElementById('classes-attended');

    if (techniquesProgress) {
        techniquesProgress.textContent = `${currentUser.techniques_completed}/20`;
    }

    if (techniquesBar) {
        const percentage = Math.round((currentUser.techniques_completed / 20) * 100);
        techniquesBar.style.width = `${percentage}%`;
    }

    // Update belt display
    updateBeltDisplay();
}

// Update belt display
function updateBeltDisplay() {
    if (!currentUser) return;

    const beltDiv = document.querySelector('.belt-orange'); // Default to orange
    if (beltDiv) {
        const beltColors = {
            'Blanco': 'belt-white',
            'Amarillo': 'belt-yellow',
            'Naranja': 'belt-orange',
            'Verde': 'belt-green',
            'Azul': 'belt-blue',
            'Marrón': 'belt-brown',
            'Negro': 'belt-black'
        };

        // Remove existing belt classes
        Object.values(beltColors).forEach(cls => {
            beltDiv.classList.remove(cls);
        });

        // Add current belt class
        const beltClass = beltColors[currentUser.belt] || 'belt-orange';
        beltDiv.classList.add(beltClass);

        // Update belt text
        const beltText = beltDiv.parentElement.querySelector('p');
        if (beltText) {
            beltText.textContent = `Cinturón ${currentUser.belt}`;
        }
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    if (errorMessage && errorText) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideMessages();
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    if (successMessage && successText) {
        successText.textContent = message;
        successMessage.classList.remove('hidden');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            hideMessages();
        }, 3000);
    }
}

// Hide all messages
function hideMessages() {
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    if (errorMessage) errorMessage.classList.add('hidden');
    if (successMessage) successMessage.classList.add('hidden');
}

// Password toggle functionality
function initPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = toggleBtn.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
}

// Admin functions
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

function requireAdmin() {
    if (!isAdmin()) {
        window.location.href = 'dashboard.html';
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    initPasswordToggle();
    
    // Check if admin access is required
    if (window.location.pathname.includes('admin.html')) {
        requireAdmin();
    }
});

// Export functions for global use
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.getCurrentUser = getCurrentUser;
window.isAdmin = isAdmin;
window.showSuccess = showSuccess;
window.showError = showError;