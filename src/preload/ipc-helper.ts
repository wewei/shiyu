import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { UnknownApi, UnknownEmitter } from "../common/ipc-helper";

export type Receiver<M extends UnknownEmitter> = {
  [K in keyof M]: (callback: (e: IpcRendererEvent, ...args: Parameters<M[K]>) => void) => () => void;
};

export function implementApi<I extends UnknownApi>(
  template: { [K in keyof I]: true },
  apiKey = "BridgedApi"
): void {
  contextBridge.exposeInMainWorld(
    apiKey,
    Object.keys(template).reduce((m, key) => {
      m[key] = (...args: unknown[]) =>
        ipcRenderer.invoke(`invoke:${key}`, ...args);
      return m;
    }, {} as Record<string, unknown>)
  );
}

export function implementEmitter<M extends UnknownEmitter>(
  template: { [K in keyof M]: true },
  apiKey = "BridgedEmitter"
): void {
  console.log('exposing', apiKey);
  contextBridge.exposeInMainWorld(
    apiKey,
    Object.keys(template).reduce((m, key) => {
      const channel = `message:${key}`;
      m[key] = (callback: (v: unknown) => void) => {
        ipcRenderer.on(channel, callback);
        return () => {
          ipcRenderer.off(channel, callback);
        };
      };
      return m;
    }, {} as Record<string, unknown>)
  );
}
