import { IpcMainInvokeEvent, ipcMain, WebContents } from "electron";

import {
    UnknownAsyncFunction,
    UnknownApi,
    UnknownEmitter,
} from "../common/ipc-helper";

type PromiseOf<T> = T extends PromiseLike<unknown> ? T : PromiseLike<T>;

export type InvokesImpl<I extends UnknownApi> = {
    [K in keyof I]: (
        e: IpcMainInvokeEvent,
        ...args: Parameters<I[K]>
    ) => PromiseOf<ReturnType<I[K]>>;
};

const register: Record<string, WeakMap<WebContents, UnknownAsyncFunction>> = {};

export function implementInvokes<I extends UnknownApi>(
    invokesImpl: InvokesImpl<I>,
    webContents: WebContents
) {
    Object.keys(invokesImpl).forEach((key) => {
        if (!register[key]) {
            register[key] = new WeakMap();
            ipcMain.handle(`invoke:${key}`, (event, ...args: unknown[]) => {
                if (register[key].has(event.sender)) {
                    return register[key].get(event.sender)(event, ...args);
                }
                return Promise.reject(
                    `Method <${key}> is not implement in this context`
                );
            });
        }
        register[key].set(webContents, invokesImpl[key]);
    });
}

export function createMessagePort<M extends UnknownEmitter>(
    template: { [K in keyof M]: true },
    webContexts: WebContents
): M {
    return Object.keys(template).reduce((m, key: keyof M) => {
        m[key] = ((...args) =>
            webContexts.send(
                `message:${key as string}`,
                ...args
            )) as M[typeof key];
        return m;
    }, {} as M);
}
