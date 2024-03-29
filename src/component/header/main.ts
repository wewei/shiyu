import { BrowserView } from "electron";
import { Invokes, Messages } from "./api";
import { createMessagePort, implementInvokes } from "@src/main/ipc-helper";
import { Observable } from "rxjs";

declare const HEADER_WEBPACK_ENTRY: string;
declare const HEADER_PRELOAD_WEBPACK_ENTRY: string;

type HeaderViewProps = {
  title: Observable<string>;
};

export function createView({ title }: HeaderViewProps): BrowserView {
  const view = new BrowserView({
    webPreferences: { preload: HEADER_PRELOAD_WEBPACK_ENTRY },
  });

  const { didTitleChange } = createMessagePort<Messages>(
      { didTitleChange: true },
      view.webContents
  );

  title.subscribe(didTitleChange);

  function updateBound(expanded: boolean) {
    view.setBounds({ ...view.getBounds(), height: expanded ? 100 : 40 });
    console.log(view.getBounds());
  }

  implementInvokes<Invokes>({
    setExpanded(event, expanded) {
      updateBound(expanded);
      return Promise.resolve();
    }
  }, view.webContents);

  void view.webContents.loadURL(HEADER_WEBPACK_ENTRY);
  view.webContents.openDevTools();

  return view;
}