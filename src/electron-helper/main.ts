import { ipcMain, WebContents } from "electron";
import { AnyInvokes, AnyMessagePort } from "./common";

export function implementInvokes<I extends AnyInvokes>(invokes: I) {
  Object.entries(invokes).forEach(([key, func]) =>
    ipcMain.handle(`invoke:${key}`, func)
  );
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
