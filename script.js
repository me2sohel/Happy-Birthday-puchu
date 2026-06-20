// Confetti Animation
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.vx = Math.random() * 8 - 4;
        this.vy = Math.random() * 5 + 5;
        this.size = Math.random() * 5 + 2;
        this.color = this.randomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    randomColor() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4ecdc4', '#ffe66d', '#95e1d3'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    isDead() {
        return this.y > canvas.height;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    if (particles.length > 0) {
        requestAnimationFrame(animate);
    }
}

function triggerConfetti() {
    // Create burst of confetti
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    // Play celebration sound
    playSound();

    // Start animation
    animate();

    // Add shake effect
    addShakeEffect();

    // Show celebration message
    showCelebrationMessage();
}

function playSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch(e) {
        console.log('Audio context not available');
    }
}

function addShakeEffect() {
    const container = document.querySelector('.container');
    container.style.animation = 'none';
    setTimeout(() => {
        container.style.animation = 'shake 0.5s ease';
    }, 10);
}

function showCelebrationMessage() {
    const messages = [
        '🎉 That\'s amazing! 🎉',
        '✨ You\'re awesome! ✨',
        '🌟 Happy Birthday! 🌟',
        '💫 Make a wish! 💫',
        '🎊 Let\'s celebrate! 🎊'
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const msgElement = document.createElement('div');
    msgElement.textContent = randomMsg;
    msgElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        animation: popUp 1s ease forwards;
        z-index: 100;
        pointer-events: none;
    `;

    document.body.appendChild(msgElement);
    setTimeout(() => msgElement.remove(), 1500);
}

// Add CSS animation for shake effect
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }

    @keyframes popUp {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -150px) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Easter egg: Click on the cake multiple times
let cakeClickCount = 0;
const cake = document.querySelector('.cake');
if (cake) {
    cake.addEventListener('click', () => {
        cakeClickCount++;
        if (cakeClickCount >= 3) {
            triggerConfetti();
            cakeClickCount = 0;
        }
    });
}

// Auto-trigger confetti on page load after delay
window.addEventListener('load', () => {
    setTimeout(() => {
        triggerConfetti();
    }, 1500);
});
