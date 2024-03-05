"use client";

import TiptapEditor from "@/components/editor";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { PlusSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { defaultEditorContent } from "@/lib/content";

function insertItemAfterIndex(array: any[], index: number, item: any) {
  array.splice(index + 1, 0, item);
  return array;
}

function moveItem(array: any[], index: number, moveUp: boolean) {
  // Validate index range
  if (index < 0 || index >= array.length) {
    console.error("Index out of bounds.");
    return array;
  }

  // Calculate the new index
  const newIndex = moveUp ? index - 1 : index + 1;

  // Check if movement is possible
  if (newIndex < 0 || newIndex >= array.length) {
    console.error("Movement not possible.");
    return array;
  }

  // Perform the swap
  [array[index], array[newIndex]] = [array[newIndex], array[index]];

  return array;
}

const App = () => {
  const [sections, setSections] = useState([
    {
      id: nanoid(),
      data: defaultEditorContent,
    },
  ]);

  const addNewSection = (currentSectionIndex: number) => {
    const sectionsCopy = [...sections];

    const newSections = insertItemAfterIndex(
      sectionsCopy,
      currentSectionIndex,
      {
        id: nanoid(),
        data: defaultEditorContent,
      }
    );

    return setSections(newSections);
  };

  const removeSection = (sectionId: string) => {
    // Prevent deleting all pages. Atleast keep 1 page
    if (sections.length === 1) return;

    const sectionsCopy = [...sections];
    const index = sectionsCopy.findIndex((s) => s.id === sectionId);

    if (index !== -1) {
      sectionsCopy.splice(index, 1);
      setSections(sectionsCopy);

      window.localStorage.setItem("sections", JSON.stringify(sectionsCopy));
    }
  };

  const reArrangeSection = (sectionId: string, position: "up" | "down") => {
    // Cannot reArrange if only 1 section exists
    if (sections.length === 1) return;

    const sectionsCopy = [...sections];
    const index = sectionsCopy.findIndex((s) => s.id === sectionId);

    // Add Other checks, if it's the last, we cannot move down, if its the first section, we cannot move it up
    if (index === 0 && position === "up")
      return console.error("Cannot move First page up");

    if (index === sections.length - 1 && position === "down")
      return console.error("Cannot move Last page down");

    const newlyArrangedSections = moveItem(
      sectionsCopy,
      index,
      position === "up" ? true : false
    );

    setSections(newlyArrangedSections);

    window.localStorage.setItem(
      "sections",
      JSON.stringify(newlyArrangedSections)
    );
  };

  const onChange = (data: {}, id: string) => {
    const sectionsCopy = [...sections];
    const currentSection = sectionsCopy.find((s) => s.id === id);

    if (currentSection) {
      currentSection.data = data;
    }

    setSections(sectionsCopy);

    window.localStorage.setItem("sections", JSON.stringify(sectionsCopy));
  };

  useEffect(() => {
    const _sections = window.localStorage.getItem("sections");
    if (_sections) {
      const sections = JSON.parse(_sections);
      setSections(sections);
    }
  }, []);

  return (
    <div className="flex flex-col gap-5 items-center justify-center my-20">
      {sections.map((section, index) => {
        return (
          <div
            key={section.id}
            className="flex flex-col gap-5 items-center justify-center"
          >
            <TiptapEditor
              initialData={section.data}
              index={index}
              totalPages={sections.length}
              onChange={(data) => onChange(data, section.id)}
              onRemove={() => removeSection(section.id)}
              onMoveUp={() => reArrangeSection(section.id, "up")}
              onMoveDown={() => reArrangeSection(section.id, "down")}
            />

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => addNewSection(index)}
                  className="p-2"
                >
                  <PlusSquare className="text-gray-500 hover:scale-105 transition-all duration-200" />
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white">
                  <p>Add a new page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      })}
    </div>
  );
};

export default App;
