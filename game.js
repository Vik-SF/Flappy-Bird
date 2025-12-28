// Game State
const game = {
    state: 'start', // 'start', 'playing', 'gameover'
    score: 0,
    distance: 0,
    time: 0,
    highScore: localStorage.getItem('flappyHighScore') || 0,
    difficulty: 1.0,
    backgroundType: 'day', // 'day', 'night', 'city'
    backgroundChangeTimer: 0,
};

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Input handling
let isFlapping = false;

// Mouse/Touch events
canvas.addEventListener('mousedown', () => {
    if (game.state === 'playing') {
        isFlapping = true;
        bird.flap();
    }
});

canvas.addEventListener('mouseup', () => {
    isFlapping = false;
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (game.state === 'playing') {
        isFlapping = true;
        bird.flap();
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isFlapping = false;
});

// Keyboard events
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && game.state === 'playing') {
        e.preventDefault();
        isFlapping = true;
        bird.flap();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        isFlapping = false;
    }
});

// Hold to flap continuously
let flapTimer = 0;

// Bird class
class Bird {
    constructor() {
        this.x = canvas.width * 0.2;
        this.y = canvas.height / 2;
        this.velocity = 0;
        this.gravity = 0.4; // Reduced from 0.5 for easier gameplay
        this.flapPower = -8; // Less powerful flap for smoother control
        this.radius = 20;
        this.rotation = 0;
        this.wingAngle = 0;
        this.animState = 'idle'; // 'idle', 'flap', 'dive', 'crash'
    }
    
    flap() {
        this.velocity = this.flapPower;
        this.animState = 'flap';
        playSound('flap');
    }
    
    update() {
        // Apply gravity
        this.velocity += this.gravity * game.difficulty;
        this.y += this.velocity;
        
        // Rotation based on velocity
        this.rotation = Math.max(-0.5, Math.min(0.5, this.velocity / 20));
        
        // Wing animation
        if (this.animState === 'flap') {
            this.wingAngle += 0.3;
            if (this.wingAngle > Math.PI) {
                this.animState = 'idle';
                this.wingAngle = 0;
            }
        } else {
            this.wingAngle = Math.sin(Date.now() * 0.01) * 0.2;
        }
        
        // Diving animation
        if (this.velocity > 5) {
            this.animState = 'dive';
        }
        
        // Boundaries
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocity = 0;
            if (game.state === 'playing') {
                gameOver();
            }
        }
        
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocity = 0;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(2, 2, this.radius, this.radius - 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius, this.radius - 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wing
        ctx.save();
        ctx.rotate(this.wingAngle);
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.ellipse(-5, 0, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Eye white
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(10, -5, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye pupil
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(12, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(25, -2);
        ctx.lineTo(25, 2);
        ctx.closePath();
        ctx.fill();
        
        // Cheek blush
        ctx.fillStyle = 'rgba(255, 150, 150, 0.4)';
        ctx.beginPath();
        ctx.arc(-5, 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    reset() {
        this.x = canvas.width * 0.2;
        this.y = canvas.height / 2;
        this.velocity = 0;
        this.rotation = 0;
        this.wingAngle = 0;
        this.animState = 'idle';
    }
}

const bird = new Bird();

// Obstacle types
class Pipe {
    constructor(x) {
        this.x = x;
        this.width = 60;
        this.gap = 200 - (game.difficulty - 1) * 5; // Bigger gap (200 instead of 150), slower difficulty increase
        this.topHeight = Math.random() * (canvas.height - this.gap - 200) + 100;
        this.speed = 1.5 * game.difficulty; // Slower speed (1.5 instead of 2)
        this.passed = false;
        this.color = '#4CAF50';
    }
    
    update() {
        this.x -= this.speed;
    }
    
    draw() {
        // Top pipe
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, 0, this.width, this.topHeight);
        
        // Top pipe cap
        ctx.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);
        ctx.strokeRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);
        
        // Bottom pipe
        const bottomY = this.topHeight + this.gap;
        ctx.fillRect(this.x, bottomY, this.width, canvas.height - bottomY);
        ctx.strokeRect(this.x, bottomY, this.width, canvas.height - bottomY);
        
        // Bottom pipe cap
        ctx.fillRect(this.x - 5, bottomY, this.width + 10, 20);
        ctx.strokeRect(this.x - 5, bottomY, this.width + 10, 20);
    }
    
    collidesWith(bird) {
        if (bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.width) {
            if (bird.y - bird.radius < this.topHeight || bird.y + bird.radius > this.topHeight + this.gap) {
                return true;
            }
        }
        return false;
    }
}

class MovingObstacle {
    constructor(x) {
        this.x = x;
        this.width = 60;
        this.height = 80; // Smaller height (80 instead of 100)
        this.y = canvas.height / 2;
        this.amplitude = 120; // Less movement range
        this.frequency = 0.015; // Slower movement
        this.time = Math.random() * 100;
        this.speed = 1.5 * game.difficulty; // Slower speed
        this.passed = false;
        this.color = '#E91E63';
    }
    
    update() {
        this.x -= this.speed;
        this.time += this.frequency;
        this.y = canvas.height / 2 + Math.sin(this.time) * this.amplitude;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);
        ctx.strokeStyle = '#C2185B';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y - this.height / 2, this.width, this.height);
    }
    
