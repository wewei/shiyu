import { createMessagePort } from "@src/main/ipc-helper";
import { BrowserView, BrowserWindow } from "electron";
import { MessagePort } from "./api";
import { createView as createHeaderView } from "@src/component/header/main";
import { Subject } from "rxjs";

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
    y: 40,
    height: DEFAULT_HEIGHT - 40,
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
  
  // void mainWindow.loadURL(FRAME_WEBPACK_ENTRY);

  mainWindow.webContents.openDevTools();
  const messagePort = createMessagePort<MessagePort>(
    { didUpdateTitle: true },
    mainWindow.webContents
  );

  // Create main view
  const title = new Subject<string>();
  const mainView = createMainWebView();

  mainView.webContents.on('page-title-updated', () => {
    const newTitle = mainView.webContents.getTitle();
    messagePort.didUpdateTitle(newTitle);
    title.next(newTitle);
    console.log(newTitle);
  });

  // mainWindow.addBrowserView(mainView);
  // void mainView.webContents.loadURL("https://www.bing.com/");

  const headerView = createHeaderView({ title });
  headerView.setBounds({ x: 0, y: 0, width: DEFAULT_WIDTH, height: 100 });
  headerView.setAutoResize({ width: true, height: true });
  console.log(headerView.getBounds());
  mainWindow.addBrowserView(headerView);

  return mainWindow;
};