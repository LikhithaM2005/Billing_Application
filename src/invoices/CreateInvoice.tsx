import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateInvoice.module.css";
import { saveInvoice, generateInvoiceNumber, type Invoice } from "../PaymentReceipts/invoiceStorage";

/* ================= TYPES ================= */

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  hsnCode: string;
}

/* ================= COMPONENT ================= */

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  /* ---------- HEADER STATE ---------- */
  const [header, setHeader] = useState({
    customer: "",
    issueDate: "",
    dueDate: "",
    registrationNumber: "",
    taxType: "",
    notes: "",
    terms: "",
    guarantorName: "",
    countryCode: "+91",
    guarantorMobile: "",
    constructionAddress: "",
  });

  /* ---------- ITEMS STATE ---------- */
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      hsnCode: "",
    },
  ]);

  /* ================= HANDLERS ================= */

  const handleHeaderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setHeader(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: number | string
  ) => {
    const updated = [...items];
    updated[index][field] = value as never;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
        hsnCode: "",
      },
    ]);
  };

  /* ================= VALIDATION ================= */

  const validateHeader = () => {
    if (!header.customer || !header.issueDate || !header.dueDate) {
      alert("Customer, Issue Date and Due Date are required");
      return false;
    }

    if (header.guarantorMobile && header.guarantorMobile.length !== 10) {
      alert("Guarantor mobile must be exactly 10 digits");
      return false;
    }

    return true;
  };

  /* ================= CALCULATIONS ================= */

  const lineTotal = (i: InvoiceItem) => {
    const base = i.quantity * i.unitPrice;
    return base - (base * i.discount) / 100;
  };

  const taxAmount = (i: InvoiceItem) =>
    (lineTotal(i) * i.tax) / 100;

  const subtotal = items.reduce((s, i) => s + lineTotal(i), 0);
  const totalTax = items.reduce((s, i) => s + taxAmount(i), 0);
  const totalDiscount = items.reduce(
    (s, i) => s + (i.quantity * i.unitPrice * i.discount) / 100,
    0
  );
  const grandTotal = subtotal + totalTax;

  /* ================= ACTIONS ================= */

  const saveDraft = () => {
    console.log("DRAFT", {
      header,
      items,
      status: "DRAFT",
    });
    alert("Invoice saved as draft (frontend only)");
  };

  const generateInvoice = () => {
    const invoiceNo = generateInvoiceNumber();

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: invoiceNo,
      customerName: header.customer,
      date: header.issueDate,
      dueDate: header.dueDate,
      totalAmount: grandTotal,
      paidAmount: 0,
      balanceAmount: grandTotal,
      status: 'pending'
    };

    saveInvoice(newInvoice);

    alert(`Invoice ${invoiceNo} generated successfully!`);

    // Redirect to receive payment page with pre-filled details
    navigate("/payments", {
      state: {
        invoiceNo: invoiceNo,
        customer: header.customer,
        balance: grandTotal
      }
    });
  };

  /* ================= UI ================= */

  return (
    <div className={styles.page}>
      <h2 className={styles.header}>Create Invoice</h2>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <div className={styles.card}>
          <h3>Invoice Header</h3>

          <div className={styles.grid}>
            <div>
              <label>Customer *</label>
              <select name="customer" onChange={handleHeaderChange}>
                <option value="">Select Customer</option>
                <option>ABC Pvt Ltd</option>
                <option>XYZ Enterprises</option>
              </select>
            </div>

            <div>
              <label>Issue Date *</label>
              <input type="date" name="issueDate" onChange={handleHeaderChange} />
            </div>

            <div>
              <label>Due Date *</label>
              <input type="date" name="dueDate" onChange={handleHeaderChange} />
            </div>

            <div>
              <label>Registration Number</label>
              <input name="registrationNumber" onChange={handleHeaderChange} />
            </div>

            <div>
              <label>Tax Type</label>
              <input name="taxType" placeholder="GST / VAT" onChange={handleHeaderChange} />
            </div>

            <div>
              <label>Guarantor Mobile</label>

              <div className={styles.mobileRow}>
                <select
                  name="countryCode"
                  value={header.countryCode}
                  onChange={handleHeaderChange}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>

                <input
                  name="guarantorMobile"
                  inputMode="numeric"
                  placeholder="10 digit number"
                  maxLength={10}
                  value={header.guarantorMobile}
                  onChange={e =>
                    setHeader(prev => ({
                      ...prev,
                      guarantorMobile: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                />


              </div>
            </div>
          </div>

          <label>Construction Address</label>
          <textarea name="constructionAddress" onChange={handleHeaderChange} />

          <label>Notes</label>
          <textarea name="notes" onChange={handleHeaderChange} />

          <label>Terms & Conditions</label>
          <textarea name="terms" onChange={handleHeaderChange} />

          <button
            className={styles.primaryBtn}
            onClick={() => validateHeader() && setStep(2)}
          >
            Invoice Items
          </button>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <div className={styles.card}>
          <h3>Invoice Items</h3>

          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount %</th>
                <th>Tax %</th>
                <th>HSN</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td><input value={item.description} onChange={e => handleItemChange(i, "description", e.target.value)} /></td>
                  <td><input type="number" min={1} value={item.quantity} onChange={e => handleItemChange(i, "quantity", +e.target.value)} /></td>
                  <td><input type="number" min={0} value={item.unitPrice} onChange={e => handleItemChange(i, "unitPrice", +e.target.value)} /></td>
                  <td><input type="number" min={0} max={100} value={item.discount} onChange={e => handleItemChange(i, "discount", +e.target.value)} /></td>
                  <td><input type="number" min={0} max={100} value={item.tax} onChange={e => handleItemChange(i, "tax", +e.target.value)} /></td>
                  <td><input value={item.hsnCode} onChange={e => handleItemChange(i, "hsnCode", e.target.value)} /></td>
                  <td>₹ {(lineTotal(item) + taxAmount(item)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.itemActions}>
            <button onClick={addItem}>+ Add Item</button>
          </div>

          <div className={styles.actions}>
            <button onClick={() => setStep(1)}>Back</button>
            <button className={styles.primaryBtn} onClick={() => setStep(3)}>
              Invoice Summary
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <div className={styles.card}>
          <h3>Invoice Summary</h3>

          <div className={styles.summary}>
            <div><span>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span></div>
            <div><span>Total Discount</span><span>₹ {totalDiscount.toFixed(2)}</span></div>
            <div><span>Total Tax</span><span>₹ {totalTax.toFixed(2)}</span></div>
            <div className={styles.grand}><span>Grand Total</span><span>₹ {grandTotal.toFixed(2)}</span></div>
          </div>

          <div className={styles.actions}>
            <button className={styles.secondaryBtn} onClick={saveDraft}>
              Save as Draft
            </button>
            <button className={styles.primaryBtn} onClick={generateInvoice}>
              Generate Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
