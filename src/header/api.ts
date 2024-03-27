import { GetApiType } from "@src/shim/electron-typescript-ipc";

export type HeaderApi = GetApiType<{
  setHeaderVisibility: (isVisible: boolean) => Promise<void>;
}, {
  didHeaderVisibilityChange: (isVisible: boolean) => void;
}>;

export type Invokes = {
  setHeaderVisibility: (isVisible: boolean) => Promise<void>;
};

export type Messages = {
  didHeaderVisibilityChange: (isVisible: boolean) => void;
};