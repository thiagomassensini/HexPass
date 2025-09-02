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
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s;
        `;
        
        button.onmouseover = () => {
            button.style.background = '#5a67d8';
            button.style.transform = 'translateY(-50%) scale(1.1)';
        };
        
        button.onmouseout = () => {
            button.style.background = '#667eea';
            button.style.transform = 'translateY(-50%) scale(1)';
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
            
            // Posiciona o campo relativamente se necessário
            const computedStyle = window.getComputedStyle(field);
            if (computedStyle.position === 'static') {
                field.style.position = 'relative';
            }
            
            // Adiciona padding à direita para o botão
            const currentPadding = parseInt(computedStyle.paddingRight) || 0;
            field.style.paddingRight = Math.max(40, currentPadding + 35) + 'px';
            
            // Cria e adiciona o botão
            const button = createGenerateButton();
            field.parentNode.insertBefore(button, field.nextSibling);
            
            // Posiciona o botão
            const fieldRect = field.getBoundingClientRect();
            const parentRect = field.parentNode.getBoundingClientRect();
            
            button.style.position = 'absolute';
            button.style.left = (fieldRect.right - parentRect.left - 35) + 'px';
            button.style.top = (fieldRect.top - parentRect.top + (fieldRect.height - 30) / 2) + 'px';
            
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
                
                // Feedback visual
                field.style.backgroundColor = '#e6fffa';
                field.style.border = '2px solid #38b2ac';
                
                // Restaura após 2 segundos
                setTimeout(() => {
                    field.type = 'password';
                    field.style.backgroundColor = '';
                    field.style.border = '';
                }, 2000);
                
                // Dispara eventos para frameworks
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
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
