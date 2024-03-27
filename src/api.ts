import { GetApiType } from "@src/shim/electron-typescript-ipc";

export type Api = GetApiType<Record<string, never>, {
  didUpdateTitle: (title: string) => void
}>;
