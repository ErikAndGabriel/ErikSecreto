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
    console.log('🔧 Configurações:', CONFIG);
    
    // Adicionar estilos para debug
    addDebugStyles();
    
    // Inicializar
    setTimeout(() => {
        initializeSystem();
    }, 500);
});

async function initializeSystem() {
    try {
        console.log('1. Configurando elementos...');
        setupElements();
        
        console.log('2. Configurando eventos...');
        setupEventListeners();
        
        console.log('3. Inicializando funcionalidades...');
        await initializeFeatures();
        
        console.log('4. Verificando banimento...');
        checkBanStatus();
        
        console.log('✅ Sistema inicializado com sucesso!');
        showSystemStatus();
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showError('Erro no sistema. Recarregue a página.');
    }
}

function addDebugStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .debug-panel {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: #00ff88;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            border: 1px solid #00ff88;
            max-width: 300px;
            display: none;
        }
        .debug-toggle {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #ff0055;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            z-index: 10000;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
    
    // Criar botão de debug
    const debugBtn = document.createElement('button');
    debugBtn.className = 'debug-toggle';
    debugBtn.innerHTML = '🐛';
    debugBtn.title = 'Debug Info';
    debugBtn.onclick = toggleDebugPanel;
    document.body.appendChild(debugBtn);
    
    // Criar painel de debug
    const debugPanel = document.createElement('div');
    debugPanel.className = 'debug-panel';
    debugPanel.id = 'debug-panel';
    document.body.appendChild(debugPanel);
}

function toggleDebugPanel() {
    const panel = document.getElementById('debug-panel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    updateDebugInfo();
}

function updateDebugInfo() {
    const panel = document.getElementById('debug-panel');
    if (!panel) return;
    
    const info = `
        === DEBUG INFO ===
        Tela: ${state.currentScreen}
        IP: ${state.userIP || 'Carregando...'}
        Tentativas: ${state.passwordAttempts}
        Código: ${state.verificationCode ? 'Gerado' : 'Não gerado'}
        Banido: ${state.isBanned ? 'Sim' : 'Não'}
        Token: ${localStorage.getItem('diario_auth') ? 'Sim' : 'Não'}
        =================
    `;
    
    panel.innerHTML = info.replace(/\n/g, '<br>');
}

function setupElements() {
    console.log('🔍 Procurando elementos...');
    
    // Configurar tempo atual
    updateClock();
    setInterval(updateClock, 1000);
    
    // Configurar visibilidade da senha
    if (elements.togglePassword) {
        console.log('✅ Botão de visibilidade encontrado');
        elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    } else {
        console.warn('⚠️ Botão de visibilidade não encontrado');
    }
    
    // Configurar entrada do código
    setupCodeInputs();
    
    // Verificar elementos críticos
    checkCriticalElements();
}

function checkCriticalElements() {
    const criticalElements = [
        'login-btn', 'username', 'password', 
        'verify-btn', 'code-digit', 'login-screen'
    ];
    
    console.log('🔍 Verificando elementos críticos:');
    criticalElements.forEach(id => {
        const element = document.getElementById(id) || document.querySelector(`.${id}`);
        console.log(`${id}:`, element ? '✅' : '❌');
    });
}

function setupEventListeners() {
    console.log('🎮 Configurando eventos...');
    
    // Botão de login
    if (elements.loginBtn) {
        console.log('✅ Botão de login configurado');
        elements.loginBtn.addEventListener('click', handleLogin);
    } else {
        console.error('❌ Botão de login não encontrado!');
        // Criar botão de fallback
        createFallbackLoginButton();
    }
    
    // Enter no login
    if (elements.passwordInput) {
        elements.passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('↵ Enter pressionado no campo de senha');
                handleLogin();
            }
        });
    }
    
    // Botão de verificação
    if (elements.verifyBtn) {
        elements.verifyBtn.addEventListener('click', handleVerification);
    }
    
    // Botão de voltar
    if (elements.backBtn) {
        elements.backBtn.addEventListener('click', () => {
            console.log('↩ Voltando para login');
            showScreen('login');
        });
    }
    
    // Botão de reenviar código
    if (elements.resendBtn) {
        elements.resendBtn.addEventListener('click', resendVerificationCode);
    }
    
    // Auto-focus no username
    if (elements.usernameInput) {
        setTimeout(() => {
            elements.usernameInput.focus();
        }, 1000);
    }
}

