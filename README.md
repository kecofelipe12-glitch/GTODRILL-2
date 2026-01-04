
# GTO Drill Trainer - Desktop App

Este projeto foi convertido para rodar nativamente como um aplicativo de desktop usando Electron.

## Como rodar localmente (Desenvolvimento)

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. No terminal, na raiz do projeto, instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm start
   ```

## Como gerar o instalador (.EXE / .DMG)

Para criar o arquivo que você pode enviar para outras pessoas instalarem:

1. Execute o comando de build:
   ```bash
   npm run build
   ```
2. O instalador será gerado na pasta `/dist`.

## Requisitos
- Conexão com internet (para carregar o Tailwind e React via ESM.sh no primeiro carregamento).
- Windows 10+, macOS ou Linux.
