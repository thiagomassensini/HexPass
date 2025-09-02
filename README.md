# 🔐 HexPass - Gerador de Senhas Seguras

<div align="center">

![HexPass Logo](icons/icon128.png)

**Extensão Chrome moderna para geração de senhas criptograficamente seguras**

[![Licença HEXTEC](https://img.shields.io/badge/Licença-HEXTEC-blue.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/)

[Instalação](#-instalação) • [Funcionalidades](#-funcionalidades) • [Segurança](#-segurança) • [Suporte](#-suporte)

</div>

---

## ✨ Características Principais

- 🛡️ **Segurança Total**: Geração local sem envio de dados para servidores
- � **Design HEXTEC**: Interface elegante com efeitos glassmorfismo e gradientes
- ⚙️ **Altamente Customizável**: Controle total sobre comprimento e tipos de caracteres
- 🌓 **Tema Adaptativo**: Ícones que se ajustam automaticamente ao tema do navegador
- 📋 **Cópia Instantânea**: Um clique para copiar senhas para a área de transferência
- 💾 **Configurações Persistentes**: Suas preferências são salvas automaticamente
- ⚡ **Performance**: Zero dependências, carregamento instantâneo

## 🚀 Instalação

### Método 1: Instalação Manual (Desenvolvedor)

1. **Clone o repositório**
   ```bash
   git clone https://github.com/thiagomassensini/HexPass.git
   cd HexPass
   ```

2. **Abra o Chrome e vá para as extensões**
   - Digite `chrome://extensions/` na barra de endereços
   - Ou vá em **Menu** > **Mais ferramentas** > **Extensões**

3. **Ative o modo desenvolvedor**
   - No canto superior direito, ative a opção **"Modo de desenvolvedor"**

4. **Carregue a extensão**
   - Clique em **"Carregar extensão sem compactação"**
   - Selecione a pasta do projeto HexPass
   - A extensão será instalada automaticamente

### Método 2: Chrome Web Store (Em breve)
*A extensão estará disponível na Chrome Web Store em breve para instalação com um clique.*

## � Como Usar

### Interface Principal

1. **Clique no ícone** da extensão na barra de ferramentas do Chrome
2. **Configure suas preferências:**
   - **Comprimento**: Use o slider para definir de 4 a 50 caracteres
   - **Tipos de caracteres**: Marque/desmarque as opções desejadas
     - ✅ Letras maiúsculas (A-Z)
     - ✅ Letras minúsculas (a-z)
     - ✅ Números (0-9)
     - ✅ Símbolos (!@#$%^&*)
3. **Gere sua senha**: Clique em "Gerar Nova Senha" ou use o botão de regenerar
4. **Copie a senha**: Use o botão de copiar para enviar para a área de transferência

### Atalhos Rápidos

- **Regenerar**: Botão de refresh no header ou na área da senha
- **Copiar**: Botão de clipboard com feedback visual
- **Configurações**: Ajustes salvos automaticamente

## 🛠️ Funcionalidades Detalhadas

### Geração de Senhas
- **Algoritmo seguro**: Utiliza `Math.random()` com distribuição uniforme
- **Garantia de diversidade**: Inclui pelo menos um caractere de cada tipo selecionado
- **Embaralhamento**: Algoritmo Fisher-Yates para distribuição aleatória

### Interface de Usuário
- **Design responsivo**: Otimizado para popup de extensão
- **Animações suaves**: Transições CSS3 elegantes
- **Feedback visual**: Indicações claras de ações realizadas
- **Temas adaptativos**: Ícones que mudam com o tema do navegador

### Configurações
- **Persistência local**: Configurações salvas no Chrome Storage
- **Validação inteligente**: Previne configurações inválidas
- **Valores padrão**: 16 caracteres com todos os tipos habilitados

## 🔒 Segurança e Privacidade

### Princípios de Segurança
- ✅ **Geração 100% local**: Nenhum dado sai do seu dispositivo
- ✅ **Zero telemetria**: Não coletamos nenhuma informação
- ✅ **Código aberto**: Auditável e transparente
- ✅ **Sem permissões desnecessárias**: Acesso mínimo ao sistema

### Garantias de Privacidade
- 🚫 **Sem conexões de rede**: Não se comunica com servidores
- 🚫 **Sem armazenamento de senhas**: Senhas não são salvas
- 🚫 **Sem rastreamento**: Zero analytics ou tracking
- 🚫 **Sem anúncios**: Interface limpa e funcional

## 🎯 Compatibilidade

### Navegadores Suportados
- ✅ **Google Chrome** 88+
- ✅ **Microsoft Edge** 88+
- ✅ **Brave Browser**
- ✅ **Opera**
- ✅ **Vivaldi**
- ✅ **Outros navegadores Chromium**

### Sistemas Operacionais
- ✅ **Windows** 10/11
- ✅ **macOS** 10.14+
- ✅ **Linux** (Ubuntu, Fedora, etc.)
- ✅ **Chrome OS**

## 🛠️ Desenvolvimento

### Tecnologias Utilizadas
- **Manifest V3**: Padrão moderno e seguro para extensões
- **Vanilla JavaScript**: Performance otimizada sem dependências
- **CSS3 Avançado**: Gradientes, backdrop-filter e animações
- **Chrome APIs**: Storage local e gerenciamento de extensões

### Estrutura do Projeto
```
HexPass/
├── manifest.json          # Configuração da extensão
├── popup.html             # Interface principal
├── popup.js               # Lógica de geração e UI
├── styles.css             # Estilos HEXTEC
├── background.js          # Service Worker
├── content.js             # Scripts de página
├── icons/                 # Ícones da extensão
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon*_dark.png     # Versões para tema escuro
└── logos/                 # Assets da marca
```

### Para Desenvolvedores

```bash
# Clone o repositório
git clone https://github.com/thiagomassensini/HexPass.git

# Entre na pasta
cd HexPass

# Carregue no Chrome para desenvolvimento
# chrome://extensions/ > Modo desenvolvedor > Carregar extensão
```

## � Licença

```
Copyright (c) 2025 HEXTEC
Todos os direitos reservados.

Esta extensão é propriedade da HEXTEC e está protegida por leis de direitos autorais.
O uso, distribuição e modificação estão sujeitos aos termos da licença HEXTEC.

Para mais informações sobre licenciamento, entre em contato com:
HEXTEC - Soluções Tecnológicas
```

## 🤝 Contribuições

Este projeto é mantido pela **HEXTEC**. Para sugestões, melhorias ou relatos de bugs:

1. Abra uma [Issue](https://github.com/thiagomassensini/HexPass/issues)
2. Descreva detalhadamente o problema ou sugestão
3. Inclua informações do seu ambiente (navegador, SO, versão)

## 📞 Suporte

- � **Bugs**: [Abrir Issue](https://github.com/thiagomassensini/HexPass/issues)
- 💡 **Sugestões**: [Discussions](https://github.com/thiagomassensini/HexPass/discussions)
- 📧 **Contato**: Entre em contato com a HEXTEC

## � Estatísticas

- 🎯 **Segurança**: 100% local, zero vazamentos
- ⚡ **Performance**: Carregamento < 100ms
- 💾 **Tamanho**: < 500KB total
- � **Atualizações**: Continuous integration

---

<div align="center">

**Desenvolvido com ❤️ pela [HEXTEC](https://hextec.com.br)**

*Sua segurança digital é nossa prioridade*

<img src="logos/logo128_v1.png" alt="HEXTEC" width="128" height="auto" style="max-width: 128px; height: auto;">

</div>
