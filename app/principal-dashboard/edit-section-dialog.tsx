"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import StudentList from "./student-list";

interface EditSectionDialogProps {
  selectedSection: any;
  isEditing: boolean;
  onUpdateSection: (updatedSection: any) => void;
  onOpenChange: (open: boolean) => void;
}

export default function EditSectionDialog({
  selectedSection,
  isEditing,
  onUpdateSection,
  onOpenChange,
}: EditSectionDialogProps) {
  const [editedSection, setEditedSection] = useState(selectedSection);

  useEffect(() => {
    setEditedSection(selectedSection);
  }, [selectedSection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSection(editedSection);
  };

  if (!selectedSection) return null;

  return (
    <Dialog open={!!selectedSection} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            {selectedSection.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogTitle>
        </DialogHeader>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sectionName">Section Name</Label>
                <Input
                  id="sectionName"
                  value={editedSection?.name}
                  onChange={(e) =>
                    setEditedSection({
                      ...editedSection,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="sectionTeacher">Teacher</Label>
                <Input
                  id="sectionTeacher"
                  value={editedSection?.teacher}
                  onChange={(e) =>
                    setEditedSection({
                      ...editedSection,
                      teacher: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Students</Label>
                <Textarea
                  value={editedSection?.students.join(", ")}
                  onChange={(e) =>
                    setEditedSection({
                      ...editedSection,
                      students: e.target.value.split(", "),
                    })
                  }
                  placeholder="Enter student names separated by commas"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Teacher</Label>
              <p>{selectedSection?.teacher}</p>
            </div>
            <div>
              <Label>Students</Label>
              <StudentList students={selectedSection?.students} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
