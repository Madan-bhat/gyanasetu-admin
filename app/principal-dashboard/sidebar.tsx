import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Plus, Settings, Trash2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Grade {
  id: number;
  name: string;
  sections: Section[];
}

interface Section {
  id: number;
  name: string;
}

interface SidebarProps {
  grades: Grade[];
  onEditCollege: () => void;
  onSelectSection: (section: Section) => void;
  onAddGrade: () => void;
  onAddSection: (gradeId: number) => void;
  onDeleteSection: (gradeId: number, sectionId: number) => void;
  onEditSection: (gradeId: number, section: Section) => void;
}

export default function Sidebar({
  grades,
  onEditCollege,
  onSelectSection,
  onAddGrade,
  onAddSection,
  onDeleteSection,
  onEditSection,
}: any) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<{
    gradeId: number;
    sectionId: number;
  } | null>(null);

  const handleSelectSection = (section: Section) => {
    setSelectedSection(section);
    onSelectSection(section);
  };

  const handleDeleteSection = (gradeId: number, sectionId: number) => {
    setSectionToDelete({ gradeId, sectionId });
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete) {
      onDeleteSection(sectionToDelete.gradeId, sectionToDelete.sectionId);
    }
    setIsDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-muted/40 p-4 border-r h-[calc(100vh-64px)] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Grades & Sections</h2>
        <Button variant="ghost" size="icon" onClick={onEditCollege}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <AnimatePresence>
        {grades.map((grade: any) => (
          <Collapsible key={grade.id} className="mb-2">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-muted rounded-md">
              <span className="font-semibold">{grade.name}</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 mt-1">
              {grade.sections.map((section: any) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between p-2 hover:bg-muted rounded-md ${
                    selectedSection?.id === section.id ? "bg-muted" : ""
                  }`}
                >
                  <span
                    className="cursor-pointer flex-grow"
                    onClick={() => handleSelectSection(section)}
                  >
                    {section.name}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditSection(grade.id, section);
                      }}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(grade.id, section.id);
                      }}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => onAddSection(grade.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </AnimatePresence>
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-4"
        onClick={onAddGrade}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Grade
      </Button>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected section and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSection}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
