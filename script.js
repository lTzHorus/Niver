// Web Audio API context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Elementos de áudio - CORREÇÃO AQUI: backgroundMusic (não background_music)
const backgroundMusic = document.getElementById('backgroundMusic');
const clickSound = document.getElementById('clickSound');

let isPlaying = false;
let isMuted = true; // Começa mudo

const audioControl = document.getElementById('audioControl');

// Inicializar áudio no primeiro clique
document.body.addEventListener('click', initAudio, { once: true });
audioControl.addEventListener('click', toggleAudio);

function initAudio() {
    if (!isPlaying && isMuted) {
        playBackgroundMusic();
        isPlaying = true;
    }
}

function playBackgroundMusic() {
    try {
        backgroundMusic.volume = isMuted ? 0 : 0.5;
        backgroundMusic.play().catch(error => {
            console.log('Erro ao reproduzir música:', error);
        });
    } catch (error) {
        console.log('Erro no áudio:', error);
    }
}

function toggleAudio() {
    isMuted = !isMuted;
    
    if (backgroundMusic) {
        backgroundMusic.volume = isMuted ? 0 : 0.5;
    }

    // Atualizar ícone do botão
    if (isMuted) {
        audioControl.classList.add('muted');
    } else {
        audioControl.classList.remove('muted');
    }
    
    // Reproduzir som de clique
    playClickSound();
}

function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.volume = isMuted ? 0 : 0.7;
        clickSound.play().catch(error => {
            console.log('Erro ao reproduzir som de clique:', error);
        });
    }
}

// Função para criar estrelas
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starsCount = 150;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// Efeito de partículas no botão RSVP
function createParticles(event) {
    playClickSound();

    const rsvpButton = event.currentTarget;
    const buttonRect = rsvpButton.getBoundingClientRect();
    const numberOfParticles = 10;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        const x = buttonRect.left + buttonRect.width / 2 + (Math.random() - 0.5) * 20;
        const y = buttonRect.top + buttonRect.height / 2 + (Math.random() - 0.5) * 20;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 30;
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance - 50;

        particle.style.setProperty('--tx', `${translateX}px`);
        particle.style.setProperty('--ty', `${translateY}px`);
        particle.style.animation = `particleAnimate 1s forwards ease-out`;

        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

// Adicionar keyframes para animação de partículas
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes particleAnimate {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0.5);
        }
    }
`;
document.head.appendChild(styleSheet);

// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    document.querySelector('.rsvp-button').addEventListener('click', createParticles);
    audioControl.classList.add('muted');
});