import { TITLE_BAR_HEIGHT } from "@src/frame/common";
import { createMessagePort } from "@src/electron-helper/main";
import { BrowserView, BrowserWindow } from "electron";
import { MessagePort } from "./api";

declare const FRAME_WEBPACK_ENTRY: string;
declare const FRAME_PRELOAD_WEBPACK_ENTRY: string;

const DEFAULT_HEIGHT = 600;
const DEFAULT_WIDTH = 800;
const MIN_HEIGHT = 600;
const MIN_WIDTH = 800;

function createMainWebView(): BrowserView {
  const view = new BrowserView();

  view.setAutoResize({ width: true, height: true });
  view.setBounds({
    x: 0,
    y: TITLE_BAR_HEIGHT,
    height: DEFAULT_HEIGHT - TITLE_BAR_HEIGHT,
    width: DEFAULT_WIDTH,
  });

  return view;
}

export const createFrameWindow = (): BrowserWindow => {
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
  
  void mainWindow.loadURL(FRAME_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
  const messagePort = createMessagePort<MessagePort>(
    { didUpdateTitle: true },
    mainWindow.webContents
  );

  // Create main view
  const mainView = createMainWebView();

  mainView.webContents.on('page-title-updated', () => {
    const title = mainView.webContents.getTitle();
    messagePort.didUpdateTitle(title);
    console.log(title);
  });

  mainWindow.addBrowserView(mainView);
  void mainView.webContents.loadURL("https://www.bing.com/");

  return mainWindow;
};