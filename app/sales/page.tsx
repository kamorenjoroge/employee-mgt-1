"use client";

import { useState } from "react";
import { sales as mockSales, products, employees } from "@/lib/mockData";
import { Sale, SaleProduct } from "@/lib/types";
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [employeeId, setEmployeeId] = useState<string>("");
  const [saleProducts, setSaleProducts] = useState<SaleProduct[]>([]);

  // 🔍 filter sales
  const filteredSales = sales.filter(
    (sale) =>
      sale.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      sale.status.includes(search.toLowerCase())
  );

  // ➕ add empty product row
  const addProductRow = () => {
    setSaleProducts((prev) => [
      ...prev,
      {
        productId: 0,
        productName: "",
        quantity: 1,
        costValue: 0,
        sellingValue: 0,
        profit: 0,
        commission: 0,
      },
    ]);
  };

  // 🧮 handle product change
  const updateProduct = (
    index: number,
    product: typeof products[0],
    quantity: number
  ) => {
    const costValue = product.costPrice * quantity;
    const sellingValue = product.sellingPrice * quantity;
    const profit = sellingValue - costValue;
    const commission = Math.round(profit * 0.1);

    const updated = [...saleProducts];
    updated[index] = {
      productId: product.id,
      productName: product.name,
      quantity,
      costValue,
      sellingValue,
      profit,
      commission,
    };

    setSaleProducts(updated);
  };

  // 💾 save sale
  const saveSale = () => {
    if (!employeeId || saleProducts.length === 0) {
      toast.error("Employee and products are required");
      return;
    }

    const employee = employees.find((e) => e.id === Number(employeeId));
    if (!employee) return;

    const newSale: Sale = {
      id: sales.length + 1,
      employeeId: employee.id,
      employeeName: employee.name,
      products: saleProducts,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
    };

    setSales([newSale, ...sales]);
    setEmployeeId("");
    setSaleProducts([]);
    setOpen(false);

    toast.success("Sale recorded successfully");
  };

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Sale</Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Sale</DialogTitle>
            </DialogHeader>

            {/* Employee select */}
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Products */}
            <div className="space-y-3 pt-4">
              {saleProducts.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Select
                    onValueChange={(value) => {
                      const product = products.find(
                        (p) => p.id === Number(value)
                      );
                      if (product) updateProduct(index, product, item.quantity);
                    }}
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      if (product)
                        updateProduct(index, product, Number(e.target.value));
                    }}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSaleProducts((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addProductRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>

            <div className="flex justify-end">
              <Button onClick={saveSale}>Save Sale</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.employeeName}</TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.products.length}</TableCell>
                <TableCell>
                  <Badge>{sale.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
