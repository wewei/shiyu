import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { TITLE_BAR_HEIGHT } from "./common";

import "./index.css";
import { MessagePort } from "./api";
import { Receiver } from "@src/preload/ipc-helper";

declare global {
  const FrameEmitter: Receiver<MessagePort>;
}

const Header: React.FunctionComponent = () => {
  const [title, setTitle] = useState("");
  useEffect(() => {
    const unregister = FrameEmitter.didUpdateTitle((_, newTitle) => {
      setTitle(newTitle);
    });

    window.setTimeout(() => unregister(), 10000);
    return () => {
      unregister();
    };
  }, []);
  return (
    <header
      style={{
        height: TITLE_BAR_HEIGHT,
      }}
      className="title-bar"
    >
      {title}
    </header>
  );
};

const root = createRoot(document.getElementById('app-root'));
root.render(<Header></Header>);
