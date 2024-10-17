import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, UserPlus } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  subject: string;
}

interface SettingsTabProps {
  selectedSection: { id: number; name: string };
  collegeName: string;
  collegeImage: string;
  onUpdateCollege: (name: string, image: string) => void;
  teachers: Teacher[];
  onAddTeacher: (name: string, subject: string) => void;
  onRemoveTeacher: (id: number) => void;
}

export default function SettingsTab({
  selectedSection,
  collegeName,
  collegeImage,
  onUpdateCollege,
  teachers,
  onAddTeacher,
  onRemoveTeacher,
}: SettingsTabProps) {
  const [newCollegeName, setNewCollegeName] = useState(collegeName);
  const [newCollegeImage, setNewCollegeImage] = useState(collegeImage);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherSubject, setNewTeacherSubject] = useState("");

  const handleUpdateCollege = () => {
    onUpdateCollege(newCollegeName, newCollegeImage);
  };

  const handleAddTeacher = () => {
    if (newTeacherName && newTeacherSubject) {
      onAddTeacher(newTeacherName, newTeacherSubject);
      setNewTeacherName("");
      setNewTeacherSubject("");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>College Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                value={newCollegeName}
                onChange={(e) => setNewCollegeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collegeImage">College Image URL</Label>
              <Input
                id="collegeImage"
                value={newCollegeImage}
                onChange={(e) => setNewCollegeImage(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdateCollege}>Update College Info</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Teacher Name"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
              />
              <Input
                placeholder="Subject"
                value={newTeacherSubject}
                onChange={(e) => setNewTeacherSubject(e.target.value)}
              />
              <Button onClick={handleAddTeacher}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveTeacher(teacher.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
