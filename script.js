// Configurações do sistema
const CONFIG = {
    USERNAME: 'ErikSlava',
    PASSWORD: 'Erik2008',
    WEBHOOK_URL: 'https://discord.com/api/webhooks/1429236562134302781/9aDDtdDEO18AtU_Z7s08oRx9vjwhaez9shQWO6P3Ycf0ljNPM5iEitEd1f_8p8Opj-o2',
    TRANSITION_IMAGE: 'https://cdn.discordapp.com/attachments/1415484714130739290/1446225200982130759/20251129_132749.jpg?ex=693335ad&is=6931e42d&hm=5f845fcac10fc24a5b975d1c5cb27fbf10a70744ff75b1cf153e2dfe104039c5',
    MAX_PASSWORD_ATTEMPTS: 3,
    MAX_CODE_ATTEMPTS: 5,
    BAN_TIME_MINUTES: 5
};

// Estado do sistema
let state = {
    currentForm: 'login',
    passwordAttempts: CONFIG.MAX_PASSWORD_ATTEMPTS,
    codeAttempts: CONFIG.MAX_CODE_ATTEMPTS,
    isBanned: false,
    banEndTime: null,
    userIP: null,
    verificationCode: null
};

// Elementos DOM
const elements = {
    loginForm: null,
    verificationForm: null,
    bannedMessage: null,
    usernameInput: null,
    passwordInput: null,
    codeInput: null,
    loginBtn: null,
    verifyBtn: null,
    backBtn: null,
    usernameError: null,
    passwordError: null,
    codeError: null,
    attemptsRemaining: null,
    codeAttemptsRemaining: null,
    banTime: null,
    bannedIp: null,
    transitionScreen: null,
    transitionImage: null,
    currentYear: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada, inicializando...');
    init();
});

function init() {
    initializeElements();
    
    if (elements.currentYear) {
        elements.currentYear.textContent = new Date().getFullYear();
    }
    
    if (elements.transitionImage) {
        elements.transitionImage.src = CONFIG.TRANSITION_IMAGE;
    }
    
    setupEventListeners();
    checkIfBanned();
    getUserIP();
    addVisualEffects();
    
    console.log('Sistema inicializado com sucesso!');
    console.log('Elementos carregados:', Object.keys(elements).filter(key => elements[key] !== null).length, 'de', Object.keys(elements).length);
}

function initializeElements() {
    // Usar querySelector para garantir que encontramos os elementos
    elements.loginForm = document.getElementById('login-form');
    elements.verificationForm = document.getElementById('verification-form');
    elements.bannedMessage = document.getElementById('banned-message');
    elements.usernameInput = document.getElementById('username');
    elements.passwordInput = document.getElementById('password');
    elements.codeInput = document.getElementById('verification-code');
    elements.loginBtn = document.getElementById('login-btn');
    elements.verifyBtn = document.getElementById('verify-btn');
    elements.backBtn = document.getElementById('back-btn');
    elements.usernameError = document.getElementById('username-error');
    elements.passwordError = document.getElementById('password-error');
    elements.codeError = document.getElementById('code-error');
    elements.attemptsRemaining = document.getElementById('attempts-remaining');
    elements.codeAttemptsRemaining = document.getElementById('code-attempts-remaining');
    elements.banTime = document.getElementById('ban-time');
    elements.bannedIp = document.getElementById('banned-ip');
    elements.transitionScreen = document.getElementById('transition-screen');
    elements.transitionImage = document.getElementById('transition-image');
    elements.currentYear = document.getElementById('current-year');
    
    console.log('Elementos inicializados:', {
        loginBtn: !!elements.loginBtn,
        verifyBtn: !!elements.verifyBtn,
        loginForm: !!elements.loginForm
    });
}

function setupEventListeners() {
    if (elements.loginBtn) {
        console.log('Adicionando evento ao botão de login');
        elements.loginBtn.addEventListener('click', handleLogin);
    } else {
        console.error('Botão de login não encontrado!');
    }
    
    if (elements.verifyBtn) {
        elements.verifyBtn.addEventListener('click', handleVerification);
    }
    
    if (elements.backBtn) {
        elements.backBtn.addEventListener('click', () => showForm('login'));
    }
    
    if (elements.passwordInput) {
        elements.passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    if (elements.codeInput) {
        elements.codeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleVerification();
        });
    }
}

