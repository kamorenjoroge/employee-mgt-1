"use client";

import { useState } from "react";
import { sales as mockSales } from "@/lib/mockData";
import { Sale } from "@/lib/types";
import {
  SaleReconciliation,
  ReturnedProduct,
} from "@/lib/types";

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
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function SalesReconciliationPage() {
  const [sales] = useState<Sale[]>(mockSales);
  const [reconciliations, setReconciliations] = useState<
    SaleReconciliation[]
  >([]);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [selectedSaleId, setSelectedSaleId] = useState<string>("");
  const [returnedProducts, setReturnedProducts] = useState<ReturnedProduct[]>(
    []
  );
  const [reason, setReason] =
    useState<SaleReconciliation["reason"]>("customer-return");

  // 🔍 filter reconciliations
  const filtered = reconciliations.filter(
    (rec) =>
      rec.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      rec.status.includes(search.toLowerCase())
  );

  // 📦 load products from selected sale
  const handleSaleSelect = (saleId: string) => {
    setSelectedSaleId(saleId);

    const sale = sales.find((s) => s.id === Number(saleId));
    if (!sale) return;

    setReturnedProducts(
      sale.products.map((p) => ({
        productId: p.productId,
        productName: p.productName,
        quantityReturned: 0,
      }))
    );
  };

  // 🔄 update returned quantity
  const updateReturnedQuantity = (index: number, quantity: number) => {
    const updated = [...returnedProducts];
    updated[index].quantityReturned = quantity;
    setReturnedProducts(updated);
  };

  // 💾 save reconciliation
  const saveReconciliation = () => {
    const sale = sales.find((s) => s.id === Number(selectedSaleId));
    if (!sale) {
      toast.error("Sale is required");
      return;
    }

    const hasReturns = returnedProducts.some(
      (p) => p.quantityReturned > 0
    );
    if (!hasReturns) {
      toast.error("Returned quantity must be greater than zero");
      return;
    }

    const newReconciliation: SaleReconciliation = {
      id: reconciliations.length + 1,
      saleId: sale.id,
      employeeId: sale.employeeId,
      employeeName: sale.employeeName,
      returnedProducts: returnedProducts.filter(
        (p) => p.quantityReturned > 0
      ),
      reason,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setReconciliations([newReconciliation, ...reconciliations]);
    setOpen(false);
    setSelectedSaleId("");
    setReturnedProducts([]);

    toast.success("Sales reconciliation created");
  };

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reconciliations..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Reconcile Sale
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Sales Reconciliation</DialogTitle>
            </DialogHeader>

            {/* Sale select */}
            <Select value={selectedSaleId} onValueChange={handleSaleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select sale" />
              </SelectTrigger>
              <SelectContent>
                {sales.map((sale) => (
                  <SelectItem
                    key={sale.id}
                    value={sale.id.toString()}
                  >
                    {sale.employeeName} — {sale.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reason */}
            <Select value={reason} onValueChange={(value) => setReason(value as SaleReconciliation["reason"])}>
              <SelectTrigger>
                <SelectValue placeholder="Return reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer-return">
                  Customer Return
                </SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
                <SelectItem value="wrong-item">Wrong Item</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Returned products */}
            <div className="space-y-3 pt-4">
              {returnedProducts.map((item, index) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4"
                >
                  <div className="flex-1 text-sm">
                    {item.productName}
                  </div>

                  <Input
                    type="number"
                    min={0}
                    value={item.quantityReturned}
                    onChange={(e) =>
                      updateReturnedQuantity(
                        index,
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={saveReconciliation}>
                Save Reconciliation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reconciliation table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Sale ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((rec) => (
              <TableRow key={rec.id}>
                <TableCell>{rec.employeeName}</TableCell>
                <TableCell>#{rec.saleId}</TableCell>
                <TableCell>{rec.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      rec.status === "approved"
                        ? "default"
                        : rec.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {rec.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
