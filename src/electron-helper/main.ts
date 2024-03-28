import { ipcMain, WebContents } from "electron";
import { AnyAsyncFunction, AnyInvokes, AnyMessagePort, InvokesImpl } from "./common";

const register: Record<string, WeakMap<WebContents, AnyAsyncFunction>> = {};

export function implementInvokes<I extends AnyInvokes>(
  invokesImpl: InvokesImpl<I>,
  webContents: WebContents,
) {
  Object.keys(invokesImpl).forEach((key) => {
    if (!register[key]) {
      register[key] = new WeakMap();
      ipcMain.handle(`invoke:${key}`, (event, ...args: unknown[]) => {
        if (register[key].has(event.sender)) {
          return register[key].get(event.sender)(event, ...args);
        }
        return Promise.reject(`Method <${key}> is not implement in this context`);
      });
    }
    register[key].set(webContents, invokesImpl[key]);
  });
}

export function createMessagePort<M extends AnyMessagePort>(
  template: { [K in keyof M]: true },
  webContexts: WebContents
): M {
  return Object.keys(template).reduce((m, key: keyof M) => {
    m[key] = ((...args) =>
      webContexts.send(`message:${key as string}`, ...args)) as M[typeof key];
    return m;
  }, {} as M);
}
