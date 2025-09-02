class PasswordGenerator {
    constructor() {
        this.init();
    }

    // Função helper para definir textContent de forma segura
    setTextContent(element, value) {
        try {
            if (element && typeof element.textContent !== 'undefined') {
                element.textContent = value;
                return true;
            }
        } catch (error) {
            console.warn('Erro ao definir textContent:', error);
        }
        return false;
    }

    // Função helper para verificar se um elemento existe e é válido
    isValidElement(element) {
        return element && element.nodeType === Node.ELEMENT_NODE;
    }

    init() {
        // Aguarda o DOM estar completamente carregado
        const initializeApp = () => {
            this.bindEvents();
            this.loadSettings();
            this.generatePassword();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeApp);
        } else {
            // DOM já está pronto, inicializa imediatamente
            initializeApp();
        }
    }

    bindEvents() {
        this.initializeElements();
    }
    
    initializeElements() {
        // Elementos do DOM com verificação robusta
        this.lengthSlider = document.getElementById('passwordLength');
        this.lengthDisplay = document.getElementById('lengthValue');
        this.generatedPassword = document.getElementById('generatedPassword');
        this.generateBtn = document.getElementById('generatePassword');
        this.copyBtn = document.getElementById('copyPassword');
        this.regenerateBtn = document.getElementById('regeneratePassword');

        // Checkboxes de inclusão
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');

        // Verificar se todos os elementos essenciais existem
        const essentialElements = {
            lengthSlider: this.lengthSlider,
            lengthDisplay: this.lengthDisplay,
            generatedPassword: this.generatedPassword
        };

        const missingElements = Object.entries(essentialElements)
            .filter(([name, element]) => !this.isValidElement(element))
            .map(([name]) => name);

        if (missingElements.length > 0) {
            console.error('Elementos essenciais não encontrados:', missingElements);
            return;
        }

        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Event listeners
        this.lengthSlider.addEventListener('input', (e) => {
            this.setTextContent(this.lengthDisplay, e.target.value);
            this.saveSettings();
            this.generatePassword();
        });

        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => {
                this.generatePassword();
            });
        }

        // Botão regenerar no header
        const headerRegenBtn = document.getElementById('headerRegenerate');
        if (headerRegenBtn) {
            headerRegenBtn.addEventListener('click', () => {
                this.generatePassword();
            });
        }

        if (this.regenerateBtn) {
            this.regenerateBtn.addEventListener('click', () => {
                this.generatePassword();
            });
        }

        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => {
                this.copyToClipboard();
            });
        }

        // Listeners para mudanças de configuração
        [this.includeUppercase, this.includeLowercase, this.includeNumbers, this.includeSymbols].forEach(checkbox => {
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    this.validateSelection();
                    this.saveSettings();
                    this.generatePassword();
                });
            }
        });
    }

    validateSelection() {
        const hasSelection = (this.includeUppercase?.checked) || 
                           (this.includeLowercase?.checked) || 
                           (this.includeNumbers?.checked) || 
                           (this.includeSymbols?.checked);

        if (!hasSelection && this.includeLowercase) {
            // Se nenhuma opção está selecionada, seleciona letras minúsculas
            this.includeLowercase.checked = true;
        }
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const charSet = this.getCharacterSet();
        
        if (charSet.length === 0) {
            this.generatedPassword.value = 'Selecione ao menos um tipo de caractere';
            return;
        }

        let password = '';
        
        // Garante ao menos um caractere de cada tipo selecionado
        const requiredChars = this.getRequiredCharacters();
        password += requiredChars;

        // Preenche o restante da senha
        for (let i = requiredChars.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charSet.length);
            password += charSet[randomIndex];
        }

        // Embaralha a senha para distribuir os caracteres obrigatórios
        password = this.shuffleString(password);
        
        this.generatedPassword.value = password;
        this.saveLastPassword(password);
    }

    getCharacterSet() {
        let charset = '';
        
        // Todos os caracteres disponíveis
        if (this.includeUppercase?.checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (this.includeLowercase?.checked) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (this.includeNumbers?.checked) charset += '0123456789';
        if (this.includeSymbols?.checked) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?~/`"\'\\';

        return charset;
    }

    getRequiredCharacters() {
        let required = '';
        
        if (this.includeUppercase?.checked) required += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (this.includeLowercase?.checked) required += this.getRandomChar('abcdefghijklmnopqrstuvwxyz');
        if (this.includeNumbers?.checked) required += this.getRandomChar('0123456789');
        if (this.includeSymbols?.checked) required += this.getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?~/`"\'\\');

        return required;
    }

    getRandomChar(charset) {
        return charset[Math.floor(Math.random() * charset.length)];
    }

    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.generatedPassword.value);
            
            // Feedback visual moderno
            this.copyBtn.classList.add('copied');
            
            setTimeout(() => {
                this.copyBtn.classList.remove('copied');
            }, 1000);
            
        } catch (err) {
            // Fallback para navegadores mais antigos
            this.generatedPassword.select();
            document.execCommand('copy');
            
            this.copyBtn.classList.add('copied');
            
            setTimeout(() => {
                this.copyBtn.classList.remove('copied');
            }, 1000);
        }
    }

    saveSettings() {
        if (!this.lengthSlider) return;
        
        const settings = {
            length: this.lengthSlider.value,
            includeUppercase: this.includeUppercase?.checked ?? true,
            includeLowercase: this.includeLowercase?.checked ?? true,
            includeNumbers: this.includeNumbers?.checked ?? true,
            includeSymbols: this.includeSymbols?.checked ?? true
        };

        chrome.storage.local.set({ passwordSettings: settings });
    }

    loadSettings() {
        chrome.storage.local.get('passwordSettings', (result) => {
            if (result.passwordSettings) {
                const settings = result.passwordSettings;
                
                if (this.lengthSlider) {
                    this.lengthSlider.value = settings.length || 16;
                }
                this.setTextContent(this.lengthDisplay, settings.length || 16);
                
                // Inclusões
                if (this.includeUppercase) this.includeUppercase.checked = settings.includeUppercase !== false;
                if (this.includeLowercase) this.includeLowercase.checked = settings.includeLowercase !== false;
                if (this.includeNumbers) this.includeNumbers.checked = settings.includeNumbers !== false;
                if (this.includeSymbols) this.includeSymbols.checked = settings.includeSymbols !== false;
            } else {
                // Valores padrão
                if (this.lengthSlider) {
                    this.setTextContent(this.lengthDisplay, this.lengthSlider.value);
                }
            }
        });
    }

    saveLastPassword(password) {
        chrome.storage.local.set({ lastPassword: password });
    }
}

// Inicializa o gerador quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});
