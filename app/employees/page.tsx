"use client";

import { useState } from "react";
import { employees as mockEmployees, Employee } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Search, UserPlus, Edit, Trash2, Phone, Mail, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/common/Form";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone.includes(search)
  );

  // Add employee handler
  const handleAddEmployee = (data: Record<string, string>) => {
    const newEmployee: Employee = {
      id: employees.length + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      commissionRate: parseFloat(data.commissionRate),
      totalGoodsAssigned: 0,
      totalSales: 0,
      commissionEarned: 0,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setEmployees([newEmployee, ...employees]);
    setIsAddOpen(false);
    toast.success("Employee added successfully");
  };

  // Edit employee handler
  const handleEditEmployee = (data: Record<string, string>) => {
    if (!editEmployee) return;

    const updatedEmployees = employees.map((emp) =>
      emp.id === editEmployee.id
        ? {
            ...emp,
            name: data.name,
            email: data.email,
            phone: data.phone,
            commissionRate: parseFloat(data.commissionRate),
          }
        : emp
    );

    setEmployees(updatedEmployees);
    setEditEmployee(null);
    toast.success("Employee updated successfully");
  };

  // Delete employee handler
  const handleDeleteEmployee = (id: number, name: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
    toast.success(`${name} deleted successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search + Add */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Add Employee button */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in the employee details below
              </DialogDescription>
            </DialogHeader>

            <Form
              fields={[
                {
                  name: "name",
                  label: "Full Name",
                  type: "text",
                  required: true,
                },
                {
                  name: "email",
                  label: "Email Address",
                  type: "email",
                  required: true,
                },
                {
                  name: "phone",
                  label: "Phone Number",
                  type: "text",
                  required: true,
                },
                {
                  name: "commissionRate",
                  label: "Commission Rate (%)",
                  type: "number",
                  required: true,
                },
              ]}
              onSubmit={handleAddEmployee}
              submitLabel="Add Employee"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="sm:hidden space-y-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <Card key={emp.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base">{emp.name}</h3>
                  <Badge
                    variant={emp.status === "active" ? "default" : "secondary"}
                    className={
                      emp.status === "active"
                        ? "bg-success text-white mt-1"
                        : "bg-gray-400 mt-1"
                    }
                  >
                    {emp.status}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Dialog
                    open={editEmployee?.id === emp.id}
                    onOpenChange={(open) => !open && setEditEmployee(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditEmployee(emp)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>
                          Update employee information
                        </DialogDescription>
                      </DialogHeader>

                      <Form
                        fields={[
                          {
                            name: "name",
                            label: "Full Name",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "email",
                            label: "Email Address",
                            type: "email",
                            required: true,
                          },
                          {
                            name: "phone",
                            label: "Phone Number",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "commissionRate",
                            label: "Commission Rate (%)",
                            type: "number",
                            required: true,
                          },
                        ]}
                        initialData={
                          editEmployee
                            ? {
                                name: editEmployee.name,
                                email: editEmployee.email,
                                phone: editEmployee.phone,
                                commissionRate: String(editEmployee.commissionRate),
                              }
                            : {}
                        }
                        onSubmit={handleEditEmployee}
                        submitLabel="Update Employee"
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{emp.phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Package className="h-3 w-3" />
                      <span className="text-xs">Commission</span>
                    </div>
                    <div className="font-medium">{emp.commissionRate}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-gray-500">
                      <DollarSign className="h-3 w-3" />
                      <span className="text-xs">Earned</span>
                    </div>
                    <div className="font-medium text-success">
                      KES {emp.commissionEarned.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No employees found</p>
          </Card>
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden sm:block">
        <Card className="border-0 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Commission %</TableHead>
                  <TableHead>Goods Assigned</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Commission Earned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.phone}</TableCell>
                      <TableCell>{emp.commissionRate}%</TableCell>
                      <TableCell>
                        KES {emp.totalGoodsAssigned.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        KES {emp.totalSales.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        KES {emp.commissionEarned.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            emp.status === "active" ? "default" : "secondary"
                          }
                          className={
                            emp.status === "active"
                              ? "bg-success text-white"
                              : "bg-gray-400"
                          }
                        >
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={editEmployee?.id === emp.id}
                            onOpenChange={(open) =>
                              !open && setEditEmployee(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditEmployee(emp)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Employee</DialogTitle>
                                <DialogDescription>
                                  Update employee information
                                </DialogDescription>
                              </DialogHeader>

                              <Form
                                fields={[
                                  {
                                    name: "name",
                                    label: "Full Name",
                                    type: "text",
                                    required: true,
                                  },
                                  {
                                    name: "email",
                                    label: "Email Address",
                                    type: "email",
                                    required: true,
                                  },
                                  {
                                    name: "phone",
                                    label: "Phone Number",
                                    type: "text",
                                    required: true,
                                  },
                                  {
                                    name: "commissionRate",
                                    label: "Commission Rate (%)",
                                    type: "number",
                                    required: true,
                                  },
                                ]}
                                initialData={
                                  editEmployee
                                    ? {
                                        name: editEmployee.name,
                                        email: editEmployee.email,
                                        phone: editEmployee.phone,
                                        commissionRate: String(editEmployee.commissionRate),
                                      }
                                    : {}
                                }
                                onSubmit={handleEditEmployee}
                                submitLabel="Update Employee"
                              />
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <p className="text-gray-500">No employees found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Summary Footer */}
      <div className="text-sm text-gray-500">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>
    </div>
  );
}