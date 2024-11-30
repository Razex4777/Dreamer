// Create floating stars background
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random animation duration
        star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
        
        starsContainer.appendChild(star);
    }
}

// Cosmic cursor effect
function createCosmicCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cosmic-cursor';
    document.body.appendChild(cursor);

    let particles = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        cursor.appendChild(particle);
        particles.push({
            element: particle,
            x: 0,
            y: 0,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1
        });
    }

    document.addEventListener('mousemove', (e) => {
        particles.forEach((particle, index) => {
            const delay = index * 2;
            setTimeout(() => {
                particle.x = e.clientX;
                particle.y = e.clientY;
            }, delay);
        });
    });

    function updateParticles() {
        particles.forEach(particle => {
            particle.element.style.width = particle.size + 'px';
            particle.element.style.height = particle.size + 'px';
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
        });
        requestAnimationFrame(updateParticles);
    }
    updateParticles();
}

// Create cosmic rain
function createCosmicRain() {
    const container = document.createElement('div');
    container.className = 'cosmic-rain';
    document.body.appendChild(container);

    // Reduced number of raindrops from 100 to 30
    for (let i = 0; i < 30; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 2 + 2}s`; // Slightly faster animation
        drop.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(drop);
    }
}

// Create floating crystals
function createFloatingCrystals() {
    const crystalCount = 5;
    
    for (let i = 0; i < crystalCount; i++) {
        const crystal = document.createElement('div');
        crystal.className = 'crystal';
        crystal.style.left = Math.random() * 100 + 'vw';
        crystal.style.top = Math.random() * 100 + 'vh';
        crystal.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(crystal);
    }
}

// Dream portal loading animation
function showDreamPortal() {
    const portal = document.createElement('div');
    portal.className = 'dream-portal';
    document.body.appendChild(portal);
    portal.style.display = 'block';
    return portal;
}

function hideDreamPortal(portal) {
    portal.style.display = 'none';
    portal.remove();
}

// Dream Tips Data
const dreamTips = [
    {
        category: "Sleep Hygiene",
        icon: "moon",
        tips: [
            "Keep a consistent sleep schedule, even on weekends",
            "Create a relaxing bedtime routine to improve dream recall",
            "Avoid screens 1 hour before bedtime for better dream experiences",
            "Keep your bedroom cool and dark for optimal sleep",
        ]
    },
    {
        category: "Dream Recall",
        icon: "brain",
        tips: [
            "Keep a dream journal by your bed to record dreams immediately",
            "Stay still when you first wake up to better remember dreams",
            "Say your dreams out loud to strengthen memory",
            "Practice reality checks throughout the day",
        ]
    },
    {
        category: "Lucid Dreaming",
        icon: "sparkles",
        tips: [
            "Look at your hands regularly to trigger lucidity in dreams",
            "Question whether you're dreaming throughout the day",
            "Visualize your desired dream scene before sleep",
            "Practice meditation to increase dream awareness",
        ]
    },
    {
        category: "Dream Symbols",
        icon: "book-open",
        tips: [
            "Common symbols often have personal meanings unique to you",
            "Keep track of recurring symbols in your dreams",
            "Consider your current life situation when interpreting symbols",
            "Pay attention to emotions associated with dream symbols",
        ]
    }
];

// Create and manage dream tip bubbles
function createDreamTipBubble() {
    const existingBubbles = document.querySelectorAll('.dream-tip-bubble');
    if (existingBubbles.length >= 3) return; // Limit to 3 bubbles at a time

    const tipCategory = dreamTips[Math.floor(Math.random() * dreamTips.length)];
    const tip = tipCategory.tips[Math.floor(Math.random() * tipCategory.tips.length)];
    
    const bubble = document.createElement('div');
    bubble.className = 'dream-tip-bubble bubble-enter';
    
    // Position the bubble randomly (avoiding important content areas)
    const safeZones = [
        { minX: 20, maxX: window.innerWidth - 320, minY: 100, maxY: window.innerHeight - 200 }
    ];
    const safeZone = safeZones[Math.floor(Math.random() * safeZones.length)];
    const x = Math.random() * (safeZone.maxX - safeZone.minX) + safeZone.minX;
    const y = Math.random() * (safeZone.maxY - safeZone.minY) + safeZone.minY;
    
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    
    bubble.innerHTML = `
        <div class="tip-icon">
            <i data-lucide="${tipCategory.icon}" class="w-4 h-4 text-white"></i>
        </div>
        <span class="tip-category">${tipCategory.category}</span>
        <p class="tip-content">${tip}</p>
    `;
    
    document.body.appendChild(bubble);
    lucide.createIcons(); // Initialize the new icon
    
    // Animation
    requestAnimationFrame(() => {
        bubble.classList.remove('bubble-enter');
        bubble.classList.add('bubble-enter-active');
    });
    
    // Remove bubble after delay or on click
    const removeBubble = () => {
        bubble.classList.add('bubble-exit');
        setTimeout(() => {
            bubble.classList.add('bubble-exit-active');
            setTimeout(() => bubble.remove(), 500);
        }, 50);
    };
    
    bubble.addEventListener('click', removeBubble);
    setTimeout(removeBubble, 10000); // Remove after 10 seconds
}

// Initialize dream tips
function initDreamTips() {
    // Create initial tip
    setTimeout(createDreamTipBubble, 2000);
    
    // Create new tips periodically
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to create a new tip
            createDreamTipBubble();
        }
    }, 8000);
}

// Create aurora and nebula effects
function createCosmicEffects() {
    // Create aurora container
    const auroraContainer = document.createElement('div');
    auroraContainer.className = 'aurora-container';
    const aurora = document.createElement('div');
    aurora.className = 'aurora';
    auroraContainer.appendChild(aurora);
    document.body.appendChild(auroraContainer);

    // Create nebula effect
    const nebula = document.createElement('div');
    nebula.className = 'nebula';
    document.body.appendChild(nebula);
}

// Create constellation patterns
function createConstellations() {
    const container = document.createElement('div');
    container.className = 'parallax-stars';
    document.body.appendChild(container);

    // Create constellation points
    const constellationPoints = [
        { x: 20, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 30 },
        { x: 80, y: 60 }, { x: 70, y: 70 }, { x: 90, y: 50 }
    ];

    constellationPoints.forEach(point => {
        const star = document.createElement('div');
        star.className = 'constellation';
        star.style.left = `${point.x}%`;
        star.style.top = `${point.y}%`;
        container.appendChild(star);
    });
}

// Create parallax star effect
function createParallaxStars() {
    const layers = 3;
    const starsPerLayer = 50;

    for (let layer = 1; layer <= layers; layer++) {
        const container = document.createElement('div');
        container.className = 'parallax-stars';
        
        for (let i = 0; i < starsPerLayer; i++) {
            const star = document.createElement('div');
            star.className = `parallax-star layer-${layer}`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = star.style.width;
            container.appendChild(star);
        }
        
        document.body.appendChild(container);
    }
}

// Create floating zodiac symbols
function createZodiacSymbols() {
    const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const container = document.body;

    zodiacSymbols.forEach(symbol => {
        const zodiac = document.createElement('div');
        zodiac.className = 'zodiac-symbol';
        zodiac.textContent = symbol;
        zodiac.style.left = `${Math.random() * 90 + 5}%`;
        zodiac.style.top = `${Math.random() * 90 + 5}%`;
        zodiac.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(zodiac);
    });
}

// Add stardust text effect
function addStardustEffect(element) {
    element.classList.add('stardust-text');
}

// Handle page transitions
function handlePageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);

    setTimeout(() => {
        transition.remove();
    }, 1000);
}

// Interactive Dream Scene Elements
function createInteractiveDreamScene() {
    // Create floating clouds with dream symbols
    createFloatingClouds();
    // Add star trail effect
    addStarTrailEffect();
    // Initialize shooting stars
    initShootingStars();
    // Add moon phase
    createMoonPhase();
}

// Floating clouds with dream symbols
function createFloatingClouds() {
    const dreamSymbols = ['🌙', '⭐', '🔮', '🦋', '🌺', '🕊️', '💫', '🌈'];
    const container = document.createElement('div');
    container.className = 'floating-clouds-container';
    
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'floating-cloud';
        cloud.style.left = `${Math.random() * 90}%`;
        cloud.style.top = `${Math.random() * 70}%`;
        cloud.style.animationDelay = `${Math.random() * 10}s`;
        
        cloud.addEventListener('click', () => {
            const symbol = dreamSymbols[Math.floor(Math.random() * dreamSymbols.length)];
            const symbolElement = document.createElement('div');
            symbolElement.className = 'dream-symbol';
            symbolElement.textContent = symbol;
            symbolElement.style.left = cloud.style.left;
            symbolElement.style.top = cloud.style.top;
            container.appendChild(symbolElement);
            
            setTimeout(() => symbolElement.remove(), 3000);
        });
        
        container.appendChild(cloud);
    }
    
    document.body.appendChild(container);
}

// Star trail effect
function addStarTrailEffect() {
    const trail = document.createElement('canvas');
    trail.className = 'star-trail';
    document.body.appendChild(trail);
    
    const ctx = trail.getContext('2d');
    let points = [];
    
    document.addEventListener('mousemove', (e) => {
        points.push({ x: e.clientX, y: e.clientY, age: 0 });
        if (points.length > 50) points.shift();
        
        ctx.clearRect(0, 0, trail.width, trail.height);
        ctx.beginPath();
        points.forEach((point, i) => {
            ctx.lineTo(point.x, point.y);
            point.age++;
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
        
        points = points.filter(point => point.age < 50);
    });
}

// Shooting stars
function initShootingStars() {
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            createShootingStar();
        }
    }, 5000);
}

function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = '0';
    document.body.appendChild(star);
    
    setTimeout(() => star.remove(), 1000);
}

// Moon phase
function createMoonPhase() {
    const moon = document.createElement('div');
    moon.className = 'moon';
    document.body.appendChild(moon);
    
    updateMoonPhase();
    setInterval(updateMoonPhase, 60000); // Update every minute
}

function updateMoonPhase() {
    const moon = document.querySelector('.moon');
    if (!moon) return;
    
    const hour = new Date().getHours();
    let phase = 'full';
    
    if (hour >= 6 && hour < 12) phase = 'waning';
    else if (hour >= 12 && hour < 18) phase = 'new';
    else if (hour >= 18 && hour < 24) phase = 'waxing';
    
    moon.className = `moon moon-${phase}`;
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createCosmicCursor();
    createCosmicRain();
    createFloatingCrystals();
    initDreamTips();
    createCosmicEffects();
    createConstellations();
    createParallaxStars();
    createZodiacSymbols();
    createInteractiveDreamScene(); // Add new interactive elements
    
    // Add stardust effect to headings
    document.querySelectorAll('h1, h2, h3').forEach(addStardustEffect);
    
    // Initialize Lucide icons
    lucide.createIcons();

    // Add glow effect to important elements
    document.querySelectorAll('.nav-button, .cta-button, .feature-card').forEach(element => {
        element.classList.add('glow-effect');
    });

    // Add page transition effect
    handlePageTransition();
});

// Handle parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.parallax-stars').forEach((layer, index) => {
        const speed = (index + 1) * 0.5;
        layer.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Dream form submission
const dreamForm = document.getElementById('dream-form');
if (dreamForm) {
    dreamForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const portal = showDreamPortal();
        const interpretationDiv = document.getElementById('interpretation');
        
        try {
            const formData = new FormData(dreamForm);
            const dreamContent = formData.get('dream_content');
            
            // Validate form data
            if (!dreamContent) {
                throw new Error('Please share your dream before interpretation');
            }
            
            // Rename the field for the backend
            formData.delete('dream_content');
            formData.append('dream_description', dreamContent);
            
            const response = await fetch('/interpret_dream', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to interpret dream');
            }
            
            interpretationDiv.style.opacity = '0';
            interpretationDiv.innerHTML = `
                <div class="bg-opacity-10 bg-white backdrop-blur-lg rounded-lg p-6 shadow-lg border border-opacity-20 border-white glow-effect">
                    <h3 class="text-2xl font-semibold mb-4 text-blue-300">✨ Dream Interpretation</h3>
                    <p class="text-white">${result.interpretation}</p>
                </div>
            `;
            
            setTimeout(() => {
                interpretationDiv.style.transition = 'opacity 0.5s ease-in-out';
                interpretationDiv.style.opacity = '1';
            }, 100);
            
        } catch (error) {
            console.error('Error:', error);
            
            // Show error message in the interpretation div
            interpretationDiv.style.opacity = '0';
            interpretationDiv.innerHTML = `
                <div class="bg-opacity-10 bg-red-900 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-opacity-20 border-red-500 glow-effect">
                    <h3 class="text-2xl font-semibold mb-4 text-red-300">❌ Error</h3>
                    <p class="text-white">${error.message}</p>
                    <p class="text-gray-300 mt-2">Please try again. If the problem persists, check your internet connection or try refreshing the page.</p>
                </div>
            `;
            
            setTimeout(() => {
                interpretationDiv.style.transition = 'opacity 0.5s ease-in-out';
                interpretationDiv.style.opacity = '1';
            }, 100);
            
        } finally {
            hideDreamPortal(portal);
        }
    });
}
