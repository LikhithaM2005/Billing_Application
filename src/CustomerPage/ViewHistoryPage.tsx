import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPhone, FiMail, FiRefreshCcw } from "react-icons/fi";
import Layout from "../layout/Layout";
import { useDashboard } from "../DashboardPage/DashboardContext";

export default function ViewHistory() {
    const { deletedCustomers, restoreCustomer, userRole } = useDashboard();
    const navigate = useNavigate();

    const handleRestore = (id: string) => {
        if (window.confirm("Restore this customer?")) {
            restoreCustomer(id);
            alert("Customer restored successfully!");
        }
    };

    return (
        <Layout>
            <section className="panel list-panel">
                <div className="table-header">

                    <button className="secondary-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft /> Back
                    </button>
                </div>

                <div className="table-wrapper customer-table-wrapper">
                    <table className="customer-table modern">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer ID</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deletedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-state">
                                        No deleted customers found
                                    </td>
                                </tr>
                            ) : (
                                deletedCustomers.map((customer, index) => (
                                    <tr key={customer.id}>
                                        <td>{index + 1}</td>
                                        <td className="mono">{customer.customerId}</td>
                                        <td className="customer-cell">
                                            <div className="customer-name">{customer.name}</div>
                                            <div className="customer-subtext">
                                                {[customer.city, customer.state].filter(Boolean).join(", ") || customer.address || "No address"}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="pill soft">{customer.customerType}</span>
                                        </td>
                                        <td className="contact-cell">
                                            <span className="contact-row">
                                                <FiPhone /> {customer.phone}
                                            </span>
                                            <span className="contact-row">
                                                <FiMail /> {customer.email}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                {userRole === "Admin" && (
                                                    <button
                                                        className="primary-btn"
                                                        style={{ background: "white", color: "var(--primary)", border: "1px solid var(--primary)", boxShadow: "none" }}
                                                        onClick={() => handleRestore(customer.id)}
                                                    >
                                                        <FiRefreshCcw /> Restore
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </Layout>
    );
}
