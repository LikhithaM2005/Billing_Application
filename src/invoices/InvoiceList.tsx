import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./InvoiceList.module.css";

type InvoiceStatus = "Pending" | "Paid" | "Cancelled";

interface InvoiceRow {
  id: number;
  number: string;
  customer: string;
  date: string;
  status: InvoiceStatus;
  total: number;
}

const dummyInvoices: InvoiceRow[] = [
  {
    id: 1,
    number: "INV-001",
    customer: "ABC Pvt Ltd",
    date: "2026-01-12",
    status: "Pending",
    total: 5000,
  },
  {
    id: 2,
    number: "INV-002",
    customer: "XYZ Enterprises",
    date: "2026-01-10",
    status: "Paid",
    total: 8200,
  },
  {
    id: 3,
    number: "INV-003",
    customer: "ABC Pvt Ltd",
    date: "2026-01-08",
    status: "Cancelled",
    total: 3000,
  },
];

const InvoiceList = () => {
  const navigate = useNavigate();

  const [customerFilter, setCustomerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  const filteredInvoices = dummyInvoices.filter((inv) => {
    const customerMatch =
      customerFilter === "All" || inv.customer === customerFilter;

    const statusMatch =
      statusFilter === "All" || inv.status === statusFilter;

    const fromMatch = fromDate ? inv.date >= fromDate : true;
    const toMatch = toDate ? inv.date <= toDate : true;

    const invoiceMatch = invoiceSearch
      ? inv.number.toLowerCase().includes(invoiceSearch.toLowerCase())
      : true;

    return customerMatch && statusMatch && fromMatch && toMatch && invoiceMatch;
  });

  return (
    <div className={styles.page}>
      {/* FILTER CARD */}
      <div className={styles.filterCard}>
        <div className={styles.filters}>
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search Invoice No"
            value={invoiceSearch}
            onChange={(e) => setInvoiceSearch(e.target.value)}
          />

          {/* CUSTOMER FILTER */}
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <option value="All">All Customers</option>
            <option value="ABC Pvt Ltd">ABC Pvt Ltd</option>
            <option value="XYZ Enterprises">XYZ Enterprises</option>
          </select>

          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* DATE RANGE */}
          <div className={styles.dateGroup}>
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className={styles.dateGroup}>
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* CREATE BUTTON (ORIGINAL POSITION) */}
          <button
            className={styles.createBtn}
            onClick={() => navigate("/invoices/create")}
          >
            + Create Invoice
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.number}</td>
                <td>{inv.customer}</td>
                <td>{inv.date}</td>
                <td>
                  <span
                    className={
                      inv.status === "Paid"
                        ? styles.statusPaid
                        : inv.status === "Pending"
                        ? styles.statusPending
                        : styles.statusCancelled
                    }
                  >
                    {inv.status}
                  </span>
                </td>
                <td>₹ {inv.total}</td>
                <td className={styles.actions}>
                  <button onClick={() => navigate(`/invoices/${inv.id}`)}>
                    View
                  </button>
                  <button
                    disabled={inv.status !== "Pending"}
                    onClick={() =>
                      navigate(`/payments/receive/${inv.id}`)
                    }
                  >
                    Receive
                  </button>
                  <button
                    disabled={inv.status !== "Paid"}
                    onClick={() =>
                      navigate(`/invoices/${inv.id}/return`)
                    }
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