function createFallbackLoginButton() {
    console.log('🔧 Criando botão de login fallback...');
    
    const fallbackBtn = document.createElement('button');
    fallbackBtn.textContent = 'LOGIN (Fallback)';
    fallbackBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff0055;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
    `;
    
    fallbackBtn.onclick = handleLogin;
    document.body.appendChild(fallbackBtn);
}

async function initializeFeatures() {
    console.log('⚡ Inicializando funcionalidades...');
    
    // Obter IP do usuário
    await getUserIP();
    
    // Criar partículas
    createParticles();
    
    // Animar elementos
    animateElements();
    
    // Criar token de teste se não existir
    ensureTestToken();
}

function ensureTestToken() {
    // Remover tokens antigos para teste
    // localStorage.removeItem('diario_auth');
    // localStorage.removeItem('diario_login_time');
}

// ANIMAÇÕES E EFEITOS VISUAIS
function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) {
        console.warn('⚠️ Container de partículas não encontrado');
        return;
    }
    
    console.log('✨ Criando partículas...');
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.5 ? '#ff0055' : '#00a8ff'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.2 + 0.1};
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
        console.log('🌐 Obtendo IP do usuário...');
        
        // Primeiro tente com timeout curto
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        
        const ipPromise = fetch('https://api.ipify.org?format=json');
        
        const response = await Promise.race([ipPromise, timeoutPromise]);
        const data = await response.json();
        
        state.userIP = data.ip;
        console.log('✅ IP obtido:', state.userIP);
        
        if (elements.userIp) {
            elements.userIp.textContent = data.ip;
        }
        
        updateDebugInfo();
        
        return data.ip;
        
    } catch (error) {
        console.warn('⚠️ Erro ao obter IP:', error.message);
        
        // IP fallback
        state.userIP = '192.168.1.1 (Local)';
        
        if (elements.userIp) {
            elements.userIp.textContent = 'Local (Offline)';
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
    
    console.log(`👁️ Senha ${newType === 'text' ? 'visível' : 'oculta'}`);
}

function setupCodeInputs() {
    if (!elements.codeDigits || elements.codeDigits.length === 0) {
        console.warn('⚠️ Campos de código não encontrados');
        return;
    }
    
    console.log(`✅ ${elements.codeDigits.length} campos de código configurados`);
    
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
        
        console.log(`✅ Tela ${screenName} ativada`);
        
        // Executar ações específicas para cada tela
        switch(screenName) {
            case 'login':
                if (elements.usernameInput) {
                    setTimeout(() => {
                        elements.usernameInput.focus();
                    }, 300);
                }
                break;
            case 'verification':
                generateVerificationCode();
                startCodeTimer();
                resetCodeInputs();
                if (elements.codeDigits && elements.codeDigits[0]) {
                    setTimeout(() => {
                        elements.codeDigits[0].focus();
                    }, 300);
                }
                break;
            case 'banned':
                updateBanTimerDisplay();
                break;
            case 'transition':
                startTransition();
                break;
        }
        
        updateDebugInfo();
    } else {
        console.error(`❌ Tela ${screenName} não encontrada!`);
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
    
    console.log('Credenciais inseridas:', { 
        username, 
        passwordLength: password.length 
    });
    
    if (!username || !password) {
        console.log('❌ Campos vazios');
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
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
                username: username || 'vazio', 
                attemptsLeft: state.passwordAttempts 
            });
            
            if (state.passwordAttempts <= 0) {
                // Banir usuário
                console.log('⛔ Banindo usuário por tentativas excessivas');
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
        
        updateDebugInfo();
    }
}

// SISTEMA DE VERIFICAÇÃO
function generateVerificationCode() {
    state.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    state.codeExpiry = Date.now() + (5 * 60 * 1000); // 5 minutos
    
    console.log(`🔢 Código gerado: ${state.verificationCode}`);
    console.log(`⏰ Expira em: ${new Date(state.codeExpiry).toLocaleTimeString()}`);
    
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
    console.log('Código inserido:', enteredCode);
    
    if (enteredCode.length !== 6) {
        showError(elements.codeError, 'Código deve ter 6 dígitos');
        return;
    }
    
    if (!elements.verifyBtn) return;
    
    const originalText = elements.verifyBtn.innerHTML;
    elements.verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> VALIDANDO...';
    elements.verifyBtn.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
            console.log('⛔ Banindo por códigos incorretos');
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
    
    console.log('🔄 Reenviando código...');
    
    const originalText = elements.resendBtn.innerHTML;
    elements.resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
    elements.resendBtn.disabled = true;
    
    generateVerificationCode();
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    elements.resendBtn.innerHTML = originalText;
    elements.resendBtn.disabled = false;
    
    showError(elements.codeError, '✅ Novo código enviado!');
}

// SISTEMA DE BANIMENTO
function banUser() {
    console.log('⛔ Banindo usuário...');
    
    state.isBanned = true;
    state.banEndTime = Date.now() + (CONFIG.BAN_TIME_MINUTES * 60 * 1000);
    
    // Salvar no localStorage
    localStorage.setItem('diario_ban_end', state.banEndTime);
    localStorage.setItem('diario_ban_ip', state.userIP || 'unknown');
    
    console.log(`⏰ Banido até: ${new Date(state.banEndTime).toLocaleTimeString()}`);
    
    // Enviar notificação
    sendWebhookNotification('user_banned', { 
        reason: 'Tentativas excessivas',
        banTime: CONFIG.BAN_TIME_MINUTES 
    });
    
    // Mostrar tela de banimento
    showScreen('banned');
}

function checkBanStatus() {
    console.log('🔍 Verificando status de banimento...');
    
    const banEnd = localStorage.getItem('diario_ban_end');
    const banIP = localStorage.getItem('diario_ban_ip');
    
    if (banEnd && banIP) {
        const now = Date.now();
        const banEndTime = parseInt(banEnd);
        
        console.log('Ban encontrado:', {
            banEndTime: new Date(banEndTime).toLocaleString(),
            banIP,
            userIP: state.userIP
        });
        
        if (now < banEndTime && (banIP === state.userIP || banIP === 'unknown')) {
            state.isBanned = true;
            state.banEndTime = banEndTime;
            showScreen('banned');
            return true;
        } else {
            // Remover banimento expirado
            console.log('Banimento expirado ou IP diferente, removendo...');
            localStorage.removeItem('diario_ban_end');
            localStorage.removeItem('diario_ban_ip');
        }
    } else {
        console.log('Nenhum banimento ativo');
    }
    
    return false;
}

function updateBanTimerDisplay() {
    if (!state.isBanned || !state.banEndTime) return;
    
    console.log('⏱️ Iniciando timer de banimento...');
    
    const updateTimer = () => {
        const now = Date.now();
        const timeLeft = state.banEndTime - now;
        
        if (timeLeft <= 0) {
            // Desbanir usuário
            console.log('✅ Banimento expirado!');
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
    console.log('🚀 Iniciando transição para o diário...');
    console.log('=== ETAPA 1: Preparando sistema ===');
    
    // 1. Criar token de autenticação
    console.log('🔐 Criando token de autenticação...');
    createAuthToken();
    
    // 2. Verificar se o token foi criado
    console.log('🔍 Verificando token...');
    const savedToken = localStorage.getItem('diario_auth');
    const loginTime = localStorage.getItem('diario_login_time');
    
    console.log('Token salvo:', savedToken ? '✅ Sim' : '❌ Não');
    console.log('Login time:', loginTime ? '✅ Sim' : '❌ Não');
    
    if (!savedToken) {
        console.error('❌ CRÍTICO: Token não foi criado!');
        console.log('Tentando criar novamente...');
        createAuthToken();
    }
    
    // 3. Mostrar progresso
    console.log('📊 Iniciando contagem regressiva...');
    
    let timeLeft = CONFIG.TRANSITION_TIME;
    let progress = 0;
    
    // Atualizar texto inicial
    if (elements.countdownTimer) {
        elements.countdownTimer.textContent = timeLeft;
    }
    
    const updateTransition = () => {
        console.log(`⏱️ Redirecionando em ${timeLeft} segundos...`);
        
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
            console.log('=== ETAPA FINAL: Redirecionando ===');
            console.log('🔗 Redirecionando para diario.html...');
            console.log('Token atual:', localStorage.getItem('diario_auth'));
            console.log('Login time:', localStorage.getItem('diario_login_time'));
            
            // Redirecionar para o diário
            window.location.href = 'diario.html';
        } else {
            setTimeout(updateTransition, 1000);
        }
    };
    
    updateTransition();
}

// Função para criar token de autenticação (CORRIGIDA)
function createAuthToken() {
    console.log('=== CRIANDO TOKEN DE AUTENTICAÇÃO ===');
    
    try {
        // 1. Criar dados do token
        const tokenData = {
            userId: 'ErikSlava',
            timestamp: Date.now(),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Expira em 24 horas
        };
        
        console.log('Dados do token:', tokenData);
        
        // 2. Codificar para base64
        const jsonString = JSON.stringify(tokenData);
        console.log('JSON string:', jsonString);
        
        const token = btoa(jsonString);
        console.log('Token codificado:', token);
        
        // 3. Verificar se pode decodificar
        const decoded = atob(token);
        console.log('Token decodificado:', decoded);
        
        // 4. Salvar no localStorage
        localStorage.setItem('diario_auth', token);
        localStorage.setItem('diario_login_time', Date.now().toString());
        
        console.log('✅ Token salvo com sucesso!');
        console.log('LocalStorage verificado:', {
            auth: localStorage.getItem('diario_auth') ? 'Presente' : 'Ausente',
            loginTime: localStorage.getItem('diario_login_time')
        });
        
        return token;
        
    } catch (error) {
        console.error('❌ ERRO ao criar token:', error);
        console.error('Mensagem:', error.message);
        
        // Fallback: token simples
        const fallbackToken = 'eyJ1c2VySWQiOiJFcmlrU2xhdmEiLCJ0aW1lc3RhbXAiOjE3MTcyODAwMDAwMDAsImV4cCI6MTcxNzM2NjQwMDAwMH0=';
        localStorage.setItem('diario_auth', fallbackToken);
        localStorage.setItem('diario_login_time', Date.now().toString());
        
        console.log('✅ Token fallback criado');
        return fallbackToken;
    }
}

// WEBHOOK NOTIFICATIONS
async function sendWebhookNotification(type, data) {
    try {
        console.log(`🌐 Enviando webhook: ${type}`);
        
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
        
        console.log('Payload:', payload);
        
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log(`Webhook ${type}: ${response.ok ? '✅ Enviado' : '❌ Falha'}`);
        return response.ok;
        
    } catch (error) {
        console.error('❌ Erro ao enviar webhook:', error);
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

function showSystemStatus() {
    console.log('=== STATUS DO SISTEMA ===');
    console.log('Usuário:', CONFIG.USERNAME);
    console.log('Senha configurada:', CONFIG.PASSWORD ? 'Sim' : 'Não');
    console.log('Webhook:', CONFIG.WEBHOOK_URL.substring(0, 30) + '...');
    console.log('IP do usuário:', state.userIP);
    console.log('Token salvo:', localStorage.getItem('diario_auth') ? 'Sim' : 'Não');
    console.log('====================');
}

// Função de teste para verificar autenticação
window.testAuth = function() {
    console.log('=== TESTE DE AUTENTICAÇÃO ===');
    console.log('1. Criando token...');
    createAuthToken();
    
    console.log('2. Verificando localStorage...');
    console.log('diario_auth:', localStorage.getItem('diario_auth'));
    console.log('diario_login_time:', localStorage.getItem('diario_login_time'));
    
    console.log('3. Testando decodificação...');
    try {
        const token = localStorage.getItem('diario_auth');
        if (token) {
            const decoded = atob(token);
            console.log('Token decodificado:', decoded);
            const data = JSON.parse(decoded);
            console.log('Dados do token:', data);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
    
    console.log('=== FIM DO TESTE ===');
};

// Adicionar botão de teste manual
document.addEventListener('DOMContentLoaded', function() {
    // Botão de teste manual (apenas para desenvolvimento)
    const testBtn = document.createElement('button');
    testBtn.textContent = '🔧 Testar Auth';
    testBtn.style.cssText = `
        position: fixed;
        bottom: 60px;
        left: 10px;
        background: #00a8ff;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9998;
        font-size: 12px;
        opacity: 0.3;
        transition: opacity 0.3s;
    `;
    
    testBtn.onmouseenter = () => testBtn.style.opacity = '1';
    testBtn.onmouseleave = () => testBtn.style.opacity = '0.3';
    testBtn.onclick = window.testAuth;
    
    document.body.appendChild(testBtn);
});

// ⬇⬇⬇ ESTA PARTE DEVE SER A ÚLTIMA DO ARQUIVO ⬇⬇⬇
// Inicializar quando a página carregar
window.addEventListener('load', function() {
    console.log('📖 Sistema do Diário Pessoal carregado!');
    console.log('👤 Usuário configurado:', CONFIG.USERNAME);
    console.log('🔗 Webhook:', CONFIG.WEBHOOK_URL.substring(0, 30) + '...');
    
    // Adicionar atalhos de teclado para debug
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D para debug
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            window.testAuth();
        }
        
        // Ctrl+Shift+L para simular login
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            console.log('🔧 Simulando login...');
            if (elements.usernameInput) elements.usernameInput.value = CONFIG.USERNAME;
            if (elements.passwordInput) elements.passwordInput.value = CONFIG.PASSWORD;
            handleLogin();
        }
    });
});
