export type AnyAsyncFunction = (...args: any) => Promise<any>;
export type AnyInvokes = Record<string, AnyAsyncFunction>;
