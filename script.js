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
    verificationCode: null,
    userLocation: null
};

// Elementos DOM
const elements = {
    // Formulários
    loginForm: null,
    verificationForm: null,
    locationForm: null,
    bannedMessage: null,
    
    // Campos de entrada
    usernameInput: null,
    passwordInput: null,
    codeInput: null,
    
    // Botões
    loginBtn: null,
    verifyBtn: null,
    backBtn: null,
    allowLocationBtn: null,
    denyLocationBtn: null,
    
    // Mensagens de erro
    usernameError: null,
    passwordError: null,
    codeError: null,
    
    // Contadores
    attemptsRemaining: null,
    codeAttemptsRemaining: null,
    
    // Informações de banimento
    banTime: null,
    bannedIp: null,
    
    // Tela de transição
    transitionScreen: null,
    transitionImage: null,
    
    // Ano atual
    currentYear: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    // Inicializar elementos DOM
    initializeElements();
    
    // Configurar ano atual
    elements.currentYear.textContent = new Date().getFullYear();
    
    // Configurar imagem de transição
    elements.transitionImage.src = CONFIG.TRANSITION_IMAGE;
    
    // Configurar event listeners
    setupEventListeners();
    
    // Verificar se está banido
    checkIfBanned();
    
    // Obter IP do usuário
    getUserIP();
    
    // Adicionar efeitos visuais
    addVisualEffects();
}

function initializeElements() {
    // Formulários
    elements.loginForm = document.getElementById('login-form');
    elements.verificationForm = document.getElementById('verification-form');
    elements.locationForm = document.getElementById('location-form');
    elements.bannedMessage = document.getElementById('banned-message');
    
    // Campos de entrada
    elements.usernameInput = document.getElementById('username');
    elements.passwordInput = document.getElementById('password');
    elements.codeInput = document.getElementById('verification-code');
    
    // Botões
    elements.loginBtn = document.getElementById('login-btn');
    elements.verifyBtn = document.getElementById('verify-btn');
    elements.backBtn = document.getElementById('back-btn');
    elements.allowLocationBtn = document.getElementById('allow-location-btn');
    elements.denyLocationBtn = document.getElementById('deny-location-btn');
    
    // Mensagens de erro
    elements.usernameError = document.getElementById('username-error');
    elements.passwordError = document.getElementById('password-error');
    elements.codeError = document.getElementById('code-error');
    
    // Contadores
    elements.attemptsRemaining = document.getElementById('attempts-remaining');
    elements.codeAttemptsRemaining = document.getElementById('code-attempts-remaining');
    
    // Informações de banimento
    elements.banTime = document.getElementById('ban-time');
    elements.bannedIp = document.getElementById('banned-ip');
    
    // Tela de transição
    elements.transitionScreen = document.getElementById('transition-screen');
    elements.transitionImage = document.getElementById('transition-image');
    
    // Ano atual
    elements.currentYear = document.getElementById('current-year');
}

function setupEventListeners() {
    // Botão de login
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', handleLogin);
    }
    
    // Botão de verificação
    if (elements.verifyBtn) {
        elements.verifyBtn.addEventListener('click', handleVerification);
    }
    
    // Botão de voltar
    if (elements.backBtn) {
        elements.backBtn.addEventListener('click', () => showForm('login'));
    }
    
    // Botões de localização
    if (elements.allowLocationBtn) {
        elements.allowLocationBtn.addEventListener('click', handleAllowLocation);
    }
    
    if (elements.denyLocationBtn) {
        elements.denyLocationBtn.addEventListener('click', handleDenyLocation);
    }
    
    // Permitir login com Enter
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
    // Adicionar efeito de partículas
    createParticles();
    
    // Adicionar efeito de brilho nos inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Adicionar efeito de digitação no título
    typeWriterEffect();
}

