import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Extension } from "@tiptap/core";

import { CustomTable } from "./component";

export const CustomTableNode = Node.create({
  name: "customTable",

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
        tag: "customTable",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["customTable", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomTable);
  },
});

export const CustomTableExtention = Extension.create({
  name: "customTableExtention",

  addCommands() {
    return {
      insertTable:
        (options: any) =>
        ({ commands }: any) => {
          const attrs = {
            ...options,
          };

          commands?.setNode("customTable", attrs);
        },
    };
  },
});
