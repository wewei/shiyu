import { GetApiType } from "electron-typescript-ipc";

export type Api = GetApiType<Record<string, never>, {
  didUpdateTitle: (title: string) => void
}>;
