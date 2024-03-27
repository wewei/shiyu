import { Invokes } from "./api";
import { implementInvokes } from "@src/electron-helper/main";

implementInvokes<Invokes>({
  setHeaderVisibility: function (isVisible: boolean): Promise<void> {
    throw new Error("Function not implemented.");
  }
});
