import React from "react";
import { createRoot } from "react-dom/client";

const Index = () => {
  return (
    <div>
      <button>button</button>
    </div>
  );
};

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(<Index />);
