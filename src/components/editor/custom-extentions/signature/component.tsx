import { NodeViewWrapper } from "@tiptap/react";
import React from "react";

export const Signature = (props: any) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    });
  };

  return (
    <NodeViewWrapper className="signature">
      <span className="label">Signature Component</span>

      <div className="content">
        <button onClick={increase}>Signature {props.node.attrs.count}.</button>
      </div>
    </NodeViewWrapper>
  );
};
