// 🎮 Sweet Dream Garden - Magical Love Game
// 3 Levels of Heart-Melting Romance

// ===== GAME CONFIGURATION =====
const gameConfig = {
    levels: [
        {
            id: 1,
            name: "Garden of First Blossoms",
            heartsRequired: 8,
            description: "Find 8 magical hearts to reveal sweet memories of our beginning",
            message: "The first time our eyes met, my world changed forever. That moment replays in my mind like a beautiful melody I never want to forget. Your smile became my favorite sight, your laughter my favorite sound. Every beat of my heart since then has spelled out your name.",
            color: "#ff9ec0",
            icon: "🌸"
        },
        {
            id: 2,
            name: "Moonlight Garden",
            heartsRequired: 10,
            description: "Discover 10 hearts under the moonlight to unlock deeper connections",
            message: "As we grew closer, every conversation felt like uncovering hidden treasures. The way you understand me without words, the comfort in your presence, the safety in your arms. You became my sanctuary, my peace in chaos, my calm in the storm. Loving you feels like coming home.",
            color: "#a29bfe",
            icon: "🌙"
        },
        {
            id: 3,
            name: "Eternal Bloom",
            heartsRequired: 12,
            description: "Collect 12 eternal hearts to reveal promises of forever",
            message: "My love for you isn't temporary—it's eternal. Like a garden that blooms forever, my heart will always beat for you. Through all seasons of life, through sunshine and rain, my commitment to you grows stronger. You're not just my love story; you're my forever. I choose you, today and every tomorrow.",
            color: "#ff6b9d",
            icon: "🌹"
        }
    ],
    heartEmojis: ["💖", "💕", "💗", "💓", "💞", "💝", "💘", "💌", "💟", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍"],
    flowerEmojis: ["🌸", "🌷", "🌹", "🌺", "🌻", "🌼", "💐", "🪷", "🥀", "🌱", "🌿", "☘️", "🍀", "🎍", "🪴", "🌾", "💮", "🏵️"],
    sparkleEmojis: ["✨", "⭐", "🌟", "💫", "🌠", "🎇", "🎆", "🪄", "🔮", "💎", "💍", "💎", "🔱", "🌌"]
};

// ===== GAME STATE =====
let gameState = {
    currentLevel: 0,
    heartsCollected: 0,
    totalHearts: 0,
    score: 0,
    gameStarted: false,
    gameCompleted: false,
    startTime: null,
    timerInterval: null,
    hearts: [],
    floatingHearts: [],
    isFirstPlay: true
};

// ===== DOM ELEMENTS =====
const elements = {
    heartsCounter: document.getElementById('heartsCounter'),
    currentLevel: document.getElementById('currentLevel'),
    timer: document.getElementById('timer'),
    score: document.getElementById('score'),
    levelTitle: document.getElementById('levelTitle'),
    levelDescription: document.getElementById('levelDescription'),
    levelProgress: document.getElementById('levelProgress'),
    progressPercent: document.getElementById('progressPercent'),
    heartContainer: document.getElementById('heartContainer'),
    startButton: document.getElementById('startButton'),
    loveMessage: document.getElementById('loveMessage'),
    messageText: document.getElementById('messageText'),
    messageDate: document.getElementById('messageDate'),
    msgHearts: document.getElementById('msgHearts'),
    msgTime: document.getElementById('msgTime'),
    dynamicQuote: document.getElementById('dynamicQuote')
};

// ===== ROMANTIC QUOTES =====
const romanticQuotes = [
    "Your love is the sweetest dream I never want to wake up from",
    "In your eyes, I found my forever home",
    "Every beat of my heart whispers your name",
    "You are the missing piece I searched for my whole life",
    "Our love story is my favorite fairytale",
    "With you, every moment feels like magic",
    "You planted love in my heart and it grew into a garden",
    "I fall for you more with every sunrise",
    "Your love colors my world in the most beautiful hues",
    "You're the dream I never knew I had"
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 Sweet Dream Garden Initialized');
    
    // Set today's date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.messageDate.textContent = today.toLocaleDateString('en-US', options);
    
    // Load first level
    loadLevel(0);
    
    // Initialize animations
    createFloatingHearts();
    updateRomanticQuote();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update achievements
    updateAchievements();
});

