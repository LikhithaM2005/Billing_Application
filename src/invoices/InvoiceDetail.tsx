import { useParams, useNavigate } from "react-router-dom";
import styles from "./InvoiceDetail.module.css";
import { getInvoices, type Invoice } from "../PaymentReceipts/invoiceStorage";
import { useEffect, useState } from "react";

// Not using the previous InvoiceStatus type because invoiceStorage uses lowercase
// type InvoiceStatus = "Pending" | "Paid" | "Cancelled";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
}

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);

  useEffect(() => {
    const invoices = getInvoices();
    // Try to match by ID or Invoice Number
    const found = invoices.find(inv => inv.id === id || inv.invoiceNumber === id || inv.invoiceNumber === `INV-00${id}`);
    if (found) {
      setInvoiceData(found);
    }
  }, [id]);

  if (!invoiceData) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h3>Invoice not found</h3>
          <button onClick={() => navigate("/invoices")}>Back to List</button>
        </div>
      </div>
    );
  }

  // 🔹 Mock items for now since storage only stores totals
  // In a real app, items would be in storage too.
  const items: InvoiceItem[] = [
    {
      description: "Services / Product",
      quantity: 1,
      unitPrice: invoiceData.totalAmount, // simplistic matching
      discount: 0,
      tax: 0,
    }
  ];

  /* ---------------- CALCULATIONS ---------------- */
  // Use stored totals
  const subtotal = invoiceData.totalAmount;
  const totalTax = 0; // consistent with simple storage
  const grandTotal = invoiceData.totalAmount;

  /* ---------------- ACTIONS ---------------- */

  const receivePayment = () => {
    navigate(`/payments/receive/${invoiceData.id}`, {
      state: {
        invoiceNo: invoiceData.invoiceNumber,
        customer: invoiceData.customerName,
        balance: invoiceData.balanceAmount
      }
    });
  };
  const cancelInvoice = () => alert("Cancel Invoice (backend later)");

  return (
    <div className={styles.page}>
      <h2 className={styles.header}>Invoice Details</h2>

      {/* ================= HEADER ================= */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h3>{invoiceData.invoiceNumber}</h3>
            <p className={styles.customer}>{invoiceData.customerName}</p>
          </div>

          <span
            className={`${styles.status} ${invoiceData.status === "paid"
              ? styles.paid
              : invoiceData.status === "pending"
                ? styles.pending
                : styles.cancelled
              }`}
          >
            {invoiceData.status.toUpperCase()}
          </span>
        </div>

        <div className={styles.meta}>
          <p><strong>Issue Date:</strong> {invoiceData.date}</p>
          <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
        </div>
      </div>

      {/* ================= ITEMS ================= */}
      <div className={styles.card}>
        <h3>Invoice Items</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>₹ {item.unitPrice}</td>
                <td>{item.discount}%</td>
                <td>{item.tax}%</td>
                <td>
                  ₹ {item.unitPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className={styles.card}>
        <h3>Summary</h3>

        <div className={styles.summary}>
          <div><span>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span></div>
          <div><span>Total Tax</span><span>₹ {totalTax.toFixed(2)}</span></div>
          <div className={styles.grand}>
            <span>Grand Total</span>
            <span>₹ {grandTotal.toFixed(2)}</span>
          </div>
          <div className={styles.grand} style={{ marginTop: '10px', fontSize: '16px', color: '#EF4444' }}>
            <span>Balance Due</span>
            <span>₹ {invoiceData.balanceAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className={styles.actions}>
        <button onClick={() => navigate("/invoices")}>Back</button>

        <div>
          {(invoiceData.status === "pending" || invoiceData.status === "partially_paid") && (
            <>
              <button onClick={receivePayment} className={styles.primary}>
                Receive Payment
              </button>
              <button
                onClick={() => navigate(`/invoices/${invoiceData.id}/return`)}
                className={styles.secondary}
              >
                Create Return
              </button>
              <button onClick={cancelInvoice} className={styles.danger}>
                Cancel Invoice
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
