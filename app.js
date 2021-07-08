const electron = require('electron');
const fs = require('fs');
const { getRawJSONInvoices } = require('./XMLUtils');
const { InvoicesManager } = require('./InvoicesManager');
const { ipcRenderer, ipcMain } = require('electron');

const { app, BrowserWindow, screen } = electron;

const CONFIG = JSON.parse(fs.readFileSync('./config.json').toString());

let mainWindow;

const JSONinvoices = getRawJSONInvoices(CONFIG.receivedInvoicesPath).concat(getRawJSONInvoices(CONFIG.issuedInvoicesPath));
const invoicesManager = new InvoicesManager(JSONinvoices);


// JSONinvoices.forEach( invoice => {
//   for(const [key, value] of Object.keys(invoice)) {
//     console.log(key, value);
//   }
// })






ipcMain.on('main:request', (event, request) => {
  switch(request) {
    case 'getAllInvoices': 
      const data = invoicesManager.getAllInvoices();
      mainWindow.webContents.send('main:response', data);
      break;
  }
});




app.on('ready', () => {
  let { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.9),
    height: Math.floor(height * 0.9),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
});



//    Electron app side             ||  MainWindow

//    ipcMain.on                    <=  ipcRenderer.send
//    mainWindow.webContents.send   =>  ipcRenderer.on



// app.exit();