    collidesWith(bird) {
        if (bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.width) {
            if (bird.y + bird.radius > this.y - this.height / 2 && bird.y - bird.radius < this.y + this.height / 2) {
                return true;
            }
        }
        return false;
    }
}

class RotatingObstacle {
    constructor(x) {
        this.x = x;
        this.y = canvas.height / 2;
        this.radius = 80;
        this.bladeLength = 100; // Shorter blades (100 instead of 120)
        this.bladeWidth = 25; // Thinner blades
        this.angle = 0;
        this.rotationSpeed = 0.03 * game.difficulty; // Slower rotation
        this.speed = 1.5 * game.difficulty; // Slower speed
        this.passed = false;
        this.color = '#9C27B0';
    }
    
    update() {
        this.x -= this.speed;
        this.angle += this.rotationSpeed;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw 4 blades
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.rotate((Math.PI / 2) * i);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.bladeWidth / 2, 0, this.bladeWidth, this.bladeLength);
            ctx.strokeStyle = '#6A1B9A';
            ctx.lineWidth = 3;
            ctx.strokeRect(-this.bladeWidth / 2, 0, this.bladeWidth, this.bladeLength);
            ctx.restore();
        }
        
        // Center hub
        ctx.fillStyle = '#4A148C';
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    collidesWith(bird) {
        // Simple circle collision for the center
        const dx = bird.x - this.x;
        const dy = bird.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check collision with blades
        if (distance < this.bladeLength + bird.radius && distance > 20) {
            // More precise blade collision
            const angle = Math.atan2(dy, dx);
            const relativeAngle = ((angle - this.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            const bladeAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
            
            for (let bladeAngle of bladeAngles) {
                const diff = Math.abs(relativeAngle - bladeAngle);
                if (diff < 0.3 || diff > Math.PI * 2 - 0.3) {
                    return true;
                }
            }
        }
        
        return false;
    }
}

let obstacles = [];
const MIN_OBSTACLE_DISTANCE = 350; // Minimum distance between obstacles

function spawnObstacle() {
    // Check if there's enough space from the last obstacle
    if (obstacles.length > 0) {
        const lastObstacle = obstacles[obstacles.length - 1];
        if (lastObstacle.x > canvas.width - MIN_OBSTACLE_DISTANCE) {
            return; // Don't spawn yet, not enough distance
        }
    }
    
    const types = ['pipe', 'moving', 'rotating'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const x = canvas.width + 50;
    
    switch (type) {
        case 'pipe':
            obstacles.push(new Pipe(x));
            break;
        case 'moving':
            obstacles.push(new MovingObstacle(x));
            break;
        case 'rotating':
            obstacles.push(new RotatingObstacle(x));
            break;
    }
}

// Background rendering
function drawBackground() {
    const currentTime = Date.now();
    
    switch (game.backgroundType) {
        case 'day':
            // Sky gradient
            const dayGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            dayGradient.addColorStop(0, '#87CEEB');
            dayGradient.addColorStop(1, '#E0F6FF');
            ctx.fillStyle = dayGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Sun
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(canvas.width - 100, 80, 40, 0, Math.PI * 2);
            ctx.fill();
            
            // Clouds
            drawCloud(100 - (currentTime * 0.01) % canvas.width, 100);
            drawCloud(300 - (currentTime * 0.008) % canvas.width, 150);
            drawCloud(500 - (currentTime * 0.012) % canvas.width, 80);
            break;
            
        case 'night':
            // Night sky gradient
            const nightGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            nightGradient.addColorStop(0, '#0a0a2e');
            nightGradient.addColorStop(1, '#1a1a4e');
            ctx.fillStyle = nightGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Moon
            ctx.fillStyle = '#F0F0F0';
            ctx.beginPath();
            ctx.arc(canvas.width - 100, 80, 35, 0, Math.PI * 2);
            ctx.fill();
            
            // Stars
            ctx.fillStyle = 'white';
            for (let i = 0; i < 50; i++) {
                const x = (i * 137.5) % canvas.width;
                const y = (i * 217.3) % (canvas.height * 0.7);
                const size = ((i * 37) % 3) + 1;
                const twinkle = Math.sin(currentTime * 0.003 + i) * 0.5 + 0.5;
                ctx.globalAlpha = twinkle;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            break;
            
        case 'city':
            // City sky
            const cityGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            cityGradient.addColorStop(0, '#FF6B6B');
            cityGradient.addColorStop(0.5, '#FFA500');
            cityGradient.addColorStop(1, '#FFD700');
            ctx.fillStyle = cityGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // City buildings (parallax effect)
            const offset1 = (currentTime * 0.005) % 200;
            const offset2 = (currentTime * 0.008) % 200;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            for (let i = -1; i < canvas.width / 100 + 1; i++) {
                const height = ((i * 137) % 150) + 100;
                ctx.fillRect(i * 100 - offset1, canvas.height - height, 80, height);
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            for (let i = -1; i < canvas.width / 80 + 1; i++) {
                const height = ((i * 217) % 200) + 150;
                ctx.fillRect(i * 80 - offset2, canvas.height - height, 70, height);
            }
            break;
    }
}

function drawCloud(x, y) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 35, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 30, 0, Math.PI * 2);
    ctx.fill();
}

// Particles
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.life = 30;
        this.maxLife = 30;
        this.size = Math.random() * 4 + 2;
        this.color = `hsl(${Math.random() * 60 + 30}, 100%, 50%)`;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
        this.life--;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

let particles = [];

// Sound system
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let musicOscillator = null;
let musicGain = null;

function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
        case 'flap':
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
        case 'score':
            oscillator.frequency.value = 1200;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
            
        case 'hit':
            oscillator.frequency.value = 100;
            oscillator.type = 'sawtooth';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
    }
}

