import { contextBridge, ipcRenderer } from "electron";
import { AnyInvokes, AnyMessagePort } from "./common";

export function implementInvokes<I extends AnyInvokes>(
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

export function implementMessagePort<M extends AnyMessagePort>(
  template: { [K in keyof M]: true },
  apiKey = "BridgedMessages"
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
