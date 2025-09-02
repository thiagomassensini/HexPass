// Content script para detectar campos de senha e oferecer geração automática
(function() {
    'use strict';
    
    let isExtensionActive = false;
    
    // Detecta campos de senha na página
    function findPasswordFields() {
        const passwordSelectors = [
            'input[type="password"]',
            'input[name*="password"]',
            'input[name*="passwd"]',
            'input[name*="pwd"]',
            'input[id*="password"]',
            'input[id*="passwd"]',
            'input[id*="pwd"]'
        ];
        
        const fields = [];
        passwordSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!fields.includes(el)) {
                    fields.push(el);
                }
            });
        });
        
        return fields;
    }
    
    // Cria botão para gerar senha
    function createGenerateButton() {
        const button = document.createElement('button');
        button.innerHTML = '🔐';
        button.title = 'Gerar senha segura com HexPass';
        button.style.cssText = `
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            width: 28px;
            height: 28px;
            cursor: pointer;
            font-size: 12px;
            z-index: 99999;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            min-height: 28px;
            flex-shrink: 0;
        `;
        
        button.onmouseover = () => {
            button.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
            button.style.transform = 'translateY(-50%) scale(1.05)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        };
        
        button.onmouseout = () => {
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            button.style.transform = 'translateY(-50%) scale(1)';
            button.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        };
        
        return button;
    }
    
    // Adiciona botão aos campos de senha
    function addGenerateButtons() {
        const passwordFields = findPasswordFields();
        
        passwordFields.forEach(field => {
            // Verifica se já tem botão
            if (field.dataset.hexpassButton) return;
            
            // Marca o campo
            field.dataset.hexpassButton = 'true';
            
            // Garantir que o container do campo permite posicionamento absoluto
            let container = field.parentNode;
            const containerStyle = window.getComputedStyle(container);
            if (containerStyle.position === 'static') {
                container.style.position = 'relative';
            }
            
            // Adiciona padding à direita para o botão com mais espaço
            const fieldStyle = window.getComputedStyle(field);
            const currentPadding = parseInt(fieldStyle.paddingRight) || 0;
            field.style.paddingRight = Math.max(45, currentPadding + 40) + 'px';
            
            // Cria e adiciona o botão
            const button = createGenerateButton();
            
            // Adiciona o botão ao container do campo
            container.appendChild(button);
            
            // Posicionamento melhorado
            setTimeout(() => {
                const fieldRect = field.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                // Calcula posição relativa ao container
                const leftPos = fieldRect.right - containerRect.left - 36;
                const topPos = fieldRect.top - containerRect.top + (fieldRect.height - 28) / 2;
                
                button.style.left = leftPos + 'px';
                button.style.top = topPos + 'px';
            }, 10);
            
            // Adiciona evento de clique
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                generatePasswordForField(field);
            });
        });
    }
    
    // Gera senha para um campo específico
    function generatePasswordForField(field) {
        chrome.runtime.sendMessage({action: 'generatePassword'}, (response) => {
            if (response && response.password) {
                field.value = response.password;
                field.type = 'text'; // Mostra a senha temporariamente
                
                // Copia automaticamente para a área de transferência
                copyToClipboard(response.password);
                
                // Feedback visual melhorado
                field.style.backgroundColor = '#e6fffa';
                field.style.border = '2px solid #38b2ac';
                field.style.boxShadow = '0 0 0 3px rgba(56, 178, 172, 0.1)';
                
                // Mostra notificação de cópia
                showCopyNotification(field);
                
                // Restaura após 2 segundos
                setTimeout(() => {
                    field.type = 'password';
                    field.style.backgroundColor = '';
                    field.style.border = '';
                    field.style.boxShadow = '';
                }, 2000);
                
                // Dispara eventos para frameworks
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
    
    // Função para copiar para área de transferência
    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(err => {
                console.log('Erro ao copiar:', err);
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }
    
    // Fallback para navegadores sem suporte a Clipboard API
    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
    
    // Mostra notificação de que a senha foi copiada
    function showCopyNotification(field) {
        const notification = document.createElement('div');
        notification.textContent = '✓ Senha copiada!';
        notification.style.cssText = `
            position: absolute;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            z-index: 100000;
            box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
            animation: slideInFromTop 0.3s ease-out;
            white-space: nowrap;
            pointer-events: none;
        `;
        
        // Adiciona animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInFromTop {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        if (!document.querySelector('#hexpass-animations')) {
            style.id = 'hexpass-animations';
            document.head.appendChild(style);
        }
        
        // Posiciona a notificação
        const fieldRect = field.getBoundingClientRect();
        notification.style.top = (fieldRect.top - 40) + 'px';
        notification.style.left = fieldRect.left + 'px';
        
        document.body.appendChild(notification);
        
        // Remove após 2 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
    
    // Observer para detectar novos campos dinamicamente
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'INPUT' || node.querySelector('input')) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        
        if (shouldCheck) {
            setTimeout(addGenerateButtons, 100);
        }
    });
    
    // Inicia o observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Inicialização
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addGenerateButtons);
    } else {
        addGenerateButtons();
    }
    
    // Reaplica os botões quando a página muda (SPA)
    window.addEventListener('popstate', () => {
        setTimeout(addGenerateButtons, 500);
    });
    
    // Monitora mudanças na URL para SPAs
    let currentUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            setTimeout(addGenerateButtons, 1000);
        }
    }).observe(document, {subtree: true, childList: true});
    
})();