// ===== LEVEL MANAGEMENT =====
function loadLevel(levelIndex) {
    if (levelIndex >= gameConfig.levels.length) {
        completeGame();
        return;
    }
    
    const level = gameConfig.levels[levelIndex];
    gameState.currentLevel = levelIndex;
    gameState.heartsCollected = 0;
    gameState.totalHearts = level.heartsRequired;
    gameState.gameStarted = false;
    
    // Update UI
    elements.levelTitle.textContent = level.name;
    elements.levelDescription.textContent = level.description;
    elements.currentLevel.textContent = level.id;
    elements.heartsCounter.textContent = '0';
    elements.progressPercent.textContent = '0%';
    elements.levelProgress.style.width = '0%';
    
    // Update level tabs
    updateLevelTabs(levelIndex);
    
    // Update colors
    document.documentElement.style.setProperty('--primary-color', level.color);
    
    // Clear heart container
    elements.heartContainer.innerHTML = '';
    elements.heartContainer.className = 'heart-garden';
    
    // Create welcome screen
    const welcomeHTML = `
        <div class="welcome-blossom">
            <div class="blossom-animation">
                ${[1,2,3,4].map(i => `<div class="petal p${i}"></div>`).join('')}
                <div class="blossom-center">${level.icon}</div>
            </div>
            <h3>Level ${level.id}: ${level.name}</h3>
            <p>${level.description}</p>
            <div class="welcome-stats">
                <div class="welcome-stat">
                    <span class="stat-icon">💖</span>
                    <span>Find ${level.heartsRequired} hearts</span>
                </div>
                <div class="welcome-stat">
                    <span class="stat-icon">✨</span>
                    <span>Unlock a secret love message</span>
                </div>
            </div>
        </div>
    `;
    
    elements.heartContainer.innerHTML = welcomeHTML;
    
    // Animate petals
    animatePetals();
    
    // Update start button
    elements.startButton.innerHTML = `
        <span class="button-sparkle">✨</span>
        <i class="fas fa-heart-circle-bolt"></i>
        Start Level ${level.id}
        <span class="button-sparkle">✨</span>
    `;
    
    // Hide love message
    elements.loveMessage.style.display = 'none';
    
    console.log(`Level ${level.id} loaded: ${level.name}`);
}

function updateLevelTabs(activeIndex) {
    const tabs = document.querySelectorAll('.level-tab');
    tabs.forEach((tab, index) => {
        if (index === activeIndex) {
            tab.classList.add('active');
            tab.style.opacity = '1';
        } else {
            tab.classList.remove('active');
            tab.style.opacity = index < activeIndex ? '0.8' : '0.5';
        }
    });
}

// ===== GAME FUNCTIONS =====
function startGame() {
    if (gameState.gameStarted) return;
    
    gameState.gameStarted = true;
    gameState.startTime = new Date();
    gameState.hearts = [];
    
    // Update button
    elements.startButton.innerHTML = `
        <span class="button-sparkle">✨</span>
        <i class="fas fa-heart-circle-check"></i>
        Level ${gameState.currentLevel + 1} Started!
        <span class="button-sparkle">✨</span>
    `;
    elements.startButton.style.background = `linear-gradient(135deg, #4CAF50, #2E7D32)`;
    
    // Clear heart container
    elements.heartContainer.innerHTML = '';
    elements.heartContainer.style.minHeight = '400px';
    
    // Create hearts
    createHearts();
    
    // Start timer
    startTimer();
    
    // Play magical sound
    playMagicalSound('start');
    
    console.log(`Game started - Level ${gameState.currentLevel + 1}`);
}

