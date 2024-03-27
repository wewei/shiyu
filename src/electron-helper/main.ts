import { ipcMain } from "electron";
import { AnyInvokes } from "./common";

export function implementInvokes<I extends AnyInvokes>(invokes: I) {
  Object.entries(invokes).forEach(([key, func]) => ipcMain.handle(`invoke:${key}`, func));
}
