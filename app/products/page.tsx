"use client";

import { useState } from "react";
import { products as mockProducts, Product } from "@/lib/mockData";

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

import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/common/Form";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add product
  const handleAddProduct = (data: Record<string, string>) => {
    const newProduct: Product = {
      id: products.length + 1,
      name: data.name,
      costPrice: Number(data.costPrice),
      sellingPrice: Number(data.sellingPrice),
      quantity: Number(data.quantity),
      status: data.status as Product["status"],
    };

    setProducts([newProduct, ...products]);
    setIsAddOpen(false);
    toast.success("Product added successfully");
  };

  // Edit product
  const handleEditProduct = (data: Record<string, string>) => {
    if (!editProduct) return;

    const updatedProducts = products.map((p) =>
      p.id === editProduct.id
        ? {
            ...p,
            name: data.name,
            costPrice: Number(data.costPrice),
            sellingPrice: Number(data.sellingPrice),
            quantity: Number(data.quantity),
            status: data.status as Product["status"],
          }
        : p
    );

    setProducts(updatedProducts);
    setEditProduct(null);
    toast.success("Product updated successfully");
  };

  // Delete product
  const handleDeleteProduct = (id: number, name: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success(`${name} deleted successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Add Product */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the product details
              </DialogDescription>
            </DialogHeader>

            <Form
              fields={[
                { name: "name", label: "Product Name", type: "text", required: true },
                { name: "costPrice", label: "Cost Price", type: "number", required: true },
                { name: "sellingPrice", label: "Selling Price", type: "number", required: true },
                { name: "quantity", label: "Quantity", type: "number", required: true },
                { name: "status", label: "Status", type: "text", required: true },
              ]}
              onSubmit={handleAddProduct}
              submitLabel="Add Product"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="p-4 space-y-3">
              <div className="flex justify-between">
                <h3 className="font-semibold">{product.name}</h3>
                <Badge>{product.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <DollarSign className="h-3 w-3" />
                    Cost
                  </div>
                  <div>KES {product.costPrice}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Package className="h-3 w-3" />
                    Quantity
                  </div>
                  <div>{product.quantity}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Dialog
                  open={editProduct?.id === product.id}
                  onOpenChange={(open) => !open && setEditProduct(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>

                    <Form
                      fields={[
                        { name: "name", label: "Product Name", type: "text", required: true },
                        { name: "costPrice", label: "Cost Price", type: "number", required: true },
                        { name: "sellingPrice", label: "Selling Price", type: "number", required: true },
                        { name: "quantity", label: "Quantity", type: "number", required: true },
                        { name: "status", label: "Status", type: "text", required: true },
                      ]}
                      initialData={{
                        name: product.name,
                        costPrice: String(product.costPrice),
                        sellingPrice: String(product.sellingPrice),
                        quantity: String(product.quantity),
                        status: product.status,
                      }}
                      onSubmit={handleEditProduct}
                      submitLabel="Update Product"
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No products found</p>
          </Card>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>KES {product.costPrice}</TableCell>
                    <TableCell>KES {product.sellingPrice}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Badge>{product.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() =>
                            handleDeleteProduct(product.id, product.name)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No products found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
