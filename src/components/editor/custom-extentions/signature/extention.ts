import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Extension } from "@tiptap/core";

import { Signature } from "./component";

export const SignatureNode = Node.create({
  name: "signature",

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
        tag: "signature",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["signature", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Signature);
  },
});

export const SignatureExtention = Extension.create({
  name: "signatureExtention",

  addCommands() {
    return {
      insertSignature:
        (options: any) =>
        ({ commands }: any) => {
          const attrs = {
            ...options,
          };

          commands?.setNode("signature", attrs);
        },
    };
  },
});
