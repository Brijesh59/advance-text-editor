import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Extension } from "@tiptap/core";

import { PricingTable } from "./component";
import makeData from "./makeData";

export const PricingTableNode = Node.create({
  name: "pricingTable",

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
        tag: "pricing-table",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["pricing-table", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PricingTable);
  },
});

export const PricingTableExtention = Extension.create({
  name: "pricingTableExtention",

  addCommands() {
    return {
      insertPricing:
        (options: any) =>
        ({ commands }: any) => {
          const attrs = {
            ...options,
          };

          commands?.setNode("pricingTable", attrs);
        },
    };
  },
});
