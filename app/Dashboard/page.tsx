"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Plus, Trash2 } from "lucide-react";

// Simulated API functions
const fetchOrganizations = async (): Promise<Organization[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: "1",
      name: "College A",
      address: "123 College St",
      email: "info@collegea.edu",
      phone: "123-456-7890",
      grades: [
        {
          id: "g1",
          name: "Grade 1",
          sections: [
            { id: "s1", name: "Section A" },
            { id: "s2", name: "Section B" },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "University B",
      address: "456 University Ave",
      email: "info@universityb.edu",
      phone: "987-654-3210",
      grades: [],
    },
  ];
};

const saveOrganization = async (org: Organization): Promise<Organization> => {
  console.log("Saving organization:", org);
  fetch(`/api/organizations/${org.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(org),
  });
  return org;
};

const createOrganization = async (name: string): Promise<Organization> => {
  fetch(`/api/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
};

// Interfaces
interface Section {
  id: string;
  name: string;
}

interface Grade {
  name: string;
  sections: Section[];
}

interface Organization {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  admins?: string[];
  username?: string;
  password?: string;
  grades: Grade[];
}

export default function CollegeManagement() {
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [newAdmin, setNewAdmin] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newSection, setNewSection] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [isNewOrgDialogOpen, setIsNewOrgDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  });

  const saveMutation = useMutation({
    mutationFn: saveOrganization,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["organizations"],
        (old: Organization[] | undefined) =>
          old ? old.map((org) => (org.id === data.id ? data : org)) : [data]
      );
    },
  });

  const createOrgMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["organizations"],
        (old: Organization[] | undefined) => (old ? [...old, data] : [data])
      );
      setSelectedOrg(data);
      setIsNewOrgDialogOpen(false);
    },
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleSaveChanges = () => {
    if (selectedOrg) {
      saveMutation.mutate(selectedOrg);
    }
  };

  const handleAddAdmin = () => {
    if (selectedOrg && newAdmin) {
      setSelectedOrg({
        ...selectedOrg,
        admins: [...(selectedOrg.admins || []), newAdmin],
      });
      setNewAdmin("");
    }
  };

  const handleAddGrade = () => {
    if (selectedOrg && newGrade) {
      const newGradeObj: Grade = {
        name: newGrade,
        sections: [],
      };
      setSelectedOrg({
        ...selectedOrg,
        grades: [...selectedOrg.grades, newGradeObj],
      });
      setNewGrade("");
    }
  };

  const handleAddSection = () => {
    if (selectedOrg && selectedGrade && newSection) {
      const updatedGrades = selectedOrg.grades.map((grade) => {
        if (grade.id === selectedGrade) {
          return {
            ...grade,
            sections: [...grade.sections],
          };
        }
        return grade;
      });
      setSelectedOrg({
        ...selectedOrg,
        grades: updatedGrades,
      });
      setNewSection("");
    }
  };

  const handleCreateNewOrg = () => {
    if (newOrgName) {
      createOrgMutation.mutate(newOrgName);
    }
  };

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold">College Management System</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                aria-label="Toggle dark mode"
              />
              <Moon className="h-4 w-4" />
            </div>
            <Dialog
              open={isNewOrgDialogOpen}
              onOpenChange={setIsNewOrgDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Organization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Organization</DialogTitle>
                  <DialogDescription>
                    Enter the name for the new organization.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Organization Name"
                />
                <DialogFooter>
                  <Button onClick={handleCreateNewOrg}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {organizations.map((org) => (
                    <Button
                      key={org.id}
                      variant={
                        selectedOrg?.id === org.id ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedOrg(org)}
                    >
                      {org.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {selectedOrg && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>{selectedOrg.name}</CardTitle>
                <CardDescription>Manage college information</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="admins">Admins</TabsTrigger>
                    <TabsTrigger value="grades">Grades</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">College Name</Label>
                      <Input
                        id="name"
                        value={selectedOrg.name}
                        onChange={(e) =>
                          setSelectedOrg({
                            ...selectedOrg,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={selectedOrg.address}
                        onChange={(e) =>
                          setSelectedOrg({
                            ...selectedOrg,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="admins" className="space-y-4">
                    <div className="space-y-2">
                      {selectedOrg.admins?.map((admin, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span>{admin}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOrg({
                                ...selectedOrg,
                                admins: selectedOrg.admins?.filter(
                                  (_, i) => i !== index
                                ),
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={newAdmin}
                        onChange={(e) => setNewAdmin(e.target.value)}
                        placeholder="New admin name"
                      />
                      <Button onClick={handleAddAdmin}>Add Admin</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="grades" className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        placeholder="New grade name"
                      />
                      <Button onClick={handleAddGrade}>Add Grade</Button>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {selectedOrg.grades.map((grade: any) => (
                        <AccordionItem value={grade.id} key={grade.id}>
                          <AccordionTrigger>{grade.name}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {grade.sections.map((section) => (
                                <div
                                  key={section.id}
                                  className="flex items-center justify-between"
                                >
                                  <span>{section.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const updatedGrades =
                                        selectedOrg.grades.map((g) => {
                                          if (g.id === grade.id) {
                                            return {
                                              ...g,
                                              sections: g.sections.filter(
                                                (s) => s.id !== section.id
                                              ),
                                            };
                                          }
                                          return g;
                                        });
                                      setSelectedOrg({
                                        ...selectedOrg,
                                        grades: updatedGrades,
                                      });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex space-x-2">
                                <Input
                                  value={newSection}
                                  onChange={(e) =>
                                    setNewSection(e.target.value)
                                  }
                                  placeholder="New section name"
                                />
                                <Button
                                  onClick={() => {
                                    setSelectedGrade(grade.id);
                                    handleAddSection();
                                  }}
                                >
                                  Add Section
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                  <TabsContent value="contact" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={selectedOrg.email}
                        onChange={(e) =>
                          setSelectedOrg({
                            ...selectedOrg,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={selectedOrg.phone}
                        onChange={(e) =>
                          setSelectedOrg({
                            ...selectedOrg,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="settings" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={selectedOrg.username || ""}
                        onChange={(e) =>
                          setSelectedOrg({
                            ...selectedOrg,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={selectedOrg.password || ""}
                        onChange={(e) =>
                          setSelectedOrg({
                            ...selectedOrg,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                <Separator className="my-4" />
                <div className="flex justify-end space-x-2">
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                  {saveMutation.isSuccess && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Saved Data</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Saved Data</DialogTitle>
                          <DialogDescription>
                            This is the data that was saved to the server.
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                          <pre className="text-sm">
                            <code>
                              {JSON.stringify(saveMutation.data, null, 2)}
                            </code>
                          </pre>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
