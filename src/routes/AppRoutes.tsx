import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

/* Auth */
import Login from "../Login_Page/Login";
import Signup from "../Login_Page/Signup";
import ForgotPassword from "../Login_Page/ForgotPassword";
import ResetPassword from "../Login_Page/ResetPassword";

/* Pages */
import CategoryManagementPage from "../CategoryPage/CategoryManagementPage";
import ProductManagementPage from "../ProductPage/ProductManagementPage";
import DashboardPage from "../DashboardPage/DashboardPage";
import Profile from "../layout/Profile";
import Settings from "../layout/Settings";

/* Placeholder pages (create later) */
import CustomerManagementPage from "../CustomerPage/CustomerManagementPage";
// import InvoiceListPage from "../InvoicePage/InvoiceListPage";
import InvoiceList from "../invoices/InvoiceList";
import CreateInvoice from "../invoices/CreateInvoice";
import InvoiceDetail from "../invoices/InvoiceDetail";
import InvoiceReturn from "../invoices/InvoiceReturn";
// import PaymentsPage from "../PaymentPage/PaymentsPage";
// import ReportsPage from "../ReportPage/ReportsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH (NO LAYOUT) */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* APP (WITH HEADER + SIDEBAR) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomerManagementPage />} />
        <Route path="/categories" element={<CategoryManagementPage />} />
        <Route path="/products" element={<ProductManagementPage />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/invoices/create" element={<CreateInvoice />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/invoices/:id/return" element={<InvoiceReturn />} />
        {/* <Route path="/payments" element={<PaymentsPage />} /> */}
        {/* <Route path="/reports" element={<ReportsPage />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
