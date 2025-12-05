// Sistema do Diário Pessoal
class DiarioSystem {
    constructor() {
        this.entries = [];
        this.currentEntry = null;
        this.filter = 'all';
        
        this.initialize();
    }
    
    initialize() {
        // Verificar autenticação
        this.checkAuth();
        
        // Carregar dados
        this.loadData();
        
        // Configurar interface
        this.setupUI();
        
        // Atualizar estatísticas
        this.updateStats();
        
        console.log('📖 Diário inicializado!');
    }
    
    checkAuth() {
        // Verificar se o usuário está autenticado
        const authToken = localStorage.getItem('diario_auth');
        if (!authToken) {
            window.location.href = 'index.html';
            return;
        }
        
        // Verificar expiração do token
        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        if (Date.now() > tokenData.exp * 1000) {
            localStorage.removeItem('diario_auth');
            window.location.href = 'index.html';
        }
    }
    
    loadData() {
        // Carregar entradas do localStorage
        const savedEntries = localStorage.getItem('diario_entries');
        if (savedEntries) {
            this.entries = JSON.parse(savedEntries);
        }
        
        // Carregar configurações do usuário
        const userSettings = localStorage.getItem('diario_settings');
        if (userSettings) {
            this.settings = JSON.parse(userSettings);
        }
    }
    
    saveData() {
        // Salvar entradas no localStorage
        localStorage.setItem('diario_entries', JSON.stringify(this.entries));
        
        // Atualizar estatísticas
        this.updateStats();
    }
    
    setupUI() {
        // Configurar data atual
        this.updateDate();
        
        // Configurar idade do usuário
        this.updateAge();
        
        // Configurar eventos
        this.setupEvents();
        
        // Carregar entradas
        this.loadEntries();
    }
    
    updateDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('pt-BR', options);
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
        }
    }
    
    setupEvents() {
        // Formulário de nova entrada
        const entryForm = document.getElementById('entry-form');
        if (entryForm) {
            entryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEntry();
            });
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
        
        // Atualizar data a cada minuto
        setInterval(() => {
            this.updateDate();
        }, 60000);
    }
    
    saveEntry() {
        const title = document.getElementById('entry-title').value.trim();
        const topic = document.getElementById('entry-topic').value;
        const content = document.getElementById('entry-content').value.trim();
        
        if (!title || !topic || !content) {
            this.showNotification('Preencha todos os campos!', 'error');
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
        
        // Adicionar à lista
        this.entries.unshift(entry);
        
        // Salvar dados
        this.saveData();
        
        // Atualizar interface
        this.loadEntries();
        
        // Limpar formulário
        this.clearForm();
        
        // Mostrar notificação
        this.showNotification('Entrada salva com sucesso!', 'success');
        
        // Enviar notificação para webhook
        this.sendWebhookNotification('new_entry', { title, topic });
    }
    
    clearForm() {
        document.getElementById('entry-form').reset();
        document.getElementById('entry-title').focus();
    }
    
    loadEntries() {
        const entriesList = document.getElementById('entries-list');
        if (!entriesList) return;
        
        // Filtrar entradas
        let filteredEntries = this.entries;
        if (this.filter !== 'all') {
            filteredEntries = this.entries.filter(entry => entry.topic === this.filter);
        }
        
        if (filteredEntries.length === 0) {
            entriesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>Nenhuma entrada encontrada</h3>
                    <p>${this.filter === 'all' ? 'Comece escrevendo sua primeira entrada!' : 'Nenhuma entrada neste tópico.'}</p>
                </div>
            `;
            return;
        }
        
        // Gerar HTML das entradas
        entriesList.innerHTML = filteredEntries.map(entry => `
            <div class="entrada-card" data-id="${entry.id}">
                <div class="entrada-header">
                    <h3 class="entrada-titulo">${entry.title}</h3>
                    <span class="entrada-data">${entry.createdAt}</span>
                </div>
                <div class="entrada-conteudo">
                    ${entry.content.length > 200 ? entry.content.substring(0, 200) + '...' : entry.content}
                </div>
                <div class="entrada-footer">
                    <span class="entrada-topico">${entry.topic}</span>
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
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.view-entry').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.viewEntry(id);
            });
        });
        
        document.querySelectorAll('.edit-entry').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.editEntry(id);
            });
        });
    }
    
    viewEntry(id) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;
        
        this.currentEntry = entry;
        
        // Preencher modal
        document.getElementById('modal-title').textContent = entry.title;
        document.getElementById('modal-date').textContent = entry.createdAtFull;
        document.getElementById('modal-topic').textContent = entry.topic;
        document.getElementById('modal-content').textContent = entry.content;
        
        // Mostrar modal
        document.getElementById('entry-modal').classList.add('active');
    }
    
    editEntry(id) {
        if (!id && this.currentEntry) {
            id = this.currentEntry.id;
        }
        
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;
        
        // Preencher formulário
        document.getElementById('entry-title').value = entry.title;
        document.getElementById('entry-topic').value = entry.topic;
        document.getElementById('entry-content').value = entry.content;
        
        // Fechar modal se estiver aberto
        this.closeModal();
        
        // Focar no título
        document.getElementById('entry-title').focus();
        
        // Remover entrada da lista (será salva novamente)
        const index = this.entries.findIndex(e => e.id === id);
        if (index !== -1) {
            this.entries.splice(index, 1);
            this.saveData();
            this.loadEntries();
        }
    }
    
    deleteEntry() {
        if (!this.currentEntry) return;
        
        if (confirm('Tem certeza que deseja excluir esta entrada?')) {
            const index = this.entries.findIndex(e => e.id === this.currentEntry.id);
            if (index !== -1) {
                this.entries.splice(index, 1);
                this.saveData();
                this.loadEntries();
                this.closeModal();
                this.showNotification('Entrada excluída com sucesso!', 'success');
                
                // Enviar notificação para webhook
                this.sendWebhookNotification('delete_entry', { 
                    title: this.currentEntry.title 
                });
            }
        }
    }
    
    closeModal() {
        document.getElementById('entry-modal').classList.remove('active');
        this.currentEntry = null;
    }
    
    setFilter(filter) {
        this.filter = filter;
        this.loadEntries();
    }
    
    updateStats() {
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
            const dates = this.entries.map(entry => new Date(entry.date).toDateString());
            const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
            
            for (let i = 0; i < uniqueDates.length; i++) {
                const currentDate = new Date(uniqueDates[i]);
                const expectedDate = new Date();
                expectedDate.setDate(expectedDate.getDate() - i);
                
                if (currentDate.toDateString() === expectedDate.toDateString()) {
                    streak++;
                } else {
                    break;
                }
            }
            
            streakDays.textContent = streak;
        }
    }
    
    logout() {
        if (confirm('Deseja realmente sair do diário?')) {
            localStorage.removeItem('diario_auth');
            window.location.href = 'index.html';
        }
    }
    
    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)'};
            border: 1px solid ${type === 'success' ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 0, 85, 0.3)'};
            color: ${type === 'success' ? '#00ff88' : '#ff0055'};
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
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
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async sendWebhookNotification(type, data) {
        try {
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
            
            return response.ok;
        } catch (error) {
            console.error('Erro ao enviar webhook:', error);
            return false;
        }
    }
}

// Inicializar sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.diario = new DiarioSystem();
});