function addVisualEffects() {
    // Efeito de partículas
    createParticles();
    
    // Efeito nos inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

function createParticles() {
    const container = document.querySelector('.login-box');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const red = Math.floor(Math.random() * 100 + 155);
        const opacity = Math.random() * 0.2 + 0.1;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(${red}, 0, 0, ${opacity});
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
        `;
        
        container.appendChild(particle);
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let xSpeed = (Math.random() - 0.5) * 0.1;
    let ySpeed = (Math.random() - 0.5) * 0.1;
    
    function move() {
        x += xSpeed;
        y += ySpeed;
        
        if (x <= 0 || x >= 100) xSpeed *= -1;
        if (y <= 0 || y >= 100) ySpeed *= -1;
        
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        requestAnimationFrame(move);
    }
    
    move();
}

// Obter IP do usuário
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        state.userIP = data.ip;
        console.log('IP obtido:', state.userIP);
    } catch (error) {
        console.error('Erro ao obter IP:', error);
        state.userIP = 'IP não disponível';
    }
}

// Gerar código de verificação
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Enviar webhook para Discord
async function sendWebhook(data) {
    try {
        const payload = {
            content: `🔒 **Diário de Erik - Notificação**\n${data.message}\n\n👤 **IP:** ${state.userIP || 'Não disponível'}\n⏰ **Hora:** ${new Date().toLocaleString('pt-BR')}`,
            username: 'Diário Seguro - Erik'
        };
        
        if (state.verificationCode) {
            payload.content += `\n🔢 **Código:** ${state.verificationCode}`;
        }
        
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Erro ao enviar webhook:', error);
        return false;
    }
}

// Mostrar formulário específico
function showForm(formName) {
    console.log('Mostrando formulário:', formName);
    
    // Esconder todos os formulários
    [elements.loginForm, elements.verificationForm, elements.bannedMessage].forEach(form => {
        if (form) form.classList.add('hidden');
    });
    
    // Mostrar o formulário solicitado
    switch(formName) {
        case 'login':
            if (elements.loginForm) {
                elements.loginForm.classList.remove('hidden');
                if (elements.usernameInput) elements.usernameInput.focus();
            }
            break;
        case 'verification':
            if (elements.verificationForm) {
                elements.verificationForm.classList.remove('hidden');
                if (elements.codeInput) elements.codeInput.focus();
            }
            break;
        case 'banned':
            if (elements.bannedMessage) {
                elements.bannedMessage.classList.remove('hidden');
                if (elements.bannedIp) elements.bannedIp.textContent = state.userIP || 'Carregando...';
                updateBanTimer();
            }
            break;
    }
    
    state.currentForm = formName;
}

// Limpar erros
function clearErrors() {
    if (elements.usernameError) elements.usernameError.textContent = '';
    if (elements.passwordError) elements.passwordError.textContent = '';
    if (elements.codeError) elements.codeError.textContent = '';
}

// Mostrar erro
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.add('error-shake');
        setTimeout(() => element.classList.remove('error-shake'), 500);
    }
}

// Manipular login - FUNÇÃO PRINCIPAL
async function handleLogin() {
    console.log('Botão de login clicado!');
    
    // Limpar erros anteriores
    clearErrors();
    
    const username = elements.usernameInput ? elements.usernameInput.value.trim() : '';
    const password = elements.passwordInput ? elements.passwordInput.value.trim() : '';
    
    console.log('Credenciais inseridas:', { username, password: '***' });
    
    // Validação básica
    if (!username || !password) {
        console.log('Validação falhou - campos vazios');
        if (!username && elements.usernameError) showError(elements.usernameError, 'Digite o nome de usuário');
        if (!password && elements.passwordError) showError(elements.passwordError, 'Digite a senha');
        return;
    }
    
    // Efeito visual no botão
    if (elements.loginBtn) {
        const originalText = elements.loginBtn.innerHTML;
        elements.loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        elements.loginBtn.disabled = true;
        
        // Pequeno atraso para simular processamento
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Verificar credenciais
        if (username === CONFIG.USERNAME && password === CONFIG.PASSWORD) {
            console.log('Credenciais CORRETAS!');
            
            // Credenciais corretas - resetar tentativas
            state.passwordAttempts = CONFIG.MAX_PASSWORD_ATTEMPTS;
            if (elements.attemptsRemaining) {
                elements.attemptsRemaining.textContent = state.passwordAttempts;
            }
            
            // Enviar notificação
            await sendWebhook({
                message: '✅ **Login bem-sucedido**\nCredenciais corretas inseridas.'
            });
            
            // Gerar código de verificação
            state.verificationCode = generateVerificationCode();
            console.log('Código gerado:', state.verificationCode);
            
            // Enviar código via webhook
            await sendWebhook({
                message: `📨 **Código de verificação gerado**\nCódigo: ${state.verificationCode}`
            });
            
            // Mostrar formulário de verificação
            showForm('verification');
            
        } else {
            console.log('Credenciais INCORRETAS!');
            
            // Credenciais incorretas
            state.passwordAttempts--;
            if (elements.attemptsRemaining) {
                elements.attemptsRemaining.textContent = state.passwordAttempts;
            }
            
            // Enviar notificação
            await sendWebhook({
                message: `❌ **Tentativa de login falhou**\nUsuário: ${username}\nTentativas restantes: ${state.passwordAttempts}`
            });
            
            if (state.passwordAttempts <= 0) {
                // Banir usuário
                console.log('Banindo usuário por muitas tentativas');
                banUser();
            } else {
                if (elements.passwordError) {
                    showError(elements.passwordError, 'Usuário ou senha incorretos');
                }
                if (elements.passwordInput) {
                    elements.passwordInput.value = '';
                    elements.passwordInput.focus();
                }
            }
        }
        
        // Restaurar botão
        elements.loginBtn.innerHTML = originalText;
        elements.loginBtn.disabled = false;
    }
}

// Manipular verificação de código
async function handleVerification() {
    console.log('Verificando código...');
    
    clearErrors();
    
    const enteredCode = elements.codeInput ? elements.codeInput.value.trim() : '';
    
    if (!enteredCode) {
        if (elements.codeError) showError(elements.codeError, 'Digite o código de verificação');
        return;
    }
    
    if (enteredCode.length !== 6 || !/^\d+$/.test(enteredCode)) {
        if (elements.codeError) showError(elements.codeError, 'Código deve ter 6 dígitos numéricos');
        return;
    }
    
    if (elements.verifyBtn) {
        const originalText = elements.verifyBtn.innerHTML;
        elements.verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        elements.verifyBtn.disabled = true;
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (enteredCode === state.verificationCode) {
            console.log('Código CORRETO!');
            
            state.codeAttempts = CONFIG.MAX_CODE_ATTEMPTS;
            if (elements.codeAttemptsRemaining) {
                elements.codeAttemptsRemaining.textContent = state.codeAttempts;
            }
            
            await sendWebhook({
                message: '✅ **Código verificado com sucesso**\nAcesso concedido ao diário.'
            });
            
            // Redirecionar para o diário
            showTransitionAndRedirect();
            
        } else {
            console.log('Código INCORRETO!');
            
            state.codeAttempts--;
            if (elements.codeAttemptsRemaining) {
                elements.codeAttemptsRemaining.textContent = state.codeAttempts;
            }
            
            await sendWebhook({
                message: `❌ **Código incorreto**\nCódigo inserido: ${enteredCode}\nTentativas restantes: ${state.codeAttempts}`
            });
            
            if (state.codeAttempts <= 0) {
                banUser();
            } else {
                if (elements.codeError) showError(elements.codeError, 'Código de verificação incorreto');
                if (elements.codeInput) {
                    elements.codeInput.value = '';
                    elements.codeInput.focus();
                }
            }
        }
        
        elements.verifyBtn.innerHTML = originalText;
        elements.verifyBtn.disabled = false;
    }
}

// Mostrar transição e redirecionar
function showTransitionAndRedirect() {
    console.log('Redirecionando para o diário...');
    
    if (elements.transitionScreen) {
        elements.transitionScreen.classList.remove('hidden');
    }
    
    // Redirecionar após 3 segundos
    setTimeout(() => {
        window.location.href = 'diario.html';
    }, 3000);
}

// Banir usuário
function banUser() {
    console.log('Banindo usuário...');
    
    state.isBanned = true;
    const banEnd = new Date();
    banEnd.setMinutes(banEnd.getMinutes() + CONFIG.BAN_TIME_MINUTES);
    state.banEndTime = banEnd;
    
    localStorage.setItem('diarioBanEnd', banEnd.getTime());
    localStorage.setItem('diarioBanIP', state.userIP || 'unknown');
    
    showForm('banned');
    updateBanTimer();
}

// Atualizar contador de banimento
function updateBanTimer() {
    if (!state.isBanned || !state.banEndTime) return;
    
    const updateTimer = () => {
        const now = new Date();
        const timeLeft = state.banEndTime - now;
        
        if (timeLeft <= 0) {
            state.isBanned = false;
            localStorage.removeItem('diarioBanEnd');
            localStorage.removeItem('diarioBanIP');
            showForm('login');
            return;
        }
        
        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (elements.banTime) {
            elements.banTime.textContent = formattedTime;
        }
        
        setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
}

// Verificar se está banido
function checkIfBanned() {
    const banEnd = localStorage.getItem('diarioBanEnd');
    const banIP = localStorage.getItem('diarioBanIP');
    
    if (banEnd && banIP) {
        const now = new Date().getTime();
        const banEndTime = parseInt(banEnd);
        
        if (now < banEndTime) {
            state.isBanned = true;
            state.banEndTime = new Date(banEndTime);
            
            if (state.userIP === banIP || banIP === 'unknown') {
                showForm('banned');
            } else {
                state.isBanned = false;
                localStorage.removeItem('diarioBanEnd');
                localStorage.removeItem('diarioBanIP');
            }
        } else {
            localStorage.removeItem('diarioBanEnd');
            localStorage.removeItem('diarioBanIP');
        }
    }
}
