import { Invokes, Messages } from "./api";
import { implementApi, implementEmitter } from "@src/preload/ipc-helper";

implementApi<Invokes>({ setExpanded: true }, 'HeaderApi');
implementEmitter<Messages>({ didTitleChange: true }, 'HeaderEmitter');