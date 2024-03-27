import { contextBridge, ipcRenderer } from "electron";
import { AnyInvokes } from "./common";
import { keys } from "ts-transformer-keys";

export function implementInvokes<I extends AnyInvokes>(
    apiKey: string = "invoke"
): void {
    contextBridge.exposeInMainWorld(
        apiKey,
        keys<I>().reduce((m, key) => {
            m[key] = ((...args: any) =>
                ipcRenderer.invoke(
                    `invoke:${key as string}`,
                    ...args
                )) as I[keyof I];
            return m;
        }, {} as I)
    );
}
