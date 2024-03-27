// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, createIpcRenderer } from "@src/shim/electron-typescript-ipc";
import { Api } from "@src/api";

const ipcRenderer = createIpcRenderer<Api>();

const api: Api = {
  invoke: {},
  on: {
    didUpdateTitle(listener) {
        ipcRenderer.on('didUpdateTitle', listener);
        return () => {
          console.log('off listener');
          ipcRenderer.off('didUpdateTitle', listener);
        };
    },
  }
};

contextBridge.exposeInMainWorld('api', api);
