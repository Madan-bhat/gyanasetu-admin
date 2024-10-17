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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditCollegeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collegeName: string;
  collegeImage: string;
  onUpdateCollege: (name: string, image: string) => void;
}

export default function EditCollegeDialog({
  open,
  onOpenChange,
  collegeName,
  collegeImage,
  onUpdateCollege,
}: EditCollegeDialogProps) {
  const [newName, setNewName] = useState(collegeName);
  const [newImage, setNewImage] = useState(collegeImage);

  const handleSave = () => {
    onUpdateCollege(newName, newImage);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit College Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="collegeName">College Name</Label>
            <Input
              id="collegeName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter college name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="collegeImage">College Image</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={newImage} alt="College logo" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Input
                id="collegeImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
