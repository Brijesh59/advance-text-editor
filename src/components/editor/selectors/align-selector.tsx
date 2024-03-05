import { cn } from "@/lib/utils";
import { EditorBubbleItem, useEditor } from "novel";
import { AlignCenter, AlignJustify, AlignRight, AlignLeft } from "lucide-react";
import type { SelectorItem } from "./node-selector";
import { Button } from "../ui/button";

export const AlignButtons = () => {
  const { editor } = useEditor();

  if (!editor) return null;

  const items: SelectorItem[] = [
    {
      name: "left",
      isActive: (editor) => {
        return editor?.isActive({ textAlign: "left" }) || false;
      },
      command: (editor) => {
        return editor?.chain().focus().setTextAlign("left").run();
      },
      icon: AlignLeft,
    },
    {
      name: "center",
      isActive: (editor) => {
        return editor?.isActive({ textAlign: "center" }) || false;
      },
      command: (editor) => {
        return editor?.chain().focus().setTextAlign("center").run();
      },
      icon: AlignCenter,
    },
    {
      name: "right",
      isActive: (editor) => {
        return editor?.isActive({ textAlign: "right" }) || false;
      },
      command: (editor) => {
        return editor?.chain().focus().setTextAlign("right").run();
      },
      icon: AlignRight,
    },
    {
      name: "justify",
      isActive: (editor) => {
        return editor?.isActive({ textAlign: "justify" }) || false;
      },
      command: (editor) => {
        return editor?.chain().focus().setTextAlign("justify").run();
      },
      icon: AlignJustify,
    },
  ];

  return (
    <div className="flex">
      {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor);
          }}
        >
          <Button size="icon" className="rounded-none" variant="ghost">
            <item.icon
              className={cn("h-4 w-4", {
                "text-blue-500": item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
