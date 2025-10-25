// Main JavaScript for Judo Academy Web App

// Initialize Vanta.js background for hero section
function initVantaBackground() {
    if (typeof VANTA !== 'undefined' && document.getElementById('vanta-bg')) {
        VANTA.BIRDS({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0x1a1a1a,
            color1: 0xd4af37,
            color2: 0x2d2d2d,
            birdSize: 1.20,
            wingSpan: 25.00,
            speedLimit: 3.00,
            separation: 20.00,
            alignment: 20.00,
            cohesion: 20.00,
            quantity: 3.00
        });
    }
}

// Initialize Vanta.js for login background
function initLoginVanta() {
    if (typeof VANTA !== 'undefined' && document.getElementById('vanta-bg')) {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xd4af37,
            backgroundColor: 0x1a1a1a,
            points: 8.00,
            maxDistance: 25.00,
            spacing: 16.00
        });
    }
}

// Scroll reveal animation
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Dashboard specific functions
function initDashboard() {
    if (document.getElementById('techniques-grid')) {
        populateTechniques();
        initProgressChart();
        initFilters();
    }
}

// Populate techniques grid
function populateTechniques() {
    const techniquesGrid = document.getElementById('techniques-grid');
    if (!techniquesGrid) return;

    const techniques = [
        {
            id: 1,
            name: 'O Soto Gari',
            type: 'nagewaza',
            category: 'Nage-waza',
            difficulty: 'Principiante',
            completed: true,
            favorite: false,
            description: 'Gran lanzamiento exterior de la pierna. Una de las técnicas más fundamentales del Judo.',
            videoUrl: 'https://example.com/video1',
            steps: [
                'Coge la postura correcta frente a tu oponente',
                'Agárrate a tu oponente con ambas manos',
                'Paso hacia adelante con tu pie derecho',
                'Gira y barre la pierna de tu oponente',
                'Completa el lanzamiento controlado'
            ]
        },
        {
            id: 2,
            name: 'Ippon Seoi Nage',
            type: 'nagewaza',
            category: 'Nage-waza',
            difficulty: 'Intermedio',
            completed: true,
            favorite: true,
            description: 'Lanzamiento sobre el hombro de una mano. Técnica espectacular y efectiva.',
            videoUrl: 'https://example.com/video2',
            steps: [
                'Gira bajo el brazo de tu oponente',
                'Coloca tu cadera contra la suya',
                'Levanta a tu oponente sobre tu hombro',
                'Completa el lanzamiento hacia adelante'
            ]
        },
        {
            id: 3,
            name: 'Kesa Gatame',
            type: 'katamewaza',
            category: 'Katame-waza',
            difficulty: 'Principiante',
            completed: false,
            favorite: false,
            description: 'Inmovilización de la bufanda. Control básico en el suelo.',
            videoUrl: 'https://example.com/video3',
            steps: [
                'Colócate lateralmente sobre tu oponente',
                'Agarra su cuello con una mano',
                'Controla su brazo con la otra mano',
                'Mantén la presión y control'
            ]
        },
        {
            id: 4,
            name: 'Juji Gatame',
            type: 'katamewaza',
            category: 'Katame-waza',
            difficulty: 'Avanzado',
            completed: false,
            favorite: true,
            description: 'Llave de brazo en cruz. Técnica de sumisión muy efectiva.',
            videoUrl: 'https://example.com/video4',
            steps: [
                'Controla el brazo de tu oponente',
                'Coloca tus piernas en cruz sobre su pecho',
                'Aplica presión en su codo',
                'Mantén el control hasta la sumisión'
            ]
        },
        {
            id: 5,
            name: 'De Ashi Barai',
            type: 'nagewaza',
            category: 'Nage-waza',
            difficulty: 'Principiante',
            completed: true,
            favorite: false,
            description: 'Barrido sencillo del pie. Técnica básica de desequilibrio.',
            videoUrl: 'https://example.com/video5',
            steps: [
                'Toma la postura correcta',
                'Desequilibra a tu oponente hacia atrás',
                'Barre su pie con el tuyo',
                'Completa el barrido controlado'
            ]
        },
        {
            id: 6,
            name: 'Tomoe Nage',
            type: 'nagewaza',
            category: 'Nage-waza',
            difficulty: 'Intermedio',
            completed: false,
            favorite: false,
            description: 'Lanzamiento en círculo. Técnica espectacular usando tu pie en su estómago.',
            videoUrl: 'https://example.com/video6',
            steps: [
                'Coloca tu pie en el estómago de tu oponente',
                'Caiga hacia atrás mientras lo impulsas',
                'Gira en el aire para completar el lanzamiento',
                'Mantenga el control durante la caída'
            ]
        }
    ];

    techniquesGrid.innerHTML = '';
    techniques.forEach(technique => {
        const card = createTechniqueCard(technique);
        techniquesGrid.appendChild(card);
    });

    // Store techniques globally for other functions
    window.techniquesData = techniques;
}

