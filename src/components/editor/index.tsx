"use client";

import React, { useEffect, useRef, useState } from "react";
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

import { AlignButtons } from "./selectors/align-selector";

const extensions = [...defaultExtensions, slashCommand];

const Editor = ({
  index,
  totalPages,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  switchToNextSection,
  initialData,
}: {
  initialData: JSONContent;
  index: number;
  totalPages: number;
  onChange?: (data: {}) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  switchToNextSection?: () => void;
}) => {
  const initialContent = initialData;
  const editorRef = useRef<HTMLDivElement>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [openNode, setOpenNode] = useState(false);
  const [openAlignment, setOpenAlignment] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  useEffect(() => {
    const contentElement = document?.querySelector(".ProseMirror");
    console.log("contentElment", contentElement?.focus);
    // contentElement?.focus?.("end");
  }, []);

  useEffect(() => {
    if (!editorRef) return;
    console.log("ref va", editorRef.current);
    const updateSizeAndSwitch = () => {
      const editorElement = editorRef.current;
      if (!editorElement) return;
      const contentElement = editorElement?.querySelector(".ProseMirror");
      if (!contentElement) return;

      // Simple check for overflow. You might need a more complex calculation
      // depending on padding, border, and exact overflow conditions.
      const isOverflowing =
        contentElement?.scrollHeight > editorElement?.scrollHeight;
      console.log("contentElement.scrollHeight", contentElement.scrollHeight);
      console.log("editorElement.clientHeight", editorElement.scrollHeight);

      if (isOverflowing) {
        console.log("overflowing", isOverflowing);
        // if (switchToNextSection) switchToNextSection();
      } else {
        console.log("overflowing", isOverflowing);
      }
    };

    // Listen for input events to trigger size check
    // editorRef?.current?.view.dom.addEventListener("input", updateSizeAndSwitch);

    updateSizeAndSwitch();
    // Cleanup listener on unmount or editor change
    return () => {
      // editorRef?.current?.view.dom.removeEventListener(
      //   "input",
      //   updateSizeAndSwitch
      // );
    };
  });

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setSaveStatus("Saved");

      if (onChange) onChange(json);
    },
    500
  );

  // const handleKeyDown = (event) => {
  //   const selection = editorRef.state.selection;
  //   const { $cursor } = selection;
  //   const { $anchor } = selection;

  //   if ($cursor && $cursor.pos === editorRef.state.doc.content.size) {
  //     const nextContainer = containerRefs.current.find(
  //       (ref) => ref !== $anchor.nodeAfter.node
  //     );

  //     if (nextContainer) {
  //       const { from, to } = nextContainer;
  //       const tr = editorRef.state.tr.setSelection(
  //         selection.constructor.near(editorRef.state.doc.resolve(from))
  //       );
  //       editorRef.view.dispatch(tr);
  //       nextContainer.focus();
  //     }
  //   }
  // };

  const handleFocus = (event: any) => {
    const rect = event?.event?.target?.getBoundingClientRect();
    console.log("event focus", rect);
  };

  // const handleKeyDown = () => {
  //   if (editorRef.current) {
  //     const selection = editorRef.current.state.selection;
  //     const { $cursor } = selection;
  //     const { $anchor } = selection;

  //     if ($cursor && $cursor.pos === editorRef.state.doc.content.size) {
  //       const nextContainer = containerRefs.current.find(
  //         (ref) => ref !== $anchor.nodeAfter.node
  //       );

  //       if (nextContainer) {
  //         const { from, to } = nextContainer;
  //         const tr = editorRef.state.tr.setSelection(
  //           selection.constructor.near(editorRef.state.doc.resolve(from))
  //         );
  //         editorRef.view.dispatch(tr);
  //         nextContainer.focus();
  //       }
  //     }
  //   }
  // };

  if (!initialContent) return null;

  return (
    <div className="relative w-[21cm] h-[29.7cm]">
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

      <div className="absolute bottom-0  ml-[50%] -translate-x-[50%] z-10 mb-5 flex gap-3 items-center justify-center">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
          Page {index + 1} of {totalPages}
        </div>
      </div>

      <EditorRoot>
        <div ref={editorRef}>
          <EditorContent
            initialContent={initialContent}
            extensions={extensions}
            className="relative min-h-[500px] w-[21cm] h-[29.7cm] max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-sm sm:border sm:shadow-sm overflow-auto"
            editorProps={{
              ...defaultEditorProps,
              attributes: {
                class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
              },
            }}
            onUpdate={({ editor }) => {
              debouncedUpdates(editor);
              setSaveStatus("Saving ...");
            }}
            // onFocus={handleFocus}
            autofocus={"end"}
            slotAfter={<ImageResizer />}
          >
            <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
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

              <AlignButtons
                open={openAlignment}
                onOpenChange={setOpenAlignment}
              />
              <Separator orientation="vertical" />

              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </EditorBubble>
          </EditorContent>
        </div>
      </EditorRoot>
    </div>
  );
};

export default Editor;
