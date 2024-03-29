export type UnknownAsyncFunction = (...args: unknown[]) => Promise<unknown>;
export type UnknownApi = Record<string, UnknownAsyncFunction>;
export type UnknownChannel = (...args: unknown[]) => void;
export type UnknownEmitter = Record<string, UnknownChannel>;
