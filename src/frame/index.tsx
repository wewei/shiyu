import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { TITLE_BAR_HEIGHT } from "../common";
import { Api } from "../api";

import "./index.css";

declare global {
  interface Window {
    api: Api;
  }
}

const Header: React.FunctionComponent = () => {
  const [title, setTitle] = useState("");
  useEffect(() => {
    const unregister = window.api.on.didUpdateTitle((_, newTitle) => setTitle(newTitle)) || (() => {});
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

const root = createRoot(document.body);
root.render(<Header></Header>);
