
const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    backgroundColor: '#09090b',
    title: 'GTO Drill Trainer',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Necessário para alguns carregadores dinâmicos de TSX
      webSecurity: false,      // Permite carregar scripts do esm.sh via file://
      devTools: true
    }
  });

  // Remove o menu padrão
  win.setMenuBarVisibility(false);

  // Abre o DevTools automaticamente para ajudar no debug se houver erro
  // win.webContents.openDevTools();

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  // Configura o cabeçalho de segurança para permitir scripts externos
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"]
      }
    });
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
