// src/lib/types.ts

export interface Product {
  id: number;
  name: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  status: "active" | "out_of_stock" | "discontinued";
}

export interface SaleProduct {
  productId: number;
  productName: string;
  quantity: number;
  costValue: number;
  sellingValue: number;
  profit: number;
  commission: number;
}

export interface Sale {
  id: number;
  employeeId: number;
  employeeName: string;
  products: SaleProduct[];
  date: string;
  status: "completed" | "pending" | "cancelled";
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  commissionRate: number; // percentage
  totalGoodsAssigned: number;
  totalSales: number;
  commissionEarned: number;
  status: "active" | "inactive";
  joinedDate: string;
}
