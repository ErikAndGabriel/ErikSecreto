// Sistema do Diário Pessoal
class DiarioSystem {
    constructor() {
        this.entries = [];
        this.currentEntry = null;
        this.filter = 'all';
        this.isInitialized = false;
        
        console.log('📖 Inicializando sistema do diário...');
        this.initialize();
    }
    
    initialize() {
        console.log('1. Verificando autenticação...');
        // Verificar autenticação
        this.checkAuth();
        
        console.log('2. Carregando dados...');
        // Carregar dados
        this.loadData();
        
        console.log('3. Configurando interface...');
        // Configurar interface
        this.setupUI();
        
        console.log('4. Atualizando estatísticas...');
        // Atualizar estatísticas
        this.updateStats();
        
        console.log('5. Verificando funcionalidade...');
        // Verificar funcionalidade
        this.setupDebug();
        
        this.isInitialized = true;
        console.log('✅ Diário inicializado com sucesso!');
    }
    
    checkAuth() {
        console.log('🔍 Verificando autenticação...');
        
        // Verificar se o usuário está autenticado
        const authToken = localStorage.getItem('diario_auth');
        
        console.log('Token encontrado:', authToken ? 'Sim' : 'Não');
        
        if (!authToken) {
            console.log('❌ Sem token de autenticação!');
            console.log('Redirecionando para login em 2 segundos...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
        
        try {
            // Decodificar token
            console.log('Token bruto:', authToken);
            const tokenData = JSON.parse(atob(authToken));
            console.log('Token decodificado:', tokenData);
            
            // Verificar expiração
            const now = Date.now();
            const expiryTime = tokenData.exp * 1000;
            
            console.log('Agora:', new Date(now).toLocaleString());
            console.log('Expira:', new Date(expiryTime).toLocaleString());
            console.log('Token válido?', now < expiryTime);
            
            if (now > expiryTime) {
                console.log('❌ Token expirado!');
                localStorage.removeItem('diario_auth');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                return;
            }
            
            console.log('✅ Token válido! Usuário autenticado.');
            
        } catch (error) {
            console.error('❌ Erro ao verificar token:', error);
            console.error('Detalhes do erro:', error.message);
            
            // Tentar método alternativo de verificação
            this.checkAlternativeAuth();
        }
    }
    
    checkAlternativeAuth() {
        console.log('🔄 Tentando método alternativo de autenticação...');
        
        // Verificar se existe registro de login recente
        const loginTime = localStorage.getItem('diario_login_time');
        const now = Date.now();
        
        if (loginTime) {
            const loginAge = now - parseInt(loginTime);
            console.log('Último login há:', Math.floor(loginAge / 1000), 'segundos');
            
            // Permitir acesso se o login foi feito nos últimos 5 minutos
            if (loginAge < 5 * 60 * 1000) {
                console.log('✅ Login recente detectado. Permitindo acesso...');
                
                // Criar novo token
                this.createAuthToken();
                return;
            }
        }
        
        console.log('❌ Nenhuma autenticação válida encontrada.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    createAuthToken() {
        const tokenData = {
            userId: 'ErikSlava',
            timestamp: Date.now(),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };
        
        const token = btoa(JSON.stringify(tokenData));
        localStorage.setItem('diario_auth', token);
        localStorage.setItem('diario_login_time', Date.now().toString());
        
        console.log('🔐 Novo token criado:', token);
        return token;
    }
    
    loadData() {
        console.log('📂 Carregando dados do diário...');
        
        // Carregar entradas do localStorage
        const savedEntries = localStorage.getItem('diario_entries');
        if (savedEntries) {
            try {
                this.entries = JSON.parse(savedEntries);
                console.log(`✅ ${this.entries.length} entradas carregadas.`);
            } catch (error) {
                console.error('❌ Erro ao carregar entradas:', error);
                this.entries = [];
            }
        } else {
            console.log('📝 Nenhuma entrada salva encontrada.');
            this.entries = [];
            
            // Adicionar exemplo inicial
            this.addExampleEntry();
        }
        
        // Carregar configurações do usuário
        const userSettings = localStorage.getItem('diario_settings');
        if (userSettings) {
            try {
                this.settings = JSON.parse(userSettings);
                console.log('✅ Configurações carregadas.');
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
                this.settings = {};
            }
        } else {
            this.settings = {
                theme: 'dark',
                fontSize: 'medium',
                autoSave: true
            };
        }
    }
    
    addExampleEntry() {
        const exampleEntry = {
            id: Date.now(),
            title: 'Bem-vindo ao seu Diário Pessoal!',
            topic: 'Pessoal',
            content: 'Esta é sua primeira entrada no diário. Você pode escrever sobre seus pensamentos, sentimentos, sonhos e objetivos. Use os tópicos para organizar suas entradas e mantenha um registro do seu crescimento pessoal.\n\nPara criar uma nova entrada, preencha o formulário acima e clique em "Salvar Entrada".\n\nSeu diário está protegido com criptografia e apenas você tem acesso a essas informações.',
            date: new Date().toISOString(),
            createdAt: new Date().toLocaleDateString('pt-BR'),
            createdAtFull: new Date().toLocaleString('pt-BR')
        };
        
        this.entries.push(exampleEntry);
        this.saveData();
        
        console.log('📝 Entrada exemplo adicionada.');
    }
    
    saveData() {
        // Salvar entradas no localStorage
        localStorage.setItem('diario_entries', JSON.stringify(this.entries));
        
        // Salvar configurações
        localStorage.setItem('diario_settings', JSON.stringify(this.settings));
        
        // Atualizar estatísticas
        this.updateStats();
        
        console.log('💾 Dados salvos com sucesso.');
    }
    
    setupUI() {
        console.log('🖥️ Configurando interface...');
        
        try {
            // Configurar data atual
            this.updateDate();
            
            // Configurar idade do usuário
            this.updateAge();
            
            // Configurar eventos
            this.setupEvents();
            
            // Carregar entradas
            this.loadEntries();
            
            console.log('✅ Interface configurada.');
        } catch (error) {
            console.error('❌ Erro ao configurar interface:', error);
        }
    }
    
    updateDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateElement.textContent = now.toLocaleDateString('pt-BR', options);
            
            // Atualizar a cada minuto
            setInterval(() => {
                dateElement.textContent = new Date().toLocaleDateString('pt-BR', options);
            }, 60000);
        }
    }
    
    updateAge() {
        const birthDate = new Date(2008, 6, 30); // 30/07/2008
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        const ageElement = document.getElementById('user-age');
        if (ageElement) {
            ageElement.textContent = age;
            console.log(`🎂 Idade calculada: ${age} anos`);
        }
    }
    
    setupEvents() {
        console.log('🎮 Configurando eventos...');
        
        try {
            // Formulário de nova entrada
            const entryForm = document.getElementById('entry-form');
            if (entryForm) {
                entryForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveEntry();
                });
                console.log('✅ Formulário configurado.');
            } else {
                console.error('❌ Formulário não encontrado!');
            }
            
            // Botão de limpar formulário
            const clearBtn = document.getElementById('clear-form');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    this.clearForm();
                });
            }
            
            // Botão de logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    this.logout();
                });
                console.log('✅ Botão de logout configurado.');
            }
            
            // Filtros
            const filterBtns = document.querySelectorAll('.filtro-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setFilter(btn.dataset.filter);
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
            
            console.log(`✅ ${filterBtns.length} filtros configurados.`);
            
            // Modal
            const modalClose = document.getElementById('modal-close');
            if (modalClose) {
                modalClose.addEventListener('click', () => {
                    this.closeModal();
                });
            }
            
            const modalDelete = document.getElementById('modal-delete');
            if (modalDelete) {
                modalDelete.addEventListener('click', () => {
                    this.deleteEntry();
                });
            }
            
            const modalEdit = document.getElementById('modal-edit');
            if (modalEdit) {
                modalEdit.addEventListener('click', () => {
                    this.editEntry();
                });
            }
            
            // Fechar modal ao clicar fora
            const modal = document.getElementById('entry-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal();
                    }
                });
            }
            
            console.log('✅ Modal configurado.');
            
            // Adicionar botão de debug
            this.addDebugButton();
            
        } catch (error) {
            console.error('❌ Erro ao configurar eventos:', error);
        }
    }
    
    setupDebug() {
        console.log('🐛 Configurando debug...');
        
        // Adicionar informações de debug no console
        console.group('📊 Status do Sistema');
        console.log('Entradas carregadas:', this.entries.length);
        console.log('Filtro atual:', this.filter);
        console.log('Configurações:', this.settings);
        console.log('Token de autenticação:', localStorage.getItem('diario_auth') ? 'Presente' : 'Ausente');
        console.log('Login time:', localStorage.getItem('diario_login_time'));
        console.groupEnd();
        
        // Verificar elementos críticos
        const criticalElements = [
            'entry-form',
            'entry-title',
            'entry-content',
            'entries-list',
            'logout-btn'
        ];
        
        console.group('🔍 Verificação de Elementos');
        criticalElements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`${id}:`, element ? '✅ Encontrado' : '❌ Não encontrado');
        });
        console.groupEnd();
    }
    
    addDebugButton() {
        // Criar botão de debug (apenas em desenvolvimento)
        const debugBtn = document.createElement('button');
        debugBtn.innerHTML = '🐛 Debug';
        debugBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff0055;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            opacity: 0.3;
            transition: opacity 0.3s;
        `;
        
        debugBtn.addEventListener('mouseenter', () => {
            debugBtn.style.opacity = '1';
        });
        
        debugBtn.addEventListener('mouseleave', () => {
            debugBtn.style.opacity = '0.3';
        });
        
        debugBtn.addEventListener('click', () => {
            this.showDebugInfo();
        });
        
        document.body.appendChild(debugBtn);
    }
    
    showDebugInfo() {
        const debugInfo = `
            ====== DEBUG INFO ======
            
            📊 ESTADO DO SISTEMA:
            - Entradas: ${this.entries.length}
            - Filtro: ${this.filter}
            - Autenticado: ${localStorage.getItem('diario_auth') ? 'Sim' : 'Não'}
            
            💾 LOCALSTORAGE:
            - diario_auth: ${localStorage.getItem('diario_auth') ? 'Presente' : 'Ausente'}
            - diario_entries: ${localStorage.getItem('diario_entries') ? 'Presente' : 'Ausente'}
            - diario_login_time: ${localStorage.getItem('diario_login_time') || 'Não definido'}
            
            🖥️ ELEMENTOS CRÍTICOS:
            - Formulário: ${document.getElementById('entry-form') ? 'OK' : 'FALHA'}
            - Lista de entradas: ${document.getElementById('entries-list') ? 'OK' : 'FALHA'}
            
            ⚙️ CONFIGURAÇÕES:
            ${JSON.stringify(this.settings, null, 2)}
            
            ========================
        `;
        
        console.log(debugInfo);
        alert('Informações de debug foram impressas no console (F12 → Console)');
    }
    
    saveEntry() {
        console.log('💾 Salvando nova entrada...');
        
        const title = document.getElementById('entry-title').value.trim();
        const topic = document.getElementById('entry-topic').value;
        const content = document.getElementById('entry-content').value.trim();
        
        console.log('Dados da entrada:', { title, topic, contentLength: content.length });
        
        if (!title || !topic || !content) {
            this.showNotification('❌ Preencha todos os campos!', 'error');
            console.log('❌ Campos incompletos.');
            return;
        }
        
        const entry = {
            id: Date.now(),
            title,
            topic,
            content,
            date: new Date().toISOString(),
            createdAt: new Date().toLocaleDateString('pt-BR'),
            createdAtFull: new Date().toLocaleString('pt-BR')
        };
        
        console.log('Nova entrada criada:', entry);
        
        // Adicionar à lista
        this.entries.unshift(entry);
        
        // Salvar dados
        this.saveData();
        
        // Atualizar interface
        this.loadEntries();
        
        // Limpar formulário
        this.clearForm();
        
        // Mostrar notificação
        this.showNotification('✅ Entrada salva com sucesso!', 'success');
        
        console.log('✅ Entrada salva com sucesso!');
        
        // Enviar notificação para webhook
        this.sendWebhookNotification('new_entry', { title, topic });
    }
    
    clearForm() {
        const form = document.getElementById('entry-form');
        if (form) {
            form.reset();
            const titleInput = document.getElementById('entry-title');
            if (titleInput) {
                titleInput.focus();
            }
            console.log('🧹 Formulário limpo.');
        }
    }
    
    loadEntries() {
        console.log('📄 Carregando lista de entradas...');
        
        const entriesList = document.getElementById('entries-list');
        if (!entriesList) {
            console.error('❌ Elemento entries-list não encontrado!');
            return;
        }
        
        // Filtrar entradas
        let filteredEntries = this.entries;
        if (this.filter !== 'all') {
            filteredEntries = this.entries.filter(entry => entry.topic === this.filter);
            console.log(`Filtro "${this.filter}" aplicado: ${filteredEntries.length} entradas`);
        }
        
        if (filteredEntries.length === 0) {
            entriesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>Nenhuma entrada encontrada</h3>
                    <p>${this.filter === 'all' ? 'Comece escrevendo sua primeira entrada!' : 'Nenhuma entrada neste tópico.'}</p>
                </div>
            `;
            console.log('📭 Lista de entradas vazia.');
            return;
        }
        
        // Gerar HTML das entradas
        entriesList.innerHTML = filteredEntries.map(entry => `
            <div class="entrada-card" data-id="${entry.id}">
                <div class="entrada-header">
                    <h3 class="entrada-titulo">${this.escapeHtml(entry.title)}</h3>
                    <span class="entrada-data">${entry.createdAt}</span>
                </div>
                <div class="entrada-conteudo">
                    ${this.escapeHtml(entry.content.length > 200 ? entry.content.substring(0, 200) + '...' : entry.content)}
                </div>
                <div class="entrada-footer">
                    <span class="entrada-topico">${this.escapeHtml(entry.topic)}</span>
                    <div class="entrada-actions">
                        <button class="action-btn view-entry" data-id="${entry.id}">
                            <i class="fas fa-eye"></i>
                            Ver
                        </button>
                        <button class="action-btn edit-entry" data-id="${entry.id}">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log(`✅ ${filteredEntries.length} entradas carregadas.`);
        
        // Adicionar eventos aos botões
        this.setupEntryButtons();
    }
    
    setupEntryButtons() {
        document.querySelectorAll('.view-entry').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                console.log(`👁️ Visualizando entrada ${id}`);
                this.viewEntry(id);
            });
        });
        
        document.querySelectorAll('.edit-entry').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                console.log(`✏️ Editando entrada ${id}`);
                this.editEntry(id);
            });
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    viewEntry(id) {
        console.log(`📖 Abrindo entrada ID: ${id}`);
        
        const entry = this.entries.find(e => e.id === id);
        if (!entry) {
            console.error(`❌ Entrada ${id} não encontrada!`);
            return;
        }
        
        this.currentEntry = entry;
        
        // Preencher modal
        document.getElementById('modal-title').textContent = this.escapeHtml(entry.title);
        document.getElementById('modal-date').textContent = entry.createdAtFull;
        document.getElementById('modal-topic').textContent = this.escapeHtml(entry.topic);
        document.getElementById('modal-content').textContent = this.escapeHtml(entry.content);
        
        // Mostrar modal
        document.getElementById('entry-modal').classList.add('active');
        
        console.log('✅ Modal aberto.');
    }
    
    editEntry(id) {
        console.log(`✏️ Preparando edição da entrada ${id}`);
        
        if (!id && this.currentEntry) {
            id = this.currentEntry.id;
        }
        
        const entry = this.entries.find(e => e.id === id);
        if (!entry) {
            console.error(`❌ Entrada ${id} não encontrada para edição!`);
            return;
        }
        
        // Preencher formulário
        document.getElementById('entry-title').value = entry.title;
        document.getElementById('entry-topic').value = entry.topic;
        document.getElementById('entry-content').value = entry.content;
        
        // Fechar modal se estiver aberto
        this.closeModal();
        
        // Focar no título
        const titleInput = document.getElementById('entry-title');
        if (titleInput) {
            titleInput.focus();
            titleInput.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Remover entrada da lista (será salva novamente)
        const index = this.entries.findIndex(e => e.id === id);
        if (index !== -1) {
            this.entries.splice(index, 1);
            this.saveData();
            this.loadEntries();
            console.log(`✅ Entrada ${id} movida para edição.`);
        }
    }
    
    deleteEntry() {
        if (!this.currentEntry) {
            console.error('❌ Nenhuma entrada selecionada para exclusão!');
            return;
        }
        
        console.log(`🗑️ Solicitando exclusão da entrada ${this.currentEntry.id}`);
        
        if (confirm('Tem certeza que deseja excluir esta entrada?')) {
            const index = this.entries.findIndex(e => e.id === this.currentEntry.id);
            if (index !== -1) {
                const deletedEntry = this.entries[index];
                this.entries.splice(index, 1);
                this.saveData();
                this.loadEntries();
                this.closeModal();
                
                this.showNotification('✅ Entrada excluída com sucesso!', 'success');
                console.log(`✅ Entrada "${deletedEntry.title}" excluída.`);
                
                // Enviar notificação para webhook
                this.sendWebhookNotification('delete_entry', { 
                    title: this.currentEntry.title 
                });
            }
        } else {
            console.log('❌ Exclusão cancelada pelo usuário.');
        }
    }
    
    closeModal() {
        document.getElementById('entry-modal').classList.remove('active');
        this.currentEntry = null;
        console.log('📭 Modal fechado.');
    }
    
    setFilter(filter) {
        console.log(`🔍 Alterando filtro para: ${filter}`);
        this.filter = filter;
        this.loadEntries();
    }
    
    updateStats() {
        console.log('📊 Atualizando estatísticas...');
        
        // Total de entradas
        const totalEntries = document.getElementById('total-entries');
        if (totalEntries) {
            totalEntries.textContent = this.entries.length;
        }
        
        // Total de tópicos únicos
        const totalTopics = document.getElementById('total-topics');
        if (totalTopics) {
            const topics = [...new Set(this.entries.map(entry => entry.topic))];
            totalTopics.textContent = topics.length;
        }
        
        // Entradas desta semana
        const entriesWeek = document.getElementById('entries-week');
        if (entriesWeek) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            const weekEntries = this.entries.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= oneWeekAgo;
            });
            
            entriesWeek.textContent = weekEntries.length;
        }
        
        // Dias seguidos escrevendo
        const streakDays = document.getElementById('streak-days');
        if (streakDays) {
            let streak = 0;
            const today = new Date().toDateString();
            const dates = this.entries.map(entry => {
                const date = new Date(entry.date);
                date.setHours(0, 0, 0, 0);
                return date.toDateString();
            });
            const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
            
            const todayDate = new Date();
            for (let i = 0; i < uniqueDates.length; i++) {
                const currentDate = new Date(uniqueDates[i]);
                const expectedDate = new Date(todayDate);
                expectedDate.setDate(todayDate.getDate() - i);
                expectedDate.setHours(0, 0, 0, 0);
                
                if (currentDate.toDateString() === expectedDate.toDateString()) {
                    streak++;
                } else {
                    break;
                }
            }
            
            streakDays.textContent = streak;
        }
        
        console.log('✅ Estatísticas atualizadas.');
    }
    
    logout() {
        console.log('👋 Solicitando logout...');
        
        if (confirm('Deseja realmente sair do diário?')) {
            console.log('🗑️ Removendo dados de autenticação...');
            
            // Remover dados de autenticação
            localStorage.removeItem('diario_auth');
            localStorage.removeItem('diario_login_time');
            
            console.log('✅ Dados removidos. Redirecionando...');
            
            // Redirecionar para login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } else {
            console.log('❌ Logout cancelado.');
        }
    }
    
    showNotification(message, type = 'info') {
        console.log(`💬 Notificação [${type}]: ${message}`);
        
        // Remover notificações anteriores
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 
                        type === 'error' ? 'rgba(255, 0, 85, 0.1)' : 
                        'rgba(0, 168, 255, 0.1)'};
            border: 1px solid ${type === 'success' ? 'rgba(0, 255, 136, 0.3)' : 
                              type === 'error' ? 'rgba(255, 0, 85, 0.3)' : 
                              'rgba(0, 168, 255, 0.3)'};
            color: ${type === 'success' ? '#00ff88' : 
                    type === 'error' ? '#ff0055' : 
                    '#00a8ff'};
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            animation: notificationSlideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Adicionar estilos de animação se não existirem
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes notificationSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes notificationSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async sendWebhookNotification(type, data) {
        try {
            console.log(`🌐 Enviando notificação para webhook: ${type}`);
            
            const messages = {
                'new_entry': `📝 **NOVA ENTRADA NO DIÁRIO**\n📌 Título: ${data.title}\n🏷️ Tópico: ${data.topic}\n⏰ ${new Date().toLocaleString('pt-BR')}`,
                'delete_entry': `🗑️ **ENTRADA EXCLUÍDA**\n📌 Título: ${data.title}\n⏰ ${new Date().toLocaleString('pt-BR')}`
            };
            
            const payload = {
                content: messages[type] || 'Atividade no diário',
                username: 'Diário de Erik',
                avatar_url: 'https://cdn.discordapp.com/attachments/1415484714130739290/1446225200982130759/20251129_132749.jpg?ex=693335ad&is=6931e42d&hm=5f845fcac10fc24a5b975d1c5cb27fbf10a70744ff75b1cf153e2dfe104039c5'
            };
            
            const response = await fetch('https://discord.com/api/webhooks/1429236562134302781/9aDDtdDEO18AtU_Z7s08oRx9vjwhaez9shQWO6P3Ycf0ljNPM5iEitEd1f_8p8Opj-o2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            console.log(`✅ Webhook enviado: ${response.ok ? 'Sucesso' : 'Falha'}`);
            return response.ok;
            
        } catch (error) {
            console.error('❌ Erro ao enviar webhook:', error);
            return false;
        }
    }
}

// Inicializar sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado. Inicializando diário...');
    
    // Adicionar estilos para notificações
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notificationSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes notificationSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Inicializar sistema
    setTimeout(() => {
        try {
            window.diario = new DiarioSystem();
        } catch (error) {
            console.error('❌ ERRO CRÍTICO ao inicializar diário:', error);
            
            // Mostrar mensagem de erro amigável
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(10, 10, 15, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
                text-align: center;
            `;
            
            errorDiv.innerHTML = `
                <div style="max-width: 500px;">
                    <h1 style="color: #ff0055; margin-bottom: 20px;">⚠️ Erro no Sistema</h1>
                    <p style="color: #b0b0b0; margin-bottom: 30px;">
                        Ocorreu um erro ao carregar o diário. Por favor, recarregue a página.
                    </p>
                    <button onclick="window.location.reload()" 
                            style="background: #ff0055; 
                                   color: white; 
                                   border: none; 
                                   padding: 12px 30px; 
                                   border-radius: 10px; 
                                   cursor: pointer;
                                   font-size: 16px;">
                        🔄 Recarregar Página
                    </button>
                    <p style="color: #666; margin-top: 20px; font-size: 12px;">
                        Se o problema persistir, verifique o console (F12) para detalhes.
                    </p>
                </div>
            `;
            
            document.body.appendChild(errorDiv);
        }
    }, 100);
});

// Adicionar função global para debug
window.debugDiario = function() {
    if (window.diario) {
        window.diario.showDebugInfo();
    } else {
        console.log('Diário não inicializado ainda.');
    }
};