function createParticles() {
    const container = document.querySelector('.login-box');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Posição aleatória
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Tamanho aleatório
        const size = Math.random() * 3 + 1;
        
        // Cor vermelha com transparência
        const red = Math.floor(Math.random() * 100 + 155);
        const opacity = Math.random() * 0.3 + 0.1;
        
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
        
        // Animar partícula
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    let xSpeed = (Math.random() - 0.5) * 0.2;
    let ySpeed = (Math.random() - 0.5) * 0.2;
    
    function move() {
        x += xSpeed;
        y += ySpeed;
        
        // Rebater nas bordas
        if (x <= 0 || x >= 100) xSpeed *= -1;
        if (y <= 0 || y >= 100) ySpeed *= -1;
        
        // Garantir que fique dentro dos limites
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        requestAnimationFrame(move);
    }
    
    move();
}

function typeWriterEffect() {
    const title = document.querySelector('h1');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, 100);
        }
    }
    
    setTimeout(typeChar, 1000);
}

// Obter IP do usuário
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        state.userIP = data.ip;
        
        // Se estiver na tela de banimento, mostrar o IP
        if (elements.bannedMessage && !elements.bannedMessage.classList.contains('hidden')) {
            elements.bannedIp.textContent = state.userIP;
        }
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
            content: `🔒 **Sistema de Diário - Notificação de Segurança**\n${data.message}\n\n👤 **IP do usuário:** ${state.userIP || 'Não disponível'}\n⏰ **Hora:** ${new Date().toLocaleString('pt-BR')}`,
            username: 'Diário Seguro - Erik',
            avatar_url: 'https://cdn.discordapp.com/attachments/1415484714130739290/1446225200982130759/20251129_132749.jpg?ex=693335ad&is=6931e42d&hm=5f845fcac10fc24a5b975d1c5cb27fbf10a70744ff75b1cf153e2dfe104039c5'
        };
        
        if (state.verificationCode) {
            payload.content += `\n🔢 **Código de verificação:** ${state.verificationCode}`;
        }
        
        if (state.userLocation) {
            payload.content += `\n📍 **Localização:** ${state.userLocation}`;
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
    // Esconder todos os formulários
    if (elements.loginForm) elements.loginForm.classList.add('hidden');
    if (elements.verificationForm) elements.verificationForm.classList.add('hidden');
    if (elements.locationForm) elements.locationForm.classList.add('hidden');
    if (elements.bannedMessage) elements.bannedMessage.classList.add('hidden');
    
    // Mostrar o formulário solicitado
    switch(formName) {
        case 'login':
            if (elements.loginForm) elements.loginForm.classList.remove('hidden');
            if (elements.usernameInput) elements.usernameInput.focus();
            break;
        case 'verification':
            if (elements.verificationForm) elements.verificationForm.classList.remove('hidden');
            if (elements.codeInput) elements.codeInput.focus();
            break;
        case 'location':
            if (elements.locationForm) elements.locationForm.classList.remove('hidden');
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
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        // Animação de entrada
        setTimeout(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }
}

// Manipular login
async function handleLogin() {
    console.log('Botão de login clicado!');
    
    // Limpar erros anteriores
    clearErrors();
    
    const username = elements.usernameInput ? elements.usernameInput.value.trim() : '';
    const password = elements.passwordInput ? elements.passwordInput.value.trim() : '';
    
    // Validação
    if (!username || !password) {
        if (!username && elements.usernameError) showError(elements.usernameError, 'Digite o nome de usuário');
        if (!password && elements.passwordError) showError(elements.passwordError, 'Digite a senha');
        return;
    }
    
    // Efeito visual no botão
    if (elements.loginBtn) {
        elements.loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        elements.loginBtn.disabled = true;
    }
    
    // Pequeno atraso para simular processamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Verificar credenciais
    if (username === CONFIG.USERNAME && password === CONFIG.PASSWORD) {
        // Credenciais corretas
        state.passwordAttempts = CONFIG.MAX_PASSWORD_ATTEMPTS; // Resetar tentativas
        if (elements.attemptsRemaining) elements.attemptsRemaining.textContent = state.passwordAttempts;
        
        // Enviar notificação de login bem-sucedido
        await sendWebhook({
            message: '✅ **Login bem-sucedido**\nUsuário inseriu credenciais corretas.'
        });
        
        // Gerar e enviar código de verificação
        state.verificationCode = generateVerificationCode();
        
        await sendWebhook({
            message: `📨 **Código de verificação enviado**\nUm código de verificação foi gerado para autenticação de dois fatores.`
        });
        
        // Mostrar formulário de verificação
        showForm('verification');
        
    } else {
        // Credenciais incorretas
        state.passwordAttempts--;
        if (elements.attemptsRemaining) elements.attemptsRemaining.textContent = state.passwordAttempts;
        
        // Enviar notificação de tentativa falha
        await sendWebhook({
            message: `❌ **Tentativa de login falhou**\nUsuário: ${username}\nSenha: ${'*'.repeat(password.length)}\nTentativas restantes: ${state.passwordAttempts}`
        });
        
        if (state.passwordAttempts <= 0) {
            // Banir usuário
            banUser();
        } else {
            if (elements.passwordError) showError(elements.passwordError, 'Usuário ou senha incorretos');
            if (elements.passwordInput) {
                elements.passwordInput.value = '';
                elements.passwordInput.focus();
            }
        }
    }
    
    // Restaurar botão
    if (elements.loginBtn) {
        elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Acessar Diário';
        elements.loginBtn.disabled = false;
    }
}

// Manipular verificação de código
async function handleVerification() {
    console.log('Botão de verificação clicado!');
    
    // Limpar erro anterior
    clearErrors();
    
    const enteredCode = elements.codeInput ? elements.codeInput.value.trim() : '';
    
    // Validação
    if (!enteredCode) {
        if (elements.codeError) showError(elements.codeError, 'Digite o código de verificação');
        return;
    }
    
    if (enteredCode.length !== 6 || !/^\d+$/.test(enteredCode)) {
        if (elements.codeError) showError(elements.codeError, 'Código deve ter 6 dígitos numéricos');
        return;
    }
    
    // Efeito visual no botão
    if (elements.verifyBtn) {
        elements.verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        elements.verifyBtn.disabled = true;
    }
    
    // Pequeno atraso para simular processamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Verificar código
    if (enteredCode === state.verificationCode) {
        // Código correto
        state.codeAttempts = CONFIG.MAX_CODE_ATTEMPTS; // Resetar tentativas
        if (elements.codeAttemptsRemaining) elements.codeAttemptsRemaining.textContent = state.codeAttempts;
        
        // Enviar notificação
        await sendWebhook({
            message: '✅ **Código de verificação correto**\nO usuário inseriu o código de verificação corretamente.'
        });
        
        // Mostrar formulário de localização
        showForm('location');
        
    } else {
        // Código incorreto
        state.codeAttempts--;
        if (elements.codeAttemptsRemaining) elements.codeAttemptsRemaining.textContent = state.codeAttempts;
        
        // Enviar notificação
        await sendWebhook({
            message: `❌ **Código de verificação incorreto**\nCódigo inserido: ${enteredCode}\nTentativas restantes: ${state.codeAttempts}`
        });
        
        if (state.codeAttempts <= 0) {
            // Banir usuário
            banUser();
        } else {
            if (elements.codeError) showError(elements.codeError, 'Código de verificação incorreto');
            if (elements.codeInput) {
                elements.codeInput.value = '';
                elements.codeInput.focus();
            }
        }
    }
    
    // Restaurar botão
    if (elements.verifyBtn) {
        elements.verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verificar Código';
        elements.verifyBtn.disabled = false;
    }
}

// Manipular permissão de localização
async function handleAllowLocation() {
    console.log('Permitir localização clicado!');
    
    // Solicitar localização
    if (!navigator.geolocation) {
        alert('Seu navegador não suporta geolocalização');
        return;
    }
    
    // Mostrar indicador de carregamento
    if (elements.allowLocationBtn) {
        elements.allowLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obtendo localização...';
        elements.allowLocationBtn.disabled = true;
    }
    
    if (elements.denyLocationBtn) {
        elements.denyLocationBtn.disabled = true;
    }
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            // Sucesso
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Formatar localização
            state.userLocation = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            
            // Enviar notificação com localização
            await sendWebhook({
                message: `📍 **Localização permitida**\nO usuário permitiu acesso à localização.\nCoordenadas: ${state.userLocation}\nPrecisão: ${position.coords.accuracy.toFixed(0)} metros`
            });
            
            // Mostrar tela de transição e redirecionar
            showTransitionAndRedirect();
            
        },
        async (error) => {
            // Erro
            if (elements.allowLocationBtn) {
                elements.allowLocationBtn.innerHTML = '<i class="fas fa-times"></i> Erro ao obter localização';
            }
            
            // Enviar notificação de erro
            await sendWebhook({
                message: `❌ **Erro ao obter localização**\nCódigo do erro: ${error.code}\nMensagem: ${error.message}`
            });
            
            // Ainda assim, permitir acesso após alguns segundos
            setTimeout(() => {
                showTransitionAndRedirect();
            }, 2000);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Manipular recusa de localização
async function handleDenyLocation() {
    console.log('Recusar localização clicado!');
    
    // Efeito visual no botão
    if (elements.denyLocationBtn) {
        elements.denyLocationBtn.innerHTML = '<i class="fas fa-ban"></i> Bloqueando acesso...';
        elements.denyLocationBtn.disabled = true;
    }
    
    // Enviar notificação
    await sendWebhook({
        message: '❌ **Localização recusada**\nO usuário recusou o acesso à localização. IP será bloqueado por 5 minutos.'
    });
    
    // Banir usuário
    banUser();
}

// Mostrar transição e redirecionar
function showTransitionAndRedirect() {
    // Mostrar tela de transição
    if (elements.transitionScreen) {
        elements.transitionScreen.classList.remove('hidden');
    }
    
    // Redirecionar para o diário após 3 segundos
    setTimeout(() => {
        window.location.href = 'diario.html';
    }, 3000);
}

// Banir usuário
function banUser() {
    state.isBanned = true;
    
    // Definir tempo de banimento
    const banEnd = new Date();
    banEnd.setMinutes(banEnd.getMinutes() + CONFIG.BAN_TIME_MINUTES);
    state.banEndTime = banEnd;
    
    // Salvar no localStorage
    localStorage.setItem('diarioBanEnd', banEnd.getTime());
    localStorage.setItem('diarioBanIP', state.userIP || 'unknown');
    
    // Mostrar mensagem de banimento
    showForm('banned');
    
    // Atualizar contador regressivo
    updateBanTimer();
}

// Atualizar contador de banimento
function updateBanTimer() {
    if (!state.isBanned || !state.banEndTime) return;
    
    const updateTimer = () => {
        const now = new Date();
        const timeLeft = state.banEndTime - now;
        
        if (timeLeft <= 0) {
            // Tempo expirado
            state.isBanned = false;
            localStorage.removeItem('diarioBanEnd');
            localStorage.removeItem('diarioBanIP');
            showForm('login');
            return;
        }
        
        // Calcular minutos e segundos
        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Formatar tempo
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Atualizar display
        if (elements.banTime) {
            elements.banTime.textContent = formattedTime;
        }
        
        // Continuar atualizando
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
            // Ainda banido
            state.isBanned = true;
            state.banEndTime = new Date(banEndTime);
            
            // Verificar se é o mesmo IP
            getUserIP().then(() => {
                if (state.userIP === banIP || banIP === 'unknown') {
                    showForm('banned');
                } else {
                    // IP diferente, remover banimento
                    state.isBanned = false;
                    localStorage.removeItem('diarioBanEnd');
                    localStorage.removeItem('diarioBanIP');
                }
            });
        } else {
            // Tempo expirado
            localStorage.removeItem('diarioBanEnd');
            localStorage.removeItem('diarioBanIP');
        }
    }
}
