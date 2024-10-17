import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Student {
  id: number;
  name: string;
  rollNo: string;
}

interface AttendanceRecord {
  date: string;
  present: boolean;
}

interface Section {
  id: number;
  name: string;
  students: Student[];
}

interface AttendanceTabProps {
  selectedSection: Section;
}

export default function AttendanceTab({ selectedSection }: AttendanceTabProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<
    Record<string, AttendanceRecord>
  >({});

  useEffect(() => {
    if (selectedSection) {
      const newAttendanceData: Record<string, AttendanceRecord> = {};
      selectedSection.students.forEach((student) => {
        const key = `${student.rollNo}-${format(date, "yyyy-MM-dd")}`;
        if (!attendanceData[key]) {
          newAttendanceData[key] = {
            date: format(date, "yyyy-MM-dd"),
            present: Math.random() < 0.9, // 90% chance of being present
          };
        }
      });
      setAttendanceData((prev) => ({ ...prev, ...newAttendanceData }));
    }
  }, [date, selectedSection]);

  const handleAttendanceChange = (studentRollNo: string) => {
    const key = `${studentRollNo}-${format(date, "yyyy-MM-dd")}`;
    setAttendanceData((prev) => ({
      ...prev,
      [key]: { ...prev[key], present: !prev[key].present },
    }));
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Roll No.", "Attendance"];
    const tableRows: string[][] = [];

    selectedSection.students.forEach((student) => {
      const key = `${student.rollNo}-${format(date, "yyyy-MM-dd")}`;
      const isPresent = attendanceData[key]?.present;
      const rowData = [
        student.name,
        student.rollNo,
        isPresent ? "Present" : "Absent",
      ];
      tableRows.push(rowData);
    });

    doc.setFontSize(20);
    doc.text(
      `Attendance Report - ${selectedSection.name} - ${format(
        date,
        "MMMM d, yyyy"
      )}`,
      14,
      15
    );
    // doc?.table({
    //   head: [tableColumn],
    //   body: tableRows,
    //   startY: 25,
    // });

    doc.save(
      `attendance_report_${selectedSection.name}_${format(
        date,
        "yyyy-MM-dd"
      )}.pdf`
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
          />
        </div>
        <Button onClick={generateReport}>
          <FileDown className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            Attendance for {format(date, "MMMM d, yyyy")} -{" "}
            {selectedSection.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {selectedSection.students.map((student) => {
                  const key = `${student.rollNo}-${format(date, "yyyy-MM-dd")}`;
                  const isPresent = attendanceData[key]?.present;
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>
                        <Button
                          variant={isPresent ? "default" : "outline"}
                          onClick={() => handleAttendanceChange(student.rollNo)}
                        >
                          {isPresent ? "Present" : "Absent"}
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
