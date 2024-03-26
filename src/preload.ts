// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, createIpcRenderer } from "electron-typescript-ipc";
import { Api } from "./api";

const ipcRenderer = createIpcRenderer<Api>();

const api: Api = {
  invoke: {},
  on: {
    didUpdateTitle(listener) {
        ipcRenderer.on('didUpdateTitle', listener);
    },
  }
};

contextBridge.exposeInMainWorld('api', api);