function createHearts() {
    const level = gameConfig.levels[gameState.currentLevel];
    const container = elements.heartContainer;
    
    // Calculate positions
    const positions = generateHeartPositions(level.heartsRequired);
    
    // Create hearts
    for (let i = 0; i < level.heartsRequired; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'magic-heart';
            heart.dataset.index = i;
            
            // Random heart emoji
            const heartEmoji = gameConfig.heartEmojis[Math.floor(Math.random() * gameConfig.heartEmojis.length)];
            heart.innerHTML = heartEmoji;
            
            // Position
            heart.style.left = `${positions[i].x}%`;
            heart.style.top = `${positions[i].y}%`;
            
            // Random size
            const size = 40 + Math.random() * 30;
            heart.style.fontSize = `${size}px`;
            
            // Animation
            heart.style.animation = `heartFloat ${3 + Math.random() * 2}s ease-in-out infinite, heartGlow 2s ease-in-out infinite`;
            heart.style.animationDelay = `${i * 0.2}s`;
            
            // Click event
            heart.addEventListener('click', () => collectHeart(i, heart));
            
            // Hover effect
            heart.addEventListener('mouseenter', () => {
                heart.style.transform = 'scale(1.3)';
                heart.style.filter = 'drop-shadow(0 0 15px rgba(255, 107, 157, 0.8))';
            });
            
            heart.addEventListener('mouseleave', () => {
                heart.style.transform = 'scale(1)';
                heart.style.filter = 'drop-shadow(0 0 5px rgba(255, 107, 157, 0.3))';
            });
            
            container.appendChild(heart);
            
            // Store reference
            gameState.hearts.push({
                element: heart,
                collected: false,
                index: i
            });
            
            // Entrance animation
            setTimeout(() => {
                heart.style.opacity = '1';
                heart.style.transform = 'scale(1)';
            }, 50);
            
        }, i * 150);
    }
}

function generateHeartPositions(count) {
    const positions = [];
    const padding = 15; // Keep away from edges
    
    for (let i = 0; i < count; i++) {
        let attempts = 0;
        let position;
        let valid = false;
        
        while (!valid && attempts < 100) {
            position = {
                x: padding + Math.random() * (100 - 2 * padding),
                y: padding + Math.random() * (100 - 2 * padding)
            };
            
            // Check distance from other positions
            valid = positions.every(pos => {
                const dx = pos.x - position.x;
                const dy = pos.y - position.y;
                return Math.sqrt(dx * dx + dy * dy) > 15; // Minimum distance
            });
            
            attempts++;
        }
        
        positions.push(position);
    }
    
    return positions;
}

function collectHeart(index, heartElement) {
    if (!gameState.gameStarted || gameState.hearts[index].collected) return;
    
    gameState.hearts[index].collected = true;
    gameState.heartsCollected++;
    gameState.score += 100;
    
    // Update UI
    updateGameUI();
    
    // Animate collection
    animateHeartCollection(heartElement);
    
    // Play sound
    playMagicalSound('heart');
    
    // Check level completion
    if (gameState.heartsCollected >= gameState.totalHearts) {
        completeLevel();
    }
}

function animateHeartCollection(heart) {
    // Create sparkle effect
    const sparkles = document.createElement('div');
    sparkles.style.cssText = `
        position: absolute;
        left: ${heart.offsetLeft + heart.offsetWidth / 2}px;
        top: ${heart.offsetTop + heart.offsetHeight / 2}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    // Add multiple sparkles
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('span');
        sparkle.textContent = gameConfig.sparkleEmojis[Math.floor(Math.random() * gameConfig.sparkleEmojis.length)];
        sparkle.style.cssText = `
            position: absolute;
            animation: sparkleOut 1s ease-out forwards;
            opacity: 0;
        `;
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        
        sparkle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        sparkles.appendChild(sparkle);
    }
    
    elements.heartContainer.appendChild(sparkles);
    
    // Animate heart
    heart.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.5)', opacity: 0.5 },
        { transform: 'scale(0)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    }).onfinish = () => {
        heart.remove();
        setTimeout(() => sparkles.remove(), 1000);
    };
}

function completeLevel() {
    gameState.gameStarted = false;
    
    // Stop timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    const level = gameConfig.levels[gameState.currentLevel];
    const endTime = new Date();
    const totalSeconds = Math.floor((endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    
    // Update message
    elements.messageText.textContent = level.message;
    elements.msgHearts.textContent = gameState.heartsCollected;
    elements.msgTime.textContent = `${minutes}:${seconds}`;
    
    // Show love message with animation
    elements.loveMessage.style.display = 'block';
    elements.loveMessage.animate([
        { opacity: 0, transform: 'translateY(50px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    });
    
    // Create celebration
    createCelebration();
    
    // Update button for next level
    const nextLevel = gameState.currentLevel + 1;
    if (nextLevel < gameConfig.levels.length) {
        setTimeout(() => {
            elements.startButton.innerHTML = `
                <span class="button-sparkle">✨</span>
                <i class="fas fa-arrow-right"></i>
                Continue to Level ${nextLevel + 1}
                <span class="button-sparkle">✨</span>
            `;
            elements.startButton.style.background = `linear-gradient(135deg, #2196F3, #1976D2)`;
            elements.startButton.onclick = () => loadLevel(nextLevel);
        }, 2000);
    } else {
        setTimeout(() => {
            elements.startButton.innerHTML = `
                <span class="button-sparkle">✨</span>
                <i class="fas fa-crown"></i>
                Complete Game - Play Again
                <span class="button-sparkle">✨</span>
            `;
            elements.startButton.style.background = `linear-gradient(135deg, #FFD700, #FFA500)`;
            elements.startButton.onclick = resetGame;
        }, 2000);
    }
    
    // Update achievements
    updateAchievements();
    
    console.log(`Level ${gameState.currentLevel + 1} completed!`);
}

