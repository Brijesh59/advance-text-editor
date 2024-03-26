import { NodeViewWrapper } from "@tiptap/react";
interface SignatureProps {
  name: string;
}

const SignaturePad: React.FC<SignatureProps> = ({ name }) => {
  return (
    <div className="flex flex-col">
      <hr className="w-1/2 border-solid border border-black m-0 mt-28" />
      <p className="mt-2">{name}</p>
    </div>
  );
};

export const Signature = (props: any) => {
  return (
    <NodeViewWrapper>
      <SignaturePad name="vikash" />
    </NodeViewWrapper>
  );
};