function startBackgroundMusic() {
    if (musicOscillator) return;
    
    musicOscillator = audioContext.createOscillator();
    musicGain = audioContext.createGain();
    
    musicOscillator.type = 'sine';
    musicOscillator.frequency.value = 220;
    musicGain.gain.value = 0.02;
    
    musicOscillator.connect(musicGain);
    musicGain.connect(audioContext.destination);
    
    musicOscillator.start();
    
    // Vary the frequency slightly for ambience
    setInterval(() => {
        if (musicOscillator) {
            const baseFreq = 220;
            const variation = Math.sin(Date.now() * 0.001) * 20;
            musicOscillator.frequency.value = baseFreq + variation;
        }
    }, 100);
}

function stopBackgroundMusic() {
    if (musicOscillator) {
        musicOscillator.stop();
        musicOscillator = null;
        musicGain = null;
    }
}

// Game functions
function startGame() {
    game.state = 'playing';
    game.score = 0;
    game.distance = 0;
    game.time = 0;
    game.difficulty = 1.0;
    game.backgroundType = 'day';
    game.backgroundChangeTimer = 0;
    
    bird.reset();
    obstacles = [];
    particles = [];
    isFlapping = false;
    flapTimer = 0;
    
    // Spawn initial obstacles with proper spacing
    for (let i = 1; i <= 3; i++) {
        spawnObstacle();
        obstacles[obstacles.length - 1].x = canvas.width + i * MIN_OBSTACLE_DISTANCE;
    }
    
    document.getElementById('start-screen').classList.remove('visible');
    startBackgroundMusic();
}

