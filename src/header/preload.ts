import { Invokes } from "./api";
import { implementInvokes } from "@src/electron-helper/preload";

implementInvokes<Invokes>({ setHeaderVisibility: true });