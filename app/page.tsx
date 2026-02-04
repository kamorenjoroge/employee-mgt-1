import { Card } from "@/components/ui/card";
import { Users, Package, TrendingUp, DollarSign } from "lucide-react";
import { employees, products, sales, Sale, SaleProduct } from "@/lib/mockData";

// -----------------------------
// Helper Functions
// -----------------------------
const getSaleTotal = (sale: Sale): number =>
  sale.products.reduce(
    (sum: number, p: SaleProduct) => sum + p.sellingValue,
    0
  );

const getCommissionTotal = (sale: Sale): number =>
  sale.products.reduce(
    (sum: number, p: SaleProduct) => sum + p.commission,
    0
  );

export default function DashboardPage() {
  // -----------------------------
  // Totals
  // -----------------------------
  const totalEmployees = employees.length;
  const totalProducts = products.length;

  const totalSales = sales.reduce((sum, sale) => sum + getSaleTotal(sale), 0);
  const totalCommission = sales.reduce(
    (sum, sale) => sum + getCommissionTotal(sale),
    0
  );

  // -----------------------------
  // Recent Sales (last 5)
  // -----------------------------
  const recentSales = [...sales]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Total Sales",
      value: `KES ${totalSales.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Total Commission",
      value: `KES ${totalCommission.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your sales management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Sales Table */}
      <Card className="border-0 shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Sales</h2>
          <p className="text-sm text-gray-500 mt-1">Latest transactions from your employees</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Products</th>
                <th className="px-6 py-3">Total Sale</th>
                <th className="px-6 py-3">Commission</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale: Sale) => (
                <tr key={sale.id} className="border-b">
                  <td className="px-6 py-4">{sale.date}</td>
                  <td className="px-6 py-4">{sale.employeeName}</td>
                  <td className="px-6 py-4">
                    {sale.products.map((p: SaleProduct) => p.productName).join(", ")}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    KES {getSaleTotal(sale).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-green-600">
                    KES {getCommissionTotal(sale).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 capitalize">{sale.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
