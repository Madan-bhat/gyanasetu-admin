import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export const StudentList = ({
  students,
  onRemoveStudent,
}: {
  students: string[];
  onRemoveStudent: (student: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) =>
    student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Students ({students.length})</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Students</DialogTitle>
          <DialogDescription>
            List of all students in this section
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 opacity-50" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="space-y-2">
            {filteredStudents.map((student) => (
              <li
                key={student}
                className="flex justify-between items-center p-2 bg-muted rounded-md"
              >
                {student}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveStudent(student)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
