"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bell, Send, UserPlus } from "lucide-react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import AlertForm from "./alerts-form";
import AttendanceTab from "./attendence-tab";
import NotificationsTab from "./notifications-tab";
import EventsTab from "./events-tab";
import ChatTab from "./chat-tab";
import SettingsTab from "./settings-tab";
import EditCollegeDialog from "./edit-college-dialog";
import EditSectionDialog from "./edit-section-dialog";
import AddGradeDialog from "./add-grade-dialog";
import DeleteConfirmationDialog from "./delete-confirmation-alert";
import TimeTableTab from "./time-table-tab";

interface Grade {
  id: number;
  name: string;
  sections: Section[];
}

interface Section {
  id: number;
  name: string;
  teacher: string;
  students: Student[];
}

interface Student {
  id: number;
  name: string;
  rollNo: string;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
}

export default function PrincipalDashboard() {
  const [collegeName, setCollegeName] = useState(
    "Mahathma Gandhi Memorial College"
  );
  const [collegeImage, setCollegeImage] = useState("/placeholder.svg");
  const [grades, setGrades] = useState<Grade[]>([
    {
      id: 1,
      name: "11th Grade",
      sections: [
        { id: 1, name: "S1", teacher: "Mr. Brown", students: [] },
        { id: 2, name: "S2", teacher: "Ms. Davis", students: [] },
        { id: 3, name: "S3", teacher: "Mrs. Wilson", students: [] },
        { id: 4, name: "S4", teacher: "Mr. Anderson", students: [] },
        { id: 5, name: "S5", teacher: "Ms. Thompson", students: [] },
        { id: 6, name: "C1", teacher: "Mr. Harris", students: [] },
        { id: 7, name: "C2", teacher: "Mrs. Clark", students: [] },
      ],
    },
    {
      id: 2,
      name: "12th Grade",
      sections: [
        { id: 8, name: "S1", teacher: "Mr. White", students: [] },
        { id: 9, name: "S2", teacher: "Ms. Green", students: [] },
        { id: 10, name: "S3", teacher: "Mrs. Black", students: [] },
        { id: 11, name: "S4", teacher: "Mr. Taylor", students: [] },
        { id: 12, name: "S5", teacher: "Ms. Martin", students: [] },
        { id: 13, name: "C1", teacher: "Mr. Lewis", students: [] },
        { id: 14, name: "C2", teacher: "Mrs. Walker", students: [] },
      ],
    },
  ]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<Section | null>(null);
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<{
    gradeId: number;
    sectionId: number;
  } | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: 1, name: "Mr. Brown", subject: "Mathematics" },
    { id: 2, name: "Ms. Davis", subject: "Science" },
    { id: 3, name: "Mrs. Wilson", subject: "English" },
    { id: 4, name: "Mr. Anderson", subject: "History" },
    { id: 5, name: "Ms. Thompson", subject: "Physics" },
  ]);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleEditCollege = () => {
    setIsEditingCollege(true);
  };

  const handleUpdateCollege = (newName: string, newImage: string) => {
    setCollegeName(newName);
    setCollegeImage(newImage);
    setIsEditingCollege(false);
  };

  const handleSelectSection = (section: Section) => {
    setSelectedSection(section);
  };

  const handleEditSection = (gradeId: number, section: Section) => {
    setSectionToEdit(section);
    setIsEditingSection(true);
  };

  const handleUpdateSection = (updatedSection: Section) => {
    const updatedGrades = grades.map((grade) => ({
      ...grade,
      sections: grade.sections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      ),
    }));
    setGrades(updatedGrades);
    if (selectedSection && selectedSection.id === updatedSection.id) {
      setSelectedSection(updatedSection);
    }
    setSectionToEdit(null);
    setIsEditingSection(false);
  };

  const handleAddGrade = (gradeName: string) => {
    const newGrade: Grade = {
      id: Math.max(...grades.map((g) => g.id), 0) + 1,
      name: gradeName,
      sections: [],
    };
    setGrades([...grades, newGrade]);
  };

  const handleAddSection = (gradeId: number) => {
    const updatedGrades = grades.map((grade) => {
      if (grade.id === gradeId) {
        const newSection: Section = {
          id: Math.max(...grade.sections.map((s) => s.id), 0) + 1,
          name: `Section ${String.fromCharCode(65 + grade.sections.length)}`,
          teacher: "",
          students: [],
        };
        return { ...grade, sections: [...grade.sections, newSection] };
      }
      return grade;
    });
    setGrades(updatedGrades);
  };

  const handleDeleteSection = (gradeId: number, sectionId: number) => {
    setSectionToDelete({ gradeId, sectionId });
    setIsConfirmingDelete(true);
  };

  const confirmDeleteSection = () => {
    if (sectionToDelete) {
      const { gradeId, sectionId } = sectionToDelete;
      const updatedGrades = grades.map((grade) => {
        if (grade.id === gradeId) {
          return {
            ...grade,
            sections: grade.sections.filter(
              (section) => section.id !== sectionId
            ),
          };
        }
        return grade;
      });
      setGrades(updatedGrades);
      if (selectedSection && selectedSection.id === sectionId) {
        setSelectedSection(null);
      }
    }
    setIsConfirmingDelete(false);
    setSectionToDelete(null);
  };

  const handleAddTeacher = (name: string, subject: string) => {
    const newTeacher: Teacher = {
      id: Math.max(...teachers.map((t) => t.id), 0) + 1,
      name,
      subject,
    };
    setTeachers([...teachers, newTeacher]);
  };

  const handleRemoveTeacher = (teacherId: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar collegeName={collegeName} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar
          grades={grades}
          onEditCollege={handleEditCollege}
          onSelectSection={handleSelectSection}
          onAddGrade={() => setIsAddingGrade(true)}
          onAddSection={handleAddSection}
          onDeleteSection={handleDeleteSection}
          onEditSection={handleEditSection}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          {selectedSection ? (
            <Tabs defaultValue="events">
              <TabsList>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                {/* <TabsTrigger value="timetable">Time Table</TabsTrigger> */}
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="events">
                <EventsTab selectedSection={selectedSection} />
              </TabsContent>
              <TabsContent value="attendance">
                <AttendanceTab selectedSection={selectedSection} />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationsTab selectedSection={selectedSection} />
              </TabsContent>
              <TabsContent value="chat">
                <ChatTab selectedSection={selectedSection} />
              </TabsContent>
              {/* <TabsContent value="timetable">
                {/* <TimeTableTab selectedSection={selectedSection} /> */}
              {/* </TabsContent> */}
              <TabsContent value="settings">
                <SettingsTab
                  selectedSection={selectedSection}
                  collegeName={collegeName}
                  collegeImage={collegeImage}
                  onUpdateCollege={handleUpdateCollege}
                  teachers={teachers}
                  onAddTeacher={handleAddTeacher}
                  onRemoveTeacher={handleRemoveTeacher}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Welcome to the Principal Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Please select a section from the sidebar to view details.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <EditCollegeDialog
        open={isEditingCollege}
        onOpenChange={setIsEditingCollege}
        collegeName={collegeName}
        collegeImage={collegeImage}
        onUpdateCollege={handleUpdateCollege}
      />

      <EditSectionDialog
        selectedSection={sectionToEdit}
        isEditing={isEditingSection}
        onUpdateSection={handleUpdateSection}
        onOpenChange={(open) => {
          if (!open) setSectionToEdit(null);
          setIsEditingSection(open);
        }}
      />

      <AddGradeDialog
        isOpen={isAddingGrade}
        onClose={() => setIsAddingGrade(false)}
        onAddGrade={handleAddGrade}
      />

      <DeleteConfirmationDialog
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={confirmDeleteSection}
        itemToDelete="section"
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-4 right-4">
            <Send className="mr-2 h-4 w-4" />
            Send Alert
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Alert</DialogTitle>
          </DialogHeader>
          <AlertForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
