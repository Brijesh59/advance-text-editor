import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Extension } from "@tiptap/core";

import { ButtonCounter } from "./component";

export const ButtonCounterNode = Node.create({
  name: "buttonCounter",

  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "button-counter",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["button-counter", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonCounter);
  },
});

export const ButtonCounterExtention = Extension.create({
  name: "buttonCounterExtention",

  addCommands() {
    return {
      insertButtonCounter:
        (options: any) =>
        ({ commands }: any) => {
          const attrs = {
            ...options,
          };

          commands?.setNode("buttonCounter", attrs);
        },
    };
  },
});