function gameOver() {
    game.state = 'gameover';
    bird.animState = 'crash';
    
    playSound('hit');
    stopBackgroundMusic();
    
    // Create explosion particles
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle(bird.x, bird.y));
    }
    
    // Update high score
    if (game.score > game.highScore) {
        game.highScore = game.score;
        localStorage.setItem('flappyHighScore', game.highScore);
    }
    
    // Show game over screen
    document.getElementById('final-score').textContent = game.score;
    document.getElementById('final-distance').textContent = game.distance + 'm';
    document.getElementById('final-time').textContent = game.time.toFixed(1) + 's';
    document.getElementById('high-score').textContent = game.highScore;
    
    setTimeout(() => {
        document.getElementById('gameover-screen').classList.add('visible');
    }, 500);
}

function updateUI() {
    document.getElementById('current-score').textContent = game.score;
    document.getElementById('distance').textContent = game.distance + 'm';
    document.getElementById('time').textContent = game.time.toFixed(1) + 's';
}

// Game loop
let lastTime = Date.now();
let spawnTimer = 0;
let timeAccumulator = 0;

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Draw background
    drawBackground();
    
    if (game.state === 'playing') {
        // Update time and distance
        timeAccumulator += deltaTime;
        if (timeAccumulator >= 0.1) {
            game.time += 0.1;
            game.distance = Math.floor(game.time * 2);
            timeAccumulator = 0;
        }
        
        // Progressive difficulty (slower increase)
        game.difficulty = 1 + game.score * 0.01; // 0.01 instead of 0.02
        
        // Change background periodically
        game.backgroundChangeTimer += deltaTime;
        if (game.backgroundChangeTimer > 20) {
            const backgrounds = ['day', 'night', 'city'];
            const currentIndex = backgrounds.indexOf(game.backgroundType);
            game.backgroundType = backgrounds[(currentIndex + 1) % backgrounds.length];
            game.backgroundChangeTimer = 0;
        }
        
        // Hold to flap
        if (isFlapping) {
            flapTimer++;
            if (flapTimer > 15) {
                bird.flap();
                flapTimer = 0;
            }
        } else {
            flapTimer = 0;
        }
        
        // Update bird
        bird.update();
        
        // Update obstacles
        obstacles.forEach(obstacle => {
            obstacle.update();
            
            // Check for score
            if (!obstacle.passed && obstacle.x + 60 < bird.x) {
                obstacle.passed = true;
                game.score++;
                playSound('score');
            }
            
            // Check collision
            if (obstacle.collidesWith(bird)) {
                gameOver();
            }
        });
        
        // Remove off-screen obstacles
        obstacles = obstacles.filter(o => o.x > -100);
        
        // Spawn new obstacles with minimum distance enforcement
        spawnTimer++;
        if (spawnTimer > 150 / game.difficulty) { // Increased from 120 to 150 for more spacing
            spawnObstacle();
            spawnTimer = 0;
        }
        
        updateUI();
    }
    
    // Draw obstacles
    obstacles.forEach(obstacle => obstacle.draw());
    
    // Update and draw particles
    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.life > 0;
    });
    
    // Draw bird
    bird.draw();
    
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.getElementById('start-btn').addEventListener('click', () => {
    startGame();
    // Resume audio context on user interaction
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});

document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('gameover-screen').classList.remove('visible');
    startGame();
});

// Start the game loop
gameLoop();

