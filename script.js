// CONFIGURAÇÕES DO SISTEMA
const CONFIG = {
    USERNAME: 'ErikSlava',
    PASSWORD: 'Erik2008',
    WEBHOOK_URL: 'https://discord.com/api/webhooks/1429236562134302781/9aDDtdDEO18AtU_Z7s08oRx9vjwhaez9shQWO6P3Ycf0ljNPM5iEitEd1f_8p8Opj-o2',
    PROFILE_IMAGE: 'https://cdn.discordapp.com/attachments/1415484714130739290/1446225200982130759/20251129_132749.jpg?ex=693335ad&is=6931e42d&hm=5f845fcac10fc24a5b975d1c5cb27fbf10a70744ff75b1cf153e2dfe104039c5',
    MAX_PASSWORD_ATTEMPTS: 3,
    MAX_CODE_ATTEMPTS: 5,
    BAN_TIME_MINUTES: 5,
    TRANSITION_TIME: 4
};

// ESTADO DO SISTEMA
let state = {
    currentScreen: 'login',
    passwordAttempts: CONFIG.MAX_PASSWORD_ATTEMPTS,
    codeAttempts: CONFIG.MAX_CODE_ATTEMPTS,
    isBanned: false,
    banEndTime: null,
    userIP: null,
    verificationCode: null,
    codeExpiry: null,
    userInfo: {
        name: 'Erik',
        birthDate: '30/07/2008',
        age: new Date().getFullYear() - 2008
    }
};

// ELEMENTOS DOM
const elements = {
    // Telas
    loginScreen: document.getElementById('login-screen'),
    verificationScreen: document.getElementById('verification-screen'),
    bannedScreen: document.getElementById('banned-screen'),
    transitionScreen: document.getElementById('transition-screen'),
    
    // Campos de login
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    loginBtn: document.getElementById('login-btn'),
    
    // Campos de verificação
    codeDigits: document.querySelectorAll('.code-digit'),
    verifyBtn: document.getElementById('verify-btn'),
    backBtn: document.getElementById('back-btn'),
    resendBtn: document.getElementById('resend-btn'),
    
    // Contadores
    attemptsCount: document.getElementById('attempts-count'),
    codeAttempts: document.getElementById('code-attempts'),
    codeTimer: document.getElementById('code-timer'),
    
    // Informações do sistema
    userIp: document.getElementById('user-ip'),
    currentTime: document.getElementById('current-time'),
    
    // Sistema de banimento
    banMinutes: document.getElementById('ban-minutes'),
    banSeconds: document.getElementById('ban-seconds'),
    bannedIp: document.getElementById('banned-ip'),
    banExpiry: document.getElementById('ban-expiry'),
    
    // Sistema de transição
    countdownTimer: document.getElementById('countdown-timer'),
    progressFill: document.querySelector('.progress-fill'),
    progressPercent: document.querySelector('.progress-percent'),
    
    // Erros
    usernameError: document.getElementById('username-error'),
    passwordError: document.getElementById('password-error'),
    codeError: document.getElementById('code-error'),
    
    // Botões de visibilidade
    togglePassword: document.querySelector('.toggle-password')
};

// INICIALIZAÇÃO DO SISTEMA
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema do Diário Inicializando...');
    initializeSystem();
});