// Create technique card element
function createTechniqueCard(technique) {
    const card = document.createElement('div');
    card.className = `technique-card bg-white rounded-lg card-shadow p-4 cursor-pointer ${technique.completed ? 'completed' : ''} ${technique.favorite ? 'favorite' : ''}`;
    card.onclick = () => openTechniqueModal(technique);

    const difficultyColor = {
        'Principiante': 'bg-green-100 text-green-800',
        'Intermedio': 'bg-yellow-100 text-yellow-800',
        'Avanzado': 'bg-red-100 text-red-800'
    };

    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold text-gray-900">${technique.name}</h3>
            <div class="flex space-x-1">
                ${technique.completed ? '<i class="fas fa-check text-green-500"></i>' : ''}
                ${technique.favorite ? '<i class="fas fa-heart text-gold"></i>' : ''}
            </div>
        </div>
        <p class="text-sm text-gray-600 mb-3">${technique.description}</p>
        <div class="flex justify-between items-center">
            <span class="text-xs px-2 py-1 rounded-full ${difficultyColor[technique.difficulty]}">${technique.difficulty}</span>
            <span class="text-xs text-gray-500">${technique.category}</span>
        </div>
    `;

    return card;
}

// Initialize progress chart
function initProgressChart() {
    const chartDiv = document.getElementById('progress-chart');
    if (!chartDiv) return;

    const data = [{
        x: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        y: [3, 5, 8, 12, 15, 18],
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#D4AF37', width: 3 },
        marker: { color: '#D4AF37', size: 8 }
    }];

    const layout = {
        margin: { t: 10, r: 10, b: 30, l: 30 },
        xaxis: { showgrid: false },
        yaxis: { showgrid: true, gridcolor: '#f3f4f6' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot(chartDiv, data, layout, { displayModeBar: false });
}

// Initialize filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-gold', 'text-white');
                b.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            btn.classList.add('active', 'bg-gold', 'text-white');
            btn.classList.remove('text-gray-600', 'hover:bg-gray-100');

            // Filter techniques
            const filter = btn.dataset.filter;
            filterTechniques(filter);
        });
    });
}

// Filter techniques
function filterTechniques(filter) {
    const cards = document.querySelectorAll('.technique-card');
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const technique = window.techniquesData.find(t => t.name === card.querySelector('h3').textContent);
            if (technique && technique.type === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Technique modal functions
function openTechniqueModal(technique) {
    const modal = document.getElementById('technique-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');

    title.textContent = technique.name;
    content.innerHTML = `
        <div class="mb-4">
            <span class="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 mb-2">${technique.category}</span>
            <p class="text-gray-600">${technique.description}</p>
        </div>
        <div class="mb-4">
            <h4 class="font-semibold text-gray-900 mb-2">Pasos para ejecutar:</h4>
            <ol class="list-decimal list-inside space-y-1">
                ${technique.steps.map(step => `<li class="text-gray-600">${step}</li>`).join('')}
            </ol>
        </div>
        ${technique.videoUrl ? `
            <div class="mb-4">
                <h4 class="font-semibold text-gray-900 mb-2">Video Tutorial:</h4>
                <div class="bg-gray-100 rounded-lg p-4 text-center">
                    <i class="fas fa-play-circle text-4xl text-gold cursor-pointer"></i>
                    <p class="text-sm text-gray-600 mt-2">Ver video demostrativo</p>
                </div>
            </div>
        ` : ''}
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Store current technique
    window.currentTechnique = technique;
}

function closeTechniqueModal() {
    const modal = document.getElementById('technique-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function toggleFavorite() {
    if (window.currentTechnique) {
        window.currentTechnique.favorite = !window.currentTechnique.favorite;
        // Update UI
        closeTechniqueModal();
        populateTechniques(); // Refresh the grid
        updateFavoritesList();
    }
}

function markAsCompleted() {
    if (window.currentTechnique) {
        window.currentTechnique.completed = true;
        // Update UI
        closeTechniqueModal();
        populateTechniques(); // Refresh the grid
        updateProgressStats();
    }
}

function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;

    const favorites = window.techniquesData.filter(t => t.favorite);
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="text-gray-500 text-sm">No tienes técnicas favoritas aún.</p>';
        return;
    }

    favoritesList.innerHTML = favorites.map(technique => `
        <div class="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onclick="openTechniqueModal(window.techniquesData.find(t => t.id === ${technique.id}))">
            <div class="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white text-xs font-semibold">
                ${technique.name.charAt(0)}
            </div>
            <span class="ml-2 text-sm text-gray-700">${technique.name}</span>
        </div>
    `).join('');
}

function updateProgressStats() {
    const completed = window.techniquesData.filter(t => t.completed).length;
    const total = window.techniquesData.length;
    const percentage = Math.round((completed / total) * 100);

    const progressText = document.getElementById('techniques-progress');
    const progressBar = document.getElementById('techniques-bar');

    if (progressText) progressText.textContent = `${completed}/${total}`;
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.parentElement.nextElementSibling.textContent = `${percentage}% completado`;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    if (document.getElementById('vanta-bg') && window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initVantaBackground();
    }
    
    if (document.getElementById('vanta-bg') && window.location.pathname.includes('login.html')) {
        initLoginVanta();
    }

    initScrollReveal();
    initMobileMenu();
    initSmoothScroll();
    initDashboard();
    updateFavoritesList();
    updateProgressStats();
});

// Export functions for global use
window.initVantaBackground = initVantaBackground;
window.initLoginVanta = initLoginVanta;
window.openTechniqueModal = openTechniqueModal;
window.closeTechniqueModal = closeTechniqueModal;
window.toggleFavorite = toggleFavorite;
window.markAsCompleted = markAsCompleted;