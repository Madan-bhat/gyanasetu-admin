"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddGradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGrade: (gradeName: string) => void;
}

export default function AddGradeDialog({
  isOpen,
  onClose,
  onAddGrade,
}: AddGradeDialogProps) {
  const [gradeName, setGradeName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gradeName.trim()) {
      onAddGrade(gradeName.trim());
      setGradeName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Grade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gradeName" className="text-right">
                Grade Name
              </Label>
              <Input
                id="gradeName"
                value={gradeName}
                onChange={(e) => setGradeName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 10th Grade"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Grade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
