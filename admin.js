// Admin functionality for Judo Academy

// Initialize admin panel
function initAdmin() {
    if (!window.getCurrentUser || !window.isAdmin()) {
        window.location.href = 'login.html';
        return;
    }

    loadDashboardData();
    loadUsers();
    loadContent();
    initAnalytics();
}

// Load dashboard statistics
function loadDashboardData() {
    // Mock data for dashboard
    const stats = {
        totalUsers: 24,
        totalContent: 18,
        classesToday: 5,
        achievements: 127
    };

    // Update dashboard cards
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-content').textContent = stats.totalContent;
    document.getElementById('classes-today').textContent = stats.classesToday;
    document.getElementById('achievements').textContent = stats.achievements;
}

// Load users table
function loadUsers() {
    const users = [
        {
            id: 1,
            name: 'Juan Domínguez',
            email: 'juan@judoacademy.com',
            role: 'user',
            status: 'active',
            belt: 'Naranja',
            joinDate: '2024-01-15'
        },
        {
            id: 2,
            name: 'María Ángeles',
            email: 'maria@judoacademy.com',
            role: 'user',
            status: 'active',
            belt: 'Amarillo',
            joinDate: '2024-02-01'
        },
        {
            id: 3,
            name: 'Roberto García',
            email: 'roberto@judoacademy.com',
            role: 'user',
            status: 'inactive',
            belt: 'Verde',
            joinDate: '2023-11-20'
        },
        {
            id: 4,
            name: 'Laura Martínez',
            email: 'laura@judoacademy.com',
            role: 'user',
            status: 'active',
            belt: 'Blanco',
            joinDate: '2024-03-10'
        }
    ];

    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        ${user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">${user.name}</div>
                        <div class="text-sm text-gray-500">Cinturón ${user.belt}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.email}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                    ${user.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ${user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="editUser(${user.id})" class="text-gold hover:text-yellow-600">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="viewUser(${user.id})" class="text-blue-500 hover:text-blue-700">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    // Store users globally
    window.usersData = users;
}

// Load content grid
function loadContent() {
    const content = [
        {
            id: 1,
            title: 'O Soto Gari - Tutorial Completo',
            type: 'technique',
            description: 'Guía completa del lanzamiento exterior de pierna',
            url: 'https://example.com/video1',
            createdAt: '2024-01-20',
            views: 156
        },
        {
            id: 2,
            title: 'Fundamentos del Ukemi',
            type: 'theory',
            description: 'Aprende a caer correctamente en Judo',
            url: 'https://example.com/video2',
            createdAt: '2024-01-18',
            views: 234
        },
        {
            id: 3,
            title: 'Kesa Gatame Variaciones',
            type: 'technique',
            description: 'Diferentes formas de aplicar la inmovilización',
            url: 'https://example.com/video3',
            createdAt: '2024-01-15',
            views: 89
        },
        {
            id: 4,
            title: 'Etiqueta en el Dojo',
            type: 'document',
            description: 'Reglas de conducta y etiqueta en la práctica',
            url: 'https://example.com/doc1',
            createdAt: '2024-01-12',
            views: 312
        },
        {
            id: 5,
            title: 'Calentamiento Pre-Clase',
            type: 'video',
            description: 'Rutina de calentamiento antes de la práctica',
            url: 'https://example.com/video4',
            createdAt: '2024-01-10',
            views: 178
        },
        {
            id: 6,
            title: 'Historia del Judo',
            type: 'theory',
            description: 'Los orígenes y evolución del Judo',
            url: 'https://example.com/doc2',
            createdAt: '2024-01-08',
            views: 267
        }
    ];

    const grid = document.getElementById('content-grid');
    if (!grid) return;

    grid.innerHTML = content.map(item => `
        <div class="bg-white rounded-lg card-shadow hover-lift overflow-hidden">
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-semibold text-gray-900">${item.title}</h3>
                    <span class="px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}">
                        ${getTypeLabel(item.type)}
                    </span>
                </div>
                <p class="text-gray-600 text-sm mb-4">${item.description}</p>
                <div class="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>${item.views} vistas</span>
                    <span>${formatDate(item.createdAt)}</span>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editContent(${item.id})" class="flex-1 bg-gold text-black py-2 px-3 rounded text-sm hover:bg-yellow-600 transition-colors">
                        <i class="fas fa-edit mr-1"></i>Editar
                    </button>
                    <button onclick="deleteContent(${item.id})" class="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors">
                        <i class="fas fa-trash mr-1"></i>Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Store content globally
    window.contentData = content;
}

// Initialize analytics
function initAnalytics() {
    const chartDiv = document.getElementById('analytics-chart');
    if (!chartDiv) return;

    const data = [
        {
            x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            y: [12, 18, 25, 32, 28, 35],
            name: 'Nuevos Usuarios',
            type: 'bar',
            marker: { color: '#D4AF37' }
        },
        {
            x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            y: [45, 52, 48, 61, 55, 67],
            name: 'Sesiones de Entrenamiento',
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#3B82F6', width: 3 },
            marker: { color: '#3B82F6', size: 8 },
            yaxis: 'y2'
        }
    ];

    const layout = {
        title: 'Estadísticas de la Academia',
        xaxis: { title: 'Mes' },
        yaxis: { title: 'Nuevos Usuarios' },
        yaxis2: {
            title: 'Sesiones de Entrenamiento',
            overlaying: 'y',
            side: 'right'
        },
        margin: { t: 50, r: 80, b: 50, l: 80 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot(chartDiv, data, layout, { displayModeBar: false });
}

// Section navigation
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => section.classList.add('hidden'));

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Update sidebar active state
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.onclick && item.onclick.toString().includes(sectionName)) {
            item.classList.add('active');
        }
    });
}

// User management functions
function openUserModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.add('show');
}

function closeUserModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.remove('show');
    document.getElementById('user-form').reset();
}

function editUser(userId) {
    const user = window.usersData.find(u => u.id === userId);
    if (!user) return;

    // Fill form with user data
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;
    
    // Show modal
    openUserModal();
    
    // Store editing user ID
    window.editingUserId = userId;
}

function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        // Remove user from data
        window.usersData = window.usersData.filter(u => u.id !== userId);
        
        // Reload users table
        loadUsers();
        
        // Show success message
        if (window.showSuccess) {
            window.showSuccess('Usuario eliminado correctamente');
        }
    }
}

function viewUser(userId) {
    const user = window.usersData.find(u => u.id === userId);
    if (!user) return;

    alert(`Información del usuario:\n\nNombre: ${user.name}\nEmail: ${user.email}\nRol: ${user.role}\nCinturón: ${user.belt}\nFecha de registro: ${user.joinDate}`);
}

// Content management functions
function openContentModal() {
    const modal = document.getElementById('content-modal');
    modal.classList.add('show');
}

function closeContentModal() {
    const modal = document.getElementById('content-modal');
    modal.classList.remove('show');
    document.getElementById('content-form').reset();
}

function editContent(contentId) {
    const item = window.contentData.find(c => c.id === contentId);
    if (!item) return;

    // Fill form with content data
    document.getElementById('content-title').value = item.title;
    document.getElementById('content-type').value = item.type;
    document.getElementById('content-description').value = item.description;
    document.getElementById('content-url').value = item.url;
    
    // Show modal
    openContentModal();
    
    // Store editing content ID
    window.editingContentId = contentId;
}

function deleteContent(contentId) {
    if (confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
        // Remove content from data
        window.contentData = window.contentData.filter(c => c.id !== contentId);
        
        // Reload content grid
        loadContent();
        
        // Show success message
        if (window.showSuccess) {
            window.showSuccess('Contenido eliminado correctamente');
        }
    }
}

// Form submissions
document.addEventListener('DOMContentLoaded', function() {
    // User form submission
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                password: document.getElementById('user-password').value,
                role: document.getElementById('user-role').value
            };
            
            if (window.editingUserId) {
                // Update existing user
                const userIndex = window.usersData.findIndex(u => u.id === window.editingUserId);
                if (userIndex !== -1) {
                    window.usersData[userIndex] = { ...window.usersData[userIndex], ...formData };
                }
                window.editingUserId = null;
            } else {
                // Create new user
                const newUser = {
                    id: Math.max(...window.usersData.map(u => u.id)) + 1,
                    ...formData,
                    status: 'active',
                    belt: 'Blanco',
                    joinDate: new Date().toISOString().split('T')[0]
                };
                window.usersData.push(newUser);
            }
            
            loadUsers();
            closeUserModal();
            
            if (window.showSuccess) {
                window.showSuccess('Usuario guardado correctamente');
            }
        });
    }

    // Content form submission
    const contentForm = document.getElementById('content-form');
    if (contentForm) {
        contentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('content-title').value,
                type: document.getElementById('content-type').value,
                description: document.getElementById('content-description').value,
                url: document.getElementById('content-url').value
            };
            
            if (window.editingContentId) {
                // Update existing content
                const contentIndex = window.contentData.findIndex(c => c.id === window.editingContentId);
                if (contentIndex !== -1) {
                    window.contentData[contentIndex] = { ...window.contentData[contentIndex], ...formData };
                }
                window.editingContentId = null;
            } else {
                // Create new content
                const newContent = {
                    id: Math.max(...window.contentData.map(c => c.id)) + 1,
                    ...formData,
                    createdAt: new Date().toISOString().split('T')[0],
                    views: 0
                };
                window.contentData.push(newContent);
            }
            
            loadContent();
            closeContentModal();
            
            if (window.showSuccess) {
                window.showSuccess('Contenido guardado correctamente');
            }
        });
    }

    // Initialize admin panel
    initAdmin();
});

// Utility functions
function getTypeColor(type) {
    const colors = {
        'technique': 'bg-blue-100 text-blue-800',
        'theory': 'bg-green-100 text-green-800',
        'video': 'bg-red-100 text-red-800',
        'document': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
}

function getTypeLabel(type) {
    const labels = {
        'technique': 'Técnica',
        'theory': 'Teoría',
        'video': 'Video',
        'document': 'Documento'
    };
    return labels[type] || type;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export functions for global use
window.showSection = showSection;
window.openUserModal = openUserModal;
window.closeUserModal = closeUserModal;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.viewUser = viewUser;
window.openContentModal = openContentModal;
window.closeContentModal = closeContentModal;
window.editContent = editContent;
window.deleteContent = deleteContent;