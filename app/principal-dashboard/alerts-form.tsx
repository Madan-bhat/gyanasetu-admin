"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AlertForm() {
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const handleSendAlert = () => {
    console.log(`Sending alert "${alertMessage}" to ${selectedGroup}`);
    setAlertMessage("");
    setSelectedGroup("");
  };

  return (
    <div className="space-y-4">
      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
        <SelectTrigger>
          <SelectValue placeholder="Select group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Students</SelectItem>
          <SelectItem value="teachers">All Teachers</SelectItem>
          <SelectItem value="grade1">Grade 1</SelectItem>
          <SelectItem value="grade2">Grade 2</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        placeholder="Enter alert message"
        value={alertMessage}
        onChange={(e) => setAlertMessage(e.target.value)}
      />
      <Button
        onClick={handleSendAlert}
        disabled={!selectedGroup || !alertMessage}
      >
        Send Alert
      </Button>
    </div>
  );
}
