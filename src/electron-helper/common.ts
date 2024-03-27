import { IpcRendererEvent } from "electron";

export type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>;
export type AnyInvokes = Record<string, AnyAsyncFunction>;

export type AnyEmitter = (...args: unknown[]) => void;
export type AnyMessagePort = Record<string, AnyEmitter>;
export type MessageReceiver<M extends AnyMessagePort> = {
  [K in keyof M]: (callback: (e: IpcRendererEvent, ...args: Parameters<M[K]>) => void) => () => void;
}