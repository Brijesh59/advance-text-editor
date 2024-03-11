import { cn } from "@/lib/utils";
import { EditorBubbleItem, useEditor } from "novel";
import {
  AlignCenter,
  AlignJustify,
  AlignRight,
  AlignLeft,
  ChevronDown,
} from "lucide-react";
import type { NodeSelectorProps, SelectorItem } from "./node-selector";
import { Button } from "../ui/button";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";

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

export const AlignButtons = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor();
  if (!editor) return null;
  const activeItem = items.filter((item) => item.isActive(editor)).pop() ?? {
    name: "Multiple",
  };

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        asChild
        className="gap-2 rounded-none border-none hover:bg-accent focus:ring-0"
      >
        <Button variant="ghost" className="gap-2">
          <span className="whitespace-nowrap text-sm">{activeItem.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5} align="start" className="w-15 p-1">
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
      </PopoverContent>
    </Popover>
  );
};
