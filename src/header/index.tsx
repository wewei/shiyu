import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { Invokes, Messages } from "./api";
import { MessageReceiver } from "@src/electron-helper/common";

declare global {
  const BridgedMessages: MessageReceiver<Messages>;
  const BridgedApi: Invokes;
}

const Header: React.FunctionComponent = () => {
  const [title, setTitle] = useState("");
  const [expanded, setExpanded] = useState(false);

  const onMouseEnter = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
      void BridgedApi.setExpanded(true);
    }
    console.log('Mouse Enter');
  }, [expanded]);

  const onMouseLeave = useCallback(() => {
    if (expanded) {
      setExpanded(false);
      void BridgedApi.setExpanded(false);
    }
    console.log('Mouse Leave');
  }, [expanded]);

  useEffect(() => {
    return BridgedMessages.didTitleChange((_, newTitle) => {
      setTitle(newTitle);
    });
  }, []);
  console.log('rendered');

  return (
    <header
      style={{
        height: expanded ? 40 : 15
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