function completeGame() {
    gameState.gameCompleted = true;
    
    // Show final celebration
    createFinalCelebration();
    
    // Update romantic quote
    elements.dynamicQuote.textContent = "Our love story continues forever...";
    
    console.log('🎉 Game Completed!');
}

// ===== UI UPDATES =====
function updateGameUI() {
    const percentage = (gameState.heartsCollected / gameState.totalHearts) * 100;
    const rounded = Math.round(percentage);
    
    // Update counters
    elements.heartsCounter.textContent = gameState.heartsCollected;
    elements.score.textContent = gameState.score;
    elements.progressPercent.textContent = `${rounded}%`;
    
    // Update progress bar with smooth animation
    elements.levelProgress.style.width = `${percentage}%`;
    
    // Color change based on progress
    if (percentage >= 100) {
        elements.levelProgress.style.background = 'linear-gradient(90deg, #4CAF50, #2E7D32)';
    } else if (percentage >= 50) {
        elements.levelProgress.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
    }
}

function startTimer() {
    // Clear existing timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Update every second
    gameState.timerInterval = setInterval(() => {
        if (!gameState.startTime) return;
        
        const now = new Date();
        const diff = Math.floor((now - gameState.startTime) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        
        elements.timer.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function updateAchievements() {
    const achievements = document.querySelectorAll('.achievement');
    
    achievements.forEach((achievement, index) => {
        let achieved = false;
        
        switch(index) {
            case 0: // First Bloom
                achieved = gameState.heartsCollected > 0;
                break;
            case 1: // Rose Garden
                achieved = gameState.currentLevel >= 1;
                break;
            case 2: // Starlight Love
                achieved = gameState.currentLevel >= 2;
                break;
        }
        
        achievement.dataset.achieved = achieved;
        
        if (achieved) {
            achievement.style.opacity = '1';
            achievement.style.transform = 'translateY(-2px)';
        }
    });
}

function updateRomanticQuote() {
    // Change quote every 10 seconds
    setInterval(() => {
        const randomQuote = romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];
        elements.dynamicQuote.textContent = randomQuote;
        
        // Fade animation
        elements.dynamicQuote.style.opacity = '0';
        setTimeout(() => {
            elements.dynamicQuote.style.opacity = '1';
            elements.dynamicQuote.style.transition = 'opacity 0.5s ease';
        }, 300);
    }, 10000);
}

// ===== VISUAL EFFECTS =====
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    
    // Create 20 floating hearts
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = gameConfig.heartEmojis[Math.floor(Math.random() * gameConfig.heartEmojis.length)];
        
        heart.style.cssText = `
            position: absolute;
            font-size: ${20 + Math.random() * 30}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${0.2 + Math.random() * 0.3};
            pointer-events: none;
            z-index: 0;
            animation: floatHeart ${10 + Math.random() * 20}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        container.appendChild(heart);
        gameState.floatingHearts.push(heart);
    }
    
    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatHeart {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.3;
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, -50px) rotate(90deg);
                opacity: 0.5;
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, -100px) rotate(180deg);
                opacity: 0.7;
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, -150px) rotate(270deg);
                opacity: 0.5;
            }
            100% {
                transform: translate(0, -200px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function animatePetals() {
    const petals = document.querySelectorAll('.petal');
    
    petals.forEach((petal, i) => {
        petal.animate([
            { transform: 'rotate(0deg) scale(1)' },
            { transform: `rotate(${90 * (i + 1)}deg) scale(1.1)` },
            { transform: 'rotate(0deg) scale(1)' }
        ], {
            duration: 3000 + i * 500,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    });
}

function createCelebration() {
    const container = elements.heartContainer;
    
    // Create flower shower
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.innerHTML = gameConfig.flowerEmojis[Math.floor(Math.random() * gameConfig.flowerEmojis.length)];
            
            flower.style.cssText = `
                position: absolute;
                font-size: ${25 + Math.random() * 20}px;
                left: ${Math.random() * 100}%;
                top: -50px;
                z-index: 100;
                animation: flowerFall ${2 + Math.random() * 2}s linear forwards;
                opacity: 0.9;
            `;
            
            container.appendChild(flower);
            
            // Remove after animation
            setTimeout(() => flower.remove(), 3000);
        }, i * 100);
    }
    
    // Add flower fall animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flowerFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.9;
            }
            100% {
                transform: translateY(500px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function createFinalCelebration() {
    // Create massive celebration
    const container = elements.heartContainer;
    
    // Clear container
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.flexDirection = 'column';
    
    const celebrationHTML = `
        <div class="final-celebration">
            <div class="celebration-heart">💖</div>
            <h2>Congratulations!</h2>
            <p class="celebration-text">You've completed our love journey!</p>
            <div class="final-message">
                <p>Every heart you collected represents a beautiful moment in our story.</p>
                <p>Thank you for being my everything.</p>
                <div class="eternal-love">💝 Forever Yours 💝</div>
            </div>
            <div class="final-sparkles">
                ${gameConfig.sparkleEmojis.slice(0, 5).map(e => `<span>${e}</span>`).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = celebrationHTML;
    
    // Animate celebration
    const heart = container.querySelector('.celebration-heart');
    heart.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.5)' },
        { transform: 'scale(1)' }
    ], {
        duration: 2000,
        iterations: Infinity
    });
}

