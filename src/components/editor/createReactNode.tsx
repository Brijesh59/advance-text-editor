import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client"; // Updated import for React 18

import { Node, NodeViewRenderer, NodeViewRendererProps } from "@tiptap/core";

export const createReactNode = (Component: any, name: string) => {
  return Node.create({
    name,

    group: "block",
    content: "inline*",
    draggable: true,

    addAttributes() {
      return {
        // Define any attributes your component might use
        style: {
          default: null,
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'div[data-type="react-component"]',
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return ["div", { "data-type": "react-component", ...HTMLAttributes }, 0];
    },

    addNodeView(): NodeViewRenderer {
      return ({ editor, node, getPos, decorations }) => {
        const componentProps = node.attrs;
        const ComponentView = document.createElement("div");

        // Use createRoot to handle the rendering
        const root = createRoot(ComponentView); // Initialize the root

        const renderReactComponent = () => {
          root.render(<Component {...componentProps} />);
        };

        renderReactComponent();

        return {
          dom: ComponentView,
          update(updatedNode) {
            // Optional: Update logic if your component depends on the node's attributes
            if (updatedNode.type === node.type) {
              renderReactComponent();
              return true;
            }
            return false;
          },
          destroy() {
            // Use a microtask to defer unmounting until after the current rendering work is complete
            Promise.resolve().then(() => root.unmount());
          },
        };
      };
    },
  });
};
