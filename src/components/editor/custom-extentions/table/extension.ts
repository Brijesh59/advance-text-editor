import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Extension } from "@tiptap/core";

import { CustomTable } from "./component";
import makeData from "./makeData";

export const CustomTableNode = Node.create({
  name: "customTable",

  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes() {
    return {
      tableData: {
        default: makeData(10),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "custom-table",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["custom-table", mergeAttributes(HTMLAttributes)];
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