// ===== AUDIO =====
function playMagicalSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (type === 'heart') {
            // Sweet bell sound for heart collection
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
            
        } else if (type === 'start') {
            // Magical sparkle sound
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator1.frequency.setValueAtTime(329.63, audioContext.currentTime); // E4
            oscillator2.frequency.setValueAtTime(440.00, audioContext.currentTime); // A4
            
            oscillator1.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.5); // E5
            oscillator2.frequency.exponentialRampToValueAtTime(880.00, audioContext.currentTime + 0.5); // A5
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
            
            oscillator1.start();
            oscillator2.start();
            oscillator1.stop(audioContext.currentTime + 1);
            oscillator2.stop(audioContext.currentTime + 1);
        }
    } catch (e) {
        // Audio context not supported - silent fail
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Start button
    elements.startButton.addEventListener('click', startGame);
    
    // Level tabs
    document.querySelectorAll('.level-tab').forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (index <= gameState.currentLevel) {
                loadLevel(index);
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            if (!gameState.gameStarted && !gameState.gameCompleted) {
                startGame();
            }
        }
    });
}

// ===== GAME RESET =====
function resetGame() {
    gameState = {
        currentLevel: 0,
        heartsCollected: 0,
        totalHearts: 0,
        score: 0,
        gameStarted: false,
        gameCompleted: false,
        startTime: null,
        timerInterval: null,
        hearts: [],
        floatingHearts: gameState.floatingHearts,
        isFirstPlay: false
    };
    
    // Reset timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    elements.timer.textContent = '00:00';
    elements.score.textContent = '0';
    elements.loveMessage.style.display = 'none';
    
    // Load first level
    loadLevel(0);
    
    console.log('Game reset - ready to play again!');
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameConfig,
        gameState,
        startGame,
        collectHeart,
        resetGame
    };
}

console.log('💖 Sweet Dream Garden Game Loaded Successfully!');
