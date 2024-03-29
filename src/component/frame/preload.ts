import { implementEmitter } from "@src/preload/ipc-helper";
import { MessagePort } from "./api";

implementEmitter<MessagePort>({ didUpdateTitle: true }, 'FrameEmitter');