async function initializeSystem() {
    try {
        // Configurar elementos
        setupElements();
        
        // Configurar eventos
        setupEventListeners();
        
        // Inicializar funcionalidades
        await initializeFeatures();
        
        // Verificar se está banido
        checkBanStatus();
        
        console.log('✅ Sistema inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showError('Erro no sistema. Recarregue a página.');
    }
}

function setupElements() {
    // Configurar tempo atual
    updateClock();
    setInterval(updateClock, 1000);
    
    // Configurar visibilidade da senha
    if (elements.togglePassword) {
        elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // Configurar entrada do código
    setupCodeInputs();
}

function setupEventListeners() {
    // Botão de login
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', handleLogin);
    }
    
    // Enter no login
    if (elements.passwordInput) {
        elements.passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }
    
    // Botão de verificação
    if (elements.verifyBtn) {
        elements.verifyBtn.addEventListener('click', handleVerification);
    }
    
    // Botão de voltar
    if (elements.backBtn) {
        elements.backBtn.addEventListener('click', () => showScreen('login'));
    }
    
    // Botão de reenviar código
    if (elements.resendBtn) {
        elements.resendBtn.addEventListener('click', resendVerificationCode);
    }
}

async function initializeFeatures() {
    // Obter IP do usuário
    await getUserIP();
    
    // Criar partículas
    createParticles();
    
    // Animar elementos
    animateElements();
}

// ANIMAÇÕES E EFEITOS VISUAIS
function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.5 ? '#ff0055' : '#00a8ff'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.3 + 0.1};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

