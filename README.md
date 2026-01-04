
# GTO Drill Trainer - Desktop App

Este projeto roda nativamente como um aplicativo de desktop usando Electron.

## Como rodar localmente (Desenvolvimento)

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. No terminal: `npm install` e depois `npm start`.

## Como gerar o executável (.EXE) para Windows

1. **Ative o Modo de Desenvolvedor** no Windows (Configurações > Privacidade e Segurança > Para desenvolvedores). Isso é essencial para evitar erros de "Symbolic Link".
2. Abra o terminal como Administrador.
3. Execute:
   ```bash
   npm run electron-build
   ```
4. Verifique a pasta `/dist`:
   - `GTO Drill Trainer Setup ... .exe`: Instalador completo.
   - `GTO Drill Trainer ... .exe`: Versão **Portable** (roda direto sem instalar).

### Solução de Problemas (Build Error)

Se o erro **"Cannot create symbolic link"** persistir:
1. Feche o terminal.
2. Ative o **Modo de Desenvolvedor** do Windows.
3. Apague a pasta de cache do builder: `rmdir /s /q %LOCALAPPDATA%\electron-builder\Cache`.
4. Rode o build novamente.
