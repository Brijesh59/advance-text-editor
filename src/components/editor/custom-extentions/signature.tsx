"use client";

import { Extension } from "@tiptap/core";
import { Node, NodeSpec, Node as ProseMirrorNode } from "@tiptap/core";
import { createReactNode } from "../createReactNode";

export interface SignatureNodeOptions {
  HTMLAttributes: Record<string, any>;
}

export interface SignatureExtensionOptions {
  signatureText?: string;
  style?: string;
}

const SignatureComponent = () => {
  return (
    <div className="text-2xl" contentEditable>
      SignatureComponent
    </div>
  );
};

export const SignatureNode = createReactNode(SignatureComponent, "signature");

export const SignatureExtension = Extension.create<SignatureExtensionOptions>({
  name: "insertSignature",

  addCommands() {
    return {
      insertSignature:
        (options) =>
        ({ commands }) => {
          // Define the attributes for your signature node, including style
          const attrs = {
            style:
              "font-size: 16px; padding: 10px; border: 1px solid #ccc; margin-top: 10px; display: inline-block;",
            ...options,
          };

          commands?.setNode("signature", attrs);
        },
    };
  },
});

export const SignatureNode1 = Node.create<SignatureNodeOptions>({
  name: "signature",

  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes() {
    return {
      style: {
        default:
          "font-size: 16px; padding: 10px; border: 1px solid #ccc; margin-top: 10px; display: inline-block;",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.signature",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { class: "signature", style: HTMLAttributes.style }, 0];
  },
});