function animateElements() {
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach((field, index) => {
        field.style.setProperty('--order', index);
    });
    
    const loadingItems = document.querySelectorAll('.loading-item');
    loadingItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.5}s`;
    });
}

// FUNÇÕES DO SISTEMA
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        state.userIP = data.ip;
        
        if (elements.userIp) {
            elements.userIp.textContent = data.ip;
        }
        
        return data.ip;
    } catch (error) {
        console.error('Erro ao obter IP:', error);
        state.userIP = 'Não disponível';
        
        if (elements.userIp) {
            elements.userIp.textContent = 'Não disponível';
        }
        
        return 'Não disponível';
    }
}

function updateClock() {
    if (!elements.currentTime) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    elements.currentTime.textContent = timeString;
}

function togglePasswordVisibility() {
    if (!elements.passwordInput || !elements.togglePassword) return;
    
    const type = elements.passwordInput.getAttribute('type');
    const newType = type === 'password' ? 'text' : 'password';
    const icon = elements.togglePassword.querySelector('i');
    
    elements.passwordInput.setAttribute('type', newType);
    icon.className = newType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function setupCodeInputs() {
    if (!elements.codeDigits || elements.codeDigits.length === 0) return;
    
    elements.codeDigits.forEach((digit, index) => {
        digit.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Permitir apenas números
            if (!/^\d?$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Mover para o próximo campo
            if (value !== '' && index < elements.codeDigits.length - 1) {
                elements.codeDigits[index + 1].focus();
            }
            
            // Verificar se todos os dígitos foram preenchidos
            checkCodeCompletion();
        });
        
        digit.addEventListener('keydown', function(e) {
            // Voltar para o campo anterior ao apagar
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                elements.codeDigits[index - 1].focus();
            }
        });
    });
}

function checkCodeCompletion() {
    if (!elements.codeDigits) return;
    
    let allFilled = true;
    elements.codeDigits.forEach(digit => {
        if (digit.value === '') allFilled = false;
    });
    
    if (elements.verifyBtn) {
        elements.verifyBtn.disabled = !allFilled;
    }
}

function getCodeValue() {
    if (!elements.codeDigits) return '';
    
    let code = '';
    elements.codeDigits.forEach(digit => {
        code += digit.value;
    });
    
    return code;
}

function resetCodeInputs() {
    if (!elements.codeDigits) return;
    
    elements.codeDigits.forEach(digit => {
        digit.value = '';
    });
    
    if (elements.codeDigits[0]) {
        elements.codeDigits[0].focus();
    }
    
    if (elements.verifyBtn) {
        elements.verifyBtn.disabled = true;
    }
}

// GERENCIAMENTO DE TELAS
function showScreen(screenName) {
    console.log(`🔄 Mudando para tela: ${screenName}`);
    
    // Esconder todas as telas
    const screens = ['login', 'verification', 'banned', 'transition'];
    screens.forEach(screen => {
        const element = document.getElementById(`${screen}-screen`);
        if (element) {
            element.classList.remove('active');
        }
    });
    
    // Mostrar tela solicitada
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenName;
        
        // Executar ações específicas para cada tela
        switch(screenName) {
            case 'login':
                if (elements.usernameInput) {
                    elements.usernameInput.focus();
                }
                break;
            case 'verification':
                generateVerificationCode();
                startCodeTimer();
                resetCodeInputs();
                if (elements.codeDigits && elements.codeDigits[0]) {
                    elements.codeDigits[0].focus();
                }
                break;
            case 'banned':
                updateBanTimerDisplay();
                break;
            case 'transition':
                startTransition();
                break;
        }
    }
}

// SISTEMA DE LOGIN
async function handleLogin() {
    console.log('🔑 Processando login...');
    
    // Limpar erros anteriores
    clearErrors();
    
    // Validar entrada
    const username = elements.usernameInput ? elements.usernameInput.value.trim() : '';
    const password = elements.passwordInput ? elements.passwordInput.value.trim() : '';
    
    if (!username || !password) {
        showError(elements.usernameError, !username ? 'Digite o nome de usuário' : '');
        showError(elements.passwordError, !password ? 'Digite a senha' : '');
        return;
    }
    
    // Desabilitar botão durante processamento
    if (elements.loginBtn) {
        const originalText = elements.loginBtn.innerHTML;
        elements.loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VERIFICANDO...';
        elements.loginBtn.disabled = true;
        
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar credenciais
        if (username === CONFIG.USERNAME && password === CONFIG.PASSWORD) {
            console.log('✅ Login bem-sucedido!');
            
            // Resetar tentativas
            state.passwordAttempts = CONFIG.MAX_PASSWORD_ATTEMPTS;
            if (elements.attemptsCount) {
                elements.attemptsCount.textContent = state.passwordAttempts;
            }
            
            // Enviar notificação para webhook
            await sendWebhookNotification('login_success', { username });
            
            // Ir para verificação
            showScreen('verification');
            
        } else {
            console.log('❌ Credenciais incorretas!');
            
            // Decrementar tentativas
            state.passwordAttempts--;
            if (elements.attemptsCount) {
                elements.attemptsCount.textContent = state.passwordAttempts;
            }
            
            // Enviar notificação de tentativa falha
            await sendWebhookNotification('login_failed', { 
                username, 
                attemptsLeft: state.passwordAttempts 
            });
            
            if (state.passwordAttempts <= 0) {
                // Banir usuário
                banUser();
            } else {
                showError(elements.passwordError, 'Usuário ou senha incorretos');
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

// SISTEMA DE VERIFICAÇÃO
function generateVerificationCode() {
    state.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    state.codeExpiry = Date.now() + (5 * 60 * 1000); // 5 minutos
    
    console.log(`🔢 Código gerado: ${state.verificationCode}`);
    
    // Enviar código via webhook
    sendWebhookNotification('verification_code', { code: state.verificationCode });
    
    return state.verificationCode;
}

function startCodeTimer() {
    if (!elements.codeTimer) return;
    
    const updateTimer = () => {
        if (!state.codeExpiry) return;
        
        const now = Date.now();
        const timeLeft = state.codeExpiry - now;
        
        if (timeLeft <= 0) {
            elements.codeTimer.textContent = 'Expirado';
            elements.codeTimer.style.color = '#ff3333';
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        elements.codeTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        elements.codeTimer.style.color = timeLeft < 60000 ? '#ffaa00' : '#00ff88';
        
        setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
}

async function handleVerification() {
    console.log('🔐 Verificando código...');
    
    clearErrors();
    
    const enteredCode = getCodeValue();
    
    if (enteredCode.length !== 6) {
        showError(elements.codeError, 'Código deve ter 6 dígitos');
        return;
    }
    
    if (!elements.verifyBtn) return;
    
    const originalText = elements.verifyBtn.innerHTML;
    elements.verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VALIDANDO...';
    elements.verifyBtn.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (enteredCode === state.verificationCode) {
        console.log('✅ Código correto!');
        
        // Resetar tentativas
        state.codeAttempts = CONFIG.MAX_CODE_ATTEMPTS;
        if (elements.codeAttempts) {
            elements.codeAttempts.textContent = state.codeAttempts;
        }
        
        // Enviar notificação
        await sendWebhookNotification('verification_success', {});
        
        // Ir para transição
        showScreen('transition');
        
    } else {
        console.log('❌ Código incorreto!');
        
        state.codeAttempts--;
        if (elements.codeAttempts) {
            elements.codeAttempts.textContent = state.codeAttempts;
        }
        
        await sendWebhookNotification('verification_failed', { 
            enteredCode,
            attemptsLeft: state.codeAttempts 
        });
        
        if (state.codeAttempts <= 0) {
            banUser();
        } else {
            showError(elements.codeError, 'Código de verificação incorreto');
            resetCodeInputs();
        }
    }
    
    elements.verifyBtn.innerHTML = originalText;
    elements.verifyBtn.disabled = false;
}

async function resendVerificationCode() {
    if (!elements.resendBtn) return;
    
    const originalText = elements.resendBtn.innerHTML;
    elements.resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
    elements.resendBtn.disabled = true;
    
    generateVerificationCode();
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    elements.resendBtn.innerHTML = originalText;
    elements.resendBtn.disabled = false;
    
    showError(elements.codeError, 'Novo código enviado!');
}

// SISTEMA DE BANIMENTO
function banUser() {
    console.log('⛔ Banindo usuário...');
    
    state.isBanned = true;
    state.banEndTime = Date.now() + (CONFIG.BAN_TIME_MINUTES * 60 * 1000);
    
    // Salvar no localStorage
    localStorage.setItem('diario_ban_end', state.banEndTime);
    localStorage.setItem('diario_ban_ip', state.userIP);
    
    // Enviar notificação
    sendWebhookNotification('user_banned', { 
        reason: 'Tentativas excessivas',
        banTime: CONFIG.BAN_TIME_MINUTES 
    });
    
    // Mostrar tela de banimento
    showScreen('banned');
}

function checkBanStatus() {
    const banEnd = localStorage.getItem('diario_ban_end');
    const banIP = localStorage.getItem('diario_ban_ip');
    
    if (banEnd && banIP) {
        const now = Date.now();
        const banEndTime = parseInt(banEnd);
        
        if (now < banEndTime && banIP === state.userIP) {
            state.isBanned = true;
            state.banEndTime = banEndTime;
            showScreen('banned');
            return true;
        } else {
            // Remover banimento expirado
            localStorage.removeItem('diario_ban_end');
            localStorage.removeItem('diario_ban_ip');
        }
    }
    
    return false;
}

function updateBanTimerDisplay() {
    if (!state.isBanned || !state.banEndTime) return;
    
    const updateTimer = () => {
        const now = Date.now();
        const timeLeft = state.banEndTime - now;
        
        if (timeLeft <= 0) {
            // Desbanir usuário
            state.isBanned = false;
            localStorage.removeItem('diario_ban_end');
            localStorage.removeItem('diario_ban_ip');
            showScreen('login');
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        // Atualizar display
        if (elements.banMinutes) {
            elements.banMinutes.textContent = minutes.toString().padStart(2, '0');
        }
        if (elements.banSeconds) {
            elements.banSeconds.textContent = seconds.toString().padStart(2, '0');
        }
        if (elements.bannedIp) {
            elements.bannedIp.textContent = state.userIP || 'Não disponível';
        }
        
        // Atualizar círculo de progresso
        const progressCircle = document.querySelector('.timer-progress');
        if (progressCircle) {
            const totalTime = CONFIG.BAN_TIME_MINUTES * 60 * 1000;
            const progress = ((totalTime - timeLeft) / totalTime) * 628;
            progressCircle.style.strokeDashoffset = 628 - progress;
        }
        
        // Atualizar tempo de expiração
        if (elements.banExpiry) {
            const expiryTime = new Date(state.banEndTime);
            elements.banExpiry.textContent = expiryTime.toLocaleTimeString('pt-BR', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
        
        setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
}

// SISTEMA DE TRANSIÇÃO
function startTransition() {
    console.log('🚀 Iniciando transição...');
    
    let timeLeft = CONFIG.TRANSITION_TIME;
    let progress = 0;
    
    const updateTransition = () => {
        // Atualizar contador
        if (elements.countdownTimer) {
            elements.countdownTimer.textContent = timeLeft;
        }
        
        // Atualizar barra de progresso
        progress = 100 - ((timeLeft / CONFIG.TRANSITION_TIME) * 100);
        if (elements.progressFill) {
            elements.progressFill.style.width = `${progress}%`;
        }
        if (elements.progressPercent) {
            elements.progressPercent.textContent = `${Math.round(progress)}%`;
        }
        
        timeLeft--;
        
        if (timeLeft < 0) {
            // Redirecionar para o diário
            window.location.href = 'diario.html';
        } else {
            setTimeout(updateTransition, 1000);
        }
    };
    
    updateTransition();
}

// WEBHOOK NOTIFICATIONS
async function sendWebhookNotification(type, data) {
    try {
        const messages = {
            'login_success': `✅ **LOGIN BEM-SUCEDIDO**\n👤 Usuário: ${data.username}\n🌐 IP: ${state.userIP}\n⏰ ${new Date().toLocaleString('pt-BR')}`,
            'login_failed': `❌ **TENTATIVA DE LOGIN FALHOU**\n👤 Usuário: ${data.username}\n🌐 IP: ${state.userIP}\n🔢 Tentativas restantes: ${data.attemptsLeft}\n⏰ ${new Date().toLocaleString('pt-BR')}`,
            'verification_code': `🔐 **CÓDIGO DE VERIFICAÇÃO**\nCódigo: ${data.code}\n🌐 IP: ${state.userIP}\n⏰ Expira em: 5 minutos\n⏰ ${new Date().toLocaleString('pt-BR')}`,
            'verification_success': `✅ **VERIFICAÇÃO BEM-SUCEDIDA**\n🌐 IP: ${state.userIP}\n⏰ ${new Date().toLocaleString('pt-BR')}`,
            'verification_failed': `❌ **VERIFICAÇÃO FALHOU**\nCódigo inserido: ${data.enteredCode}\n🌐 IP: ${state.userIP}\n🔢 Tentativas restantes: ${data.attemptsLeft}\n⏰ ${new Date().toLocaleString('pt-BR')}`,
            'user_banned': `⛔ **USUÁRIO BANIDO**\n🌐 IP: ${state.userIP}\n⏱️ Tempo de banimento: ${data.banTime} minutos\n📝 Motivo: ${data.reason}\n⏰ ${new Date().toLocaleString('pt-BR')}`
        };
        
        const payload = {
            content: messages[type] || 'Notificação do sistema',
            username: 'Diário Seguro - Erik',
            avatar_url: CONFIG.PROFILE_IMAGE
        };
        
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Erro ao enviar webhook:', error);
        return false;
    }
}

// UTILITÁRIOS
function clearErrors() {
    if (elements.usernameError) elements.usernameError.textContent = '';
    if (elements.passwordError) elements.passwordError.textContent = '';
    if (elements.codeError) elements.codeError.textContent = '';
}

function showError(element, message) {
    if (!element) return;
    
    element.textContent = message;
    element.classList.add('show');
    
    // Remover erro após 5 segundos
    setTimeout(() => {
        element.classList.remove('show');
        element.textContent = '';
    }, 5000);
}

// Inicializar quando a página carregar
window.addEventListener('load', function() {
    console.log('📖 Sistema do Diário Pessoal carregado!');
    console.log('👤 Usuário configurado:', CONFIG.USERNAME);
    console.log('🔗 Webhook:', CONFIG.WEBHOOK_URL.substring(0, 50) + '...');
});
