"use client";

import React, { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  defaultEditorProps,
  EditorInstance,
  EditorRoot,
  EditorBubble,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
} from "novel";
import { ImageResizer } from "novel/extensions";

import { defaultExtensions } from "./extensions";
import { Separator } from "./ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { ColorSelector } from "./selectors/color-selector";

import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import { ColumnExtension } from "@gocapsule/column-extension";
import { AlignButtons } from "./selectors/align-selector";
// import "@gocapsule/column-extension/src/index.css";

const extensions = [...defaultExtensions, ColumnExtension, slashCommand];

const A4_PAGE_HEIGHT = 1123;

const Content = ({
  onChange,
  initialData,
  setSaveStatus,
}: {
  initialData: JSONContent;
  onChange?: (data: {}) => void;
  setSaveStatus: (s: string) => void;
  onApproachingEnd?: (clientHeight: number) => void;
}) => {
  const editorRef = useRef<any>(null);

  const initialContent = initialData;

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setSaveStatus("Saved");

      if (onChange) onChange(json);
    },
    500
  );

  const insertPageBreakMarkers = () => {
    // Assuming editorContainerRef is the ref to the .editor-container
    const container = editorRef.current;
    if (!container) return;

    // Clear existing markers before re-inserting
    const existingMarkers = container.querySelectorAll(".page-break-marker");
    existingMarkers.forEach((marker: any) => marker.remove());

    const contentHeight = container.scrollHeight;
    const numberOfPages = Math.floor(contentHeight / A4_PAGE_HEIGHT);

    for (let i = 1; i <= numberOfPages; i++) {
      const marker = document.createElement("div");
      marker.className = "page-break-marker";
      marker.style.position = "absolute";
      marker.style.left = "0";
      marker.style.width = "100%";
      marker.style.borderTop = "1.5px dashed lightgray";
      marker.style.top = `${A4_PAGE_HEIGHT * i}px`;

      const label = document.createElement("span");
      label.textContent = "PDF page break";
      label.style.position = "absolute";
      label.style.left = "-110px";
      label.style.bottom = "-10px";

      label.style.color = "gray";
      label.style.fontSize = "12px";

      label.style.padding = "2px 5px";

      marker.appendChild(label);
      container.appendChild(marker);
    }
  };

  if (!initialContent) return null;

  return (
    <div ref={editorRef} className="editor-container">
      <EditorContent
        initialContent={initialContent}
        extensions={[...extensions]}
        autofocus
        className="relative min-h-[29.7cm] w-[21cm] border-muted bg-background sm:rounded-sm sm:border sm:shadow-sm"
        editorProps={{
          ...defaultEditorProps,
          attributes: {
            class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
          },
        }}
        onUpdate={({ editor }) => {
          debouncedUpdates(editor);

          insertPageBreakMarkers();
          setSaveStatus("Saving ...");
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>

          {suggestionItems.map((item: any) => (
            <EditorCommandItem
              value={item.title}
              onCommand={(val) => item.command(val)}
              className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
              key={item.title}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                {item.icon}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </EditorCommandItem>
          ))}
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl"
        >
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />

          <TextButtons />
          <Separator orientation="vertical" />

          <AlignButtons />
          <Separator orientation="vertical" />

          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </div>
  );
};

const Editor = ({
  index,
  totalPages,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  initialData,
}: {
  initialData: JSONContent;
  index: number;
  totalPages: number;
  onChange?: (data: {}) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) => {
  const initialContent = initialData;

  const [saveStatus, setSaveStatus] = useState("Saved");

  if (!initialContent) return null;

  return (
    <div className="relative w-[21cm] bg-red-100">
      <div className="absolute right-5 top-5 z-10 mb-5 flex gap-3 items-center justify-center">
        {/* Hide on first page */}
        {index !== 0 && (
          <button
            onClick={onMoveUp}
            className="hover:bg-gray-100 transition-all duration-150 rounded-sm p-1"
          >
            <ArrowUp className="text-muted-foreground text-sm" size={20} />
          </button>
        )}

        {/* Hide on last page, and first page(if only one page is there) */}
        {totalPages > 1 && index !== totalPages - 1 && (
          <button
            onClick={onMoveDown}
            className="hover:bg-gray-100 transition-all duration-150 rounded-sm p-1"
          >
            <ArrowDown className="text-muted-foreground text-sm" size={20} />
          </button>
        )}

        {/* Only show if there are more than one pages */}
        {totalPages > 1 && (
          <button
            onClick={onRemove}
            className="hover:bg-red-100 transition-all duration-150 rounded-sm p-1"
          >
            <Trash2 className="text-red-400 text-sm" size={20} />
          </button>
        )}

        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          {saveStatus}
        </div>
      </div>

      <div className="absolute bottom-0 ml-[50%] -translate-x-[50%] z-10 mb-5 flex gap-3 items-center justify-center">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          Page {index + 1} of {totalPages}
        </div>
      </div>

      <EditorRoot>
        <Content
          onChange={onChange}
          initialData={initialData}
          setSaveStatus={setSaveStatus}
        />
      </EditorRoot>
    </div>
  );
};

export default Editor;
