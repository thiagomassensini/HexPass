// Background script para a extensão
chrome.runtime.onInstalled.addListener(() => {
    console.log('HexPass Generator instalado com sucesso!');
    
    // Configurações padrão
    const defaultSettings = {
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
    };
    
    chrome.storage.local.set({ passwordSettings: defaultSettings });
});

// Responde a mensagens do content script ou popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generatePassword') {
        // Gera senha usando as configurações atuais
        chrome.storage.local.get('passwordSettings', (result) => {
            const settings = result.passwordSettings || {};
            const password = generateSecurePassword(settings);
            sendResponse({ password: password });
        });
        return true; // Indica resposta assíncrona
    }
});

function generateSecurePassword(settings) {
    const length = settings.length || 12;
    let charset = '';
    
    // Todos os caracteres disponíveis
    if (settings.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (settings.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (settings.includeNumbers) charset += '0123456789';
    if (settings.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?~/`"\'\\';
    
    if (charset.length === 0) {
        return 'Erro: Nenhum tipo de caractere selecionado';
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    return password;
}
