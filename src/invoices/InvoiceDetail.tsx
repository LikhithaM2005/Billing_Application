import { useParams, useNavigate } from "react-router-dom";
import styles from "./InvoiceDetail.module.css";

type InvoiceStatus = "Pending" | "Paid" | "Cancelled";

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

  // 🔹 Dummy invoice (replace with API later)
  const invoice = {
    invoiceNo: `INV-00${id}`,
    customer: "ABC Pvt Ltd",
    issueDate: "2026-01-12",
    dueDate: "2026-01-20",
    status: "Pending" as InvoiceStatus,
    items: [
      {
        description: "Soap",
        quantity: 3,
        unitPrice: 56,
        discount: 10,
        tax: 5,
      },
      {
        description: "Shampoo",
        quantity: 2,
        unitPrice: 120,
        discount: 0,
        tax: 5,
      },
    ],
  };

  /* ---------------- CALCULATIONS ---------------- */

  const lineTotal = (item: InvoiceItem) => {
    const base = item.quantity * item.unitPrice;
    const discountAmt = (base * item.discount) / 100;
    return base - discountAmt;
  };

  const taxAmount = (item: InvoiceItem) =>
    (lineTotal(item) * item.tax) / 100;

  const subtotal = invoice.items.reduce(
    (sum, i) => sum + lineTotal(i),
    0
  );

  const totalTax = invoice.items.reduce(
    (sum, i) => sum + taxAmount(i),
    0
  );

  const grandTotal = subtotal + totalTax;

  /* ---------------- ACTIONS ---------------- */

  const receivePayment = () => alert("Receive Payment (backend later)");
  const cancelInvoice = () => alert("Cancel Invoice (backend later)");

  return (
    <div className={styles.page}>
      <h2 className={styles.header}>Invoice Details</h2>

      {/* ================= HEADER ================= */}
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h3>{invoice.invoiceNo}</h3>
            <p className={styles.customer}>{invoice.customer}</p>
          </div>

          <span
            className={`${styles.status} ${
              invoice.status === "Paid"
                ? styles.paid
                : invoice.status === "Pending"
                ? styles.pending
                : styles.cancelled
            }`}
          >
            {invoice.status}
          </span>
        </div>

        <div className={styles.meta}>
          <p><strong>Issue Date:</strong> {invoice.issueDate}</p>
          <p><strong>Due Date:</strong> {invoice.dueDate}</p>
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
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>₹ {item.unitPrice}</td>
                <td>{item.discount}%</td>
                <td>{item.tax}%</td>
                <td>
                  ₹ {(lineTotal(item) + taxAmount(item)).toFixed(2)}
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
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className={styles.actions}>
        <button onClick={() => navigate("/invoices")}>Back</button>

        <div>
          {invoice.status === "Pending" && (
            <>
              <button onClick={receivePayment} className={styles.primary}>
                Receive Payment
              </button>
              <button
                onClick={() => navigate(`/invoices/${id}/return`)}
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
