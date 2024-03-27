import { implementMessagePort } from "@src/electron-helper/preload";
import { MessagePort } from "./api";

implementMessagePort<MessagePort>({ didUpdateTitle: true });
