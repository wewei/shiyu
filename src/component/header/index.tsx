import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { Invokes, Messages } from "./api";
import { Receiver } from "@src/preload/ipc-helper";

declare global {
  const HeaderEmitter: Receiver<Messages>;
  const HeaderApi: Invokes;
}

const Header: React.FunctionComponent = () => {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(true);

  const onMouseEnter = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
      void HeaderApi.setExpanded(true);
    }
    console.log('Mouse Enter');
  }, [expanded]);

  const onMouseLeave = useCallback(() => {
    if (expanded) {
      setExpanded(false);
      void HeaderApi.setExpanded(false);
    }
    console.log('Mouse Leave');
  }, [expanded]);

  useEffect(() => {
    return HeaderEmitter.didTitleChange((_, newTitle) => {
      setTitle(newTitle);
    });
  }, []);
  console.log('rendered');

  return (
    <header
      style={{
        height: expanded ? 100 : 40
      }}
      className="title-bar"
      onMouseMove={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title}
    </header>
  );
};

// window.addEventListener('mouseenter', () => {
//   console.log('mouse enter');
// });

// window.addEventListener('mouseleave', () => {
//   console.log('mouse leave');
// });

// window.addEventListener('mousemove', () => {
//   console.log('mouse move');
// });



const root = createRoot(document.getElementById('app-root'));
root.render(<Header></Header>);
