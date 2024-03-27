import { app, BrowserView, BrowserWindow, Menu, MenuItem } from 'electron';
import { createIpcMain } from '@src/shim/electron-typescript-ipc';
import { Api } from '@src/api';
import { TITLE_BAR_HEIGHT } from '@src/common';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const FRAME_WEBPACK_ENTRY: string;
declare const FRAME_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const DEFAULT_HEIGHT = 600;
const DEFAULT_WIDTH = 800;
const MIN_HEIGHT = 600;
const MIN_WIDTH = 800;

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    minHeight: MIN_HEIGHT,
    minWidth: MIN_WIDTH,
    webPreferences: {
      preload: FRAME_PRELOAD_WEBPACK_ENTRY,
    },
    frame: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(FRAME_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const mainView = new BrowserView();
  mainView.setAutoResize({ width: true, height: true });
  mainView.setBounds({
    x: 0,
    y: TITLE_BAR_HEIGHT,
    height: DEFAULT_HEIGHT - TITLE_BAR_HEIGHT,
    width: DEFAULT_WIDTH,
  });

  const ipcMain = createIpcMain<Api>();

  mainView.webContents.on('page-title-updated', () => {
    const title = mainView.webContents.getTitle();
    ipcMain.send(mainWindow, "didUpdateTitle", title);
    console.log(title);
  });

  mainView.webContents.loadURL("https://www.bing.com/");
  mainWindow.addBrowserView(mainView);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

const menu = new Menu();

menu.append(new MenuItem({
  label: 'ShiYu',
  submenu: [{
    label: 'Command',
    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+P' : 'Ctrl+Shift+P',
    click: () => { console.log('execute command'); },
  }]
}));

Menu.setApplicationMenu(menu);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
