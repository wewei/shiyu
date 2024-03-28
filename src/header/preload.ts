import { Invokes, Messages } from "./api";
import { implementInvokes, implementMessagePort } from "@src/electron-helper/preload";

implementInvokes<Invokes>({ setExpanded: true });
implementMessagePort<Messages>({ didTitleChange: true });