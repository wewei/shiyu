import { IpcMainInvokeEvent, IpcRendererEvent } from "electron";

export type AnyAsyncFunction = (...args: unknown[]) => Promise<unknown>;
export type AnyInvokes = Record<string, AnyAsyncFunction>;

export type AnyEmitter = (...args: unknown[]) => void;
export type AnyMessagePort = Record<string, AnyEmitter>;

type PromiseOf<T> = T extends PromiseLike<unknown> ? T : PromiseLike<T>;

export type InvokesImpl<I extends AnyInvokes> = {
  [K in keyof I]: (e: IpcMainInvokeEvent, ...args: Parameters<I[K]>) => PromiseOf<ReturnType<I[K]>>;
};

export type MessageReceiver<M extends AnyMessagePort> = {
  [K in keyof M]: (callback: (e: IpcRendererEvent, ...args: Parameters<M[K]>) => void) => () => void;
};
