// ==========================
// Types / Interfaces
// ==========================

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  commissionRate: number; // percentage e.g. 10 = 10%
  totalGoodsAssigned: number;
  totalSales: number;
  commissionEarned: number;
  status: "active" | "inactive";
  joinedDate: string;
}

export interface Product {
  id: number;
  name: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
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
  id: number; // Sale ID
  employeeId: number;
  employeeName: string;
  products: SaleProduct[]; // List of products sold in this sale
  date: string;
  status: "completed" | "pending" | "cancelled";
}



// ==========================
// Mock Employees
// ==========================

export const employees: Employee[] = [
  {
    id: 1,
    name: "James Webb",
    email: "james@example.com",
    phone: "0712345678",
    commissionRate: 10,
    totalGoodsAssigned: 10000,
    totalSales: 12000,
    commissionEarned: 200,
    status: "active",
    joinedDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "0798765432",
    commissionRate: 8,
    totalGoodsAssigned: 8000,
    totalSales: 9500,
    commissionEarned: 120,
    status: "active",
    joinedDate: "2024-02-05",
  },
];


// ==========================
// Mock Products
// ==========================

export const products: Product[] = [
  {
    id: 1,
    name: "Product A",
    costPrice: 1000,
    sellingPrice: 1200,
    quantity: 50,
    status: "in-stock",
  },
  {
    id: 2,
    name: "Product B",
    costPrice: 500,
    sellingPrice: 750,
    quantity: 5,
    status: "low-stock",
  },
];


// ==========================
// Mock Sales
// ==========================

export const sales: Sale[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "James Webb",
    products: [
      {
        productId: 1,
        productName: "Laptop",
        quantity: 2,
        costValue: 2000,
        sellingValue: 2500,
        profit: 500,
        commission: 50,
      },
      {
        productId: 2,
        productName: "Mouse",
        quantity: 5,
        costValue: 50,
        sellingValue: 100,
        profit: 50,
        commission: 5,
      },
    ],
    date: "2026-02-02",
    status: "completed",
  },
];


// ==========================
// Dashboard Stats
// ==========================

export const dashboardStats = {
  totalEmployees: employees.length,
  totalProducts: products.length,

  totalSales: sales.reduce((saleSum, sale) => {
    const saleTotal = sale.products.reduce(
      (prodSum, p) => prodSum + p.sellingValue * p.quantity,
      0
    );
    return saleSum + saleTotal;
  }, 0),

  totalCommission: sales.reduce((saleSum, sale) => {
    const commissionTotal = sale.products.reduce(
      (prodSum, p) => prodSum + p.commission * p.quantity,
      0
    );
    return saleSum + commissionTotal;
  }, 0),
};
