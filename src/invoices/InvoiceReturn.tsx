import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./InvoiceReturn.module.css";

/* ================= TYPES ================= */

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

/* ================= MOCK DATA ================= */
// Later this will come from backend using invoiceId

const mockItems: InvoiceItem[] = [
  { id: 1, description: "Cement Bags", quantity: 10, unitPrice: 450 },
  { id: 2, description: "Steel Rods", quantity: 5, unitPrice: 1200 },
];

/* ================= COMPONENT ================= */

const InvoiceReturn = () => {
  const { id } = useParams(); // invoice id
  const navigate = useNavigate();

  const [selectedItemId, setSelectedItemId] = useState<number | "">("");
  const [returnQty, setReturnQty] = useState("");
  const [reason, setReason] = useState("");

  const selectedItem = mockItems.find(i => i.id === selectedItemId);

  const maxQty = selectedItem ? selectedItem.quantity : 0;
  const returnAmount =
    selectedItem && returnQty
      ? Number(returnQty) * selectedItem.unitPrice
      : 0;

  /* ================= ACTION ================= */

  const submitReturn = () => {
    if (!selectedItemId || !returnQty) {
      alert("Please select item and enter return quantity");
      return;
    }

    const payload = {
      invoiceId: id,
      itemId: selectedItemId,
      returnQty: Number(returnQty),
      reason,
      creditAmount: returnAmount,
    };

    console.log("RETURN / CREDIT NOTE", payload);

    alert("Credit note created (frontend only)");
    navigate(`/invoices/${id}`);
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.header}>Invoice Return / Credit Note</h2>

      <div className={styles.card}>
        {/* ITEM SELECT */}
        <div className={styles.field}>
          <label>Invoice Item *</label>
          <select
            value={selectedItemId}
            onChange={e => {
              setSelectedItemId(Number(e.target.value));
              setReturnQty("");
            }}
          >
            <option value="">Select item</option>
            {mockItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.description} (Qty: {item.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* RETURN QTY */}
        <div className={styles.field}>
          <label>Return Quantity *</label>
          <input
            type="number"
            min={1}
            max={maxQty}
            disabled={!selectedItem}
            value={returnQty}
            onChange={e => {
              const val = e.target.value;
              if (Number(val) <= maxQty) setReturnQty(val);
            }}
          />
          {selectedItem && (
            <small>Max allowed: {maxQty}</small>
          )}
        </div>

        {/* REASON */}
        <div className={styles.field}>
          <label>Return Reason</label>
          <textarea
            placeholder="Optional reason for return"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>

        {/* SUMMARY */}
        <div className={styles.summary}>
          <div>
            <span>Unit Price</span>
            <span>₹ {selectedItem?.unitPrice ?? 0}</span>
          </div>
          <div>
            <span>Return Amount</span>
            <span>₹ {returnAmount}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className={styles.primaryBtn} onClick={submitReturn}>
            Create Credit Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceReturn;
