import {
  FiUsers,
  FiBox,
  FiFileText,
  FiTrendingUp,
  FiCreditCard,
  FiClipboard,
  FiBarChart2,
  FiDownload,
  FiPlusSquare,
} from "react-icons/fi";
import Layout from "../layout/Layout";
import StatCard from "./StatCard";
import QuickAction from "./QuickAction";
import RevenueChart from "./RevenueChart";
import TopProducts from "./TopProducts";
import { useDashboard } from "./DashboardContext";

export default function Dashboard() {
  const { customers, totalRevenue, totalRecovered, products } = useDashboard();

  const stats = [
    { title: "Total Customers", value: customers.length.toString(), icon: <FiUsers /> },
    { title: "Total Products", value: products.length.toString(), icon: <FiBox /> },
    { title: "Total Invoices", value: customers.reduce((acc, c) => acc + c.purchaseHistory.length, 0).toLocaleString(), icon: <FiFileText /> },
    { title: "Total Recovered", value: `₹${totalRecovered.toLocaleString()}`, icon: <FiCreditCard /> },
  ];

  const quickActions = [
    { title: "Customer Management", description: "Add or edit customers", icon: <FiUsers style={{ color: "#7c4dff" }} />, to: "/customers" },
    { title: "Category Management", description: "Organize catalog", icon: <FiBox style={{ color: "#ffab40" }} />, to: "/categories" },
    { title: "Product Management", description: "Update pricing & stock", icon: <FiFileText style={{ color: "#90a4ae" }} />, to: "/products" },
    { title: "Payment & Receipts", description: "Record payments", icon: <FiCreditCard style={{ color: "#40c4ff" }} />, to: "/payments" },
    { title: "Invoice Management", description: "Create & track invoices", icon: <FiFileText style={{ color: "#e0e0e0" }} />, to: "/invoices" },
    { title: "Reports", description: "Download exports", icon: <FiBarChart2 style={{ color: "#ffeb3b" }} />, to: "/reports" },
  ];

  return (
    <Layout>
      <section className="stat-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Quick Actions</h3>
          <div className="panel-actions">

          </div>
        </div>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <QuickAction key={action.title} {...action} />
          ))}
        </div>
      </section>

      <div className="grid-two">
        <RevenueChart />
        <TopProducts />
      </div>
    </Layout>
  );
}