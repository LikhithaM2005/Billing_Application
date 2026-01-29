import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import "../App.css";
import "./ProductManagementPage.css";

/* ================= TYPES ================= */

type Mode =
  | "list"
  | "add"
  | "edit"
  | "view"
  | "priceHistory"
  | "changeLog";

interface Product {
  id: string; // P001 format
  name: string;
  description: string;
  categoryId: string;

  price: number;
  stockQty: number;
  gst: string;
  taxableAmount: string;

  sku: string;
  batchNo: string;
  hsn: string;
  manufacturer: string;
  mfgDate: string;
  expDate: string;
  packSize: string;
  uom: string;

  createdAt: string;
  updatedAt: string;
}

interface PriceHistory {
  productId: string;
  price: number;
  start: string;
  end: string | null;
}

interface ChangeLog {
  productId: string;
  field: string;
  oldVal: string;
  newVal: string;
  at: string;
  by: string;
}

/* ================= MAIN ================= */

export default function ProductManagementPage() {
  const idCounter = useRef(2); // starts from P002

  /* ================= PERSISTED STATE ================= */

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("products");
    return saved
      ? JSON.parse(saved)
      : [
        {
          id: "P001",
          name: "Cement OPC",
          description: "Construction cement",
          categoryId: "CAT-001",
          price: 350,
          stockQty: 120,
          gst: "18",
          taxableAmount: "42000",
          sku: "CEM-01",
          batchNo: "B001",
          hsn: "2523",
          manufacturer: "UltraTech",
          mfgDate: "2025-12-01",
          expDate: "2026-12-01",
          packSize: "50kg",
          uom: "Bag",
          createdAt: "2026-01-10",
          updatedAt: "2026-01-12",
        },
      ];
  });

  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>(() => {
    const saved = localStorage.getItem("priceHistory");
    return saved
      ? JSON.parse(saved)
      : [
        { productId: "P001", price: 300, start: "2025-01-01", end: "2025-06-01" },
        { productId: "P001", price: 350, start: "2025-06-01", end: null },
      ];
  });

  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>(() => {
    const saved = localStorage.getItem("changeLogs");
    return saved ? JSON.parse(saved) : [];
  });

  /* ================= SAVE TO LOCAL STORAGE ================= */

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("priceHistory", JSON.stringify(priceHistory));
  }, [priceHistory]);

  useEffect(() => {
    localStorage.setItem("changeLogs", JSON.stringify(changeLogs));
  }, [changeLogs]);

  /* ================= UI STATE ================= */

  const [mode, setMode] = useState<Mode>("list");
  const [selected, setSelected] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [logSearchId, setLogSearchId] = useState("");

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPriceHistory = priceHistory.filter(p =>
    logSearchId ? p.productId.includes(logSearchId) : true
  );

  const filteredChangeLogs = changeLogs.filter(c =>
    logSearchId ? c.productId.includes(logSearchId) : true
  );

  /* ================= SAVE ================= */

  const handleSave = (data: Product) => {
    const now = new Date().toISOString().slice(0, 10);

    if (mode === "add") {
      const newId = `P${String(idCounter.current).padStart(3, "0")}`;
      idCounter.current++;

      const newProduct = { ...data, id: newId };

      setProducts(prev => [...prev, newProduct]);

      setPriceHistory(prev => [
        ...prev,
        { productId: newId, price: newProduct.price, start: now, end: null },
      ]);
    }

    if (mode === "edit" && selected) {
      Object.keys(data).forEach(key => {
        const k = key as keyof Product;
        if (data[k] !== selected[k]) {
          setChangeLogs(prev => [
            ...prev,
            {
              productId: data.id,
              field: k,
              oldVal: String(selected[k]),
              newVal: String(data[k]),
              at: now,
              by: "Admin",
            },
          ]);
        }
      });

      if (data.price !== selected.price) {
        setPriceHistory(prev =>
          prev.map(p =>
            p.productId === data.id && p.end === null
              ? { ...p, end: now }
              : p
          )
        );

        setPriceHistory(prev => [
          ...prev,
          { productId: data.id, price: data.price, start: now, end: null },
        ]);
      }

      setProducts(prev =>
        prev.map(p =>
          p.id === data.id ? { ...data, updatedAt: now } : p
        )
      );
    }

    setMode("list");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  /* ================= UI ================= */

  return (
    <div className="pm-container">
      {/* ================= PRODUCT LIST ================= */}
      {mode === "list" && (
        <>
          <div className="pm-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1B5E20', margin: 0 }}>Product Management</h2>

            <div className="pm-btn-group">
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <FiSearch style={{ position: 'absolute', left: '12px', color: '#6b7280', fontSize: '14px', pointerEvents: 'none' }} />
                <input
                  className="pm-search"
                  placeholder="Search by Product Name"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              <button className="primary" onClick={() => setMode("add")}>
                + Add Product
              </button>

              <button className="secondary" onClick={() => setMode("priceHistory")}>
                View Price History
              </button>

              <button className="secondary" onClick={() => setMode("changeLog")}>
                View Change Log
              </button>
            </div>
          </div>

          <div className="pm-card">
            <table className="pm-table">
              <thead>
                <tr className="pm-table thead tr">
                  <th>#</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Category ID</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>GST %</th>
                  <th>Taxable Amount</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th align="right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.id}</td>
                    <td><b>{p.name}</b></td>
                    <td>{p.categoryId}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stockQty}</td>
                    <td>{p.gst}%</td>
                    <td>₹{p.taxableAmount}</td>
                    <td>{p.createdAt}</td>
                    <td>{p.updatedAt}</td>
                    <td className="right">
                      <div className="pm-actions">
                        <button className="btn-view" onClick={() => { setSelected(p); setMode("view"); }}>View</button>
                        <button className="btn-edit" onClick={() => { setSelected(p); setMode("edit"); }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(mode === "add" || mode === "edit" || mode === "view") && (
        <ProductForm
          mode={mode}
          data={selected}
          onCancel={() => setMode("list")}
          onSave={handleSave}
        />
      )}

      {mode === "priceHistory" && (
        <HistoryTable
          title="Price History"
          search={logSearchId}
          setSearch={setLogSearchId}
          headers={["Product ID", "Price", "Start", "End"]}
          rows={filteredPriceHistory.map(p => [
            p.productId,
            `₹${p.price}`,
            p.start,
            p.end ?? "Current",
          ])}
          onBack={() => setMode("list")}
        />
      )}

      {mode === "changeLog" && (
        <HistoryTable
          title="Change Log"
          search={logSearchId}
          setSearch={setLogSearchId}
          headers={["Product ID", "Field", "Old", "New", "Date", "By"]}
          rows={filteredChangeLogs.map(c => [
            c.productId,
            c.field,
            c.oldVal,
            c.newVal,
            c.at,
            c.by,
          ])}
          onBack={() => setMode("list")}
        />
      )}
    </div>
  );
}

/* ================= REUSABLE HISTORY TABLE ================= */

function HistoryTable({ title, headers, rows, onBack, search, setSearch }: any) {
  return (
    <div className="pm-card">
      <h3>{title}</h3>

      <input
        placeholder="Search by Product ID (ex: P001)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: "15px", width: "260px" }}
      />

      <table className="pm-table">
        <thead>
          <tr>
            {headers.map((h: string) => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r: any[], i: number) => (
            <tr key={i}>
              {r.map((c, j) => <td key={j}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pm-footer">
        <button className="secondary" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

/* ================= FORM ================= */

function ProductForm({ mode, data, onCancel, onSave }: any) {
  const [form, setForm] = useState<Product>(
    data ?? {
      id: "",
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      stockQty: 0,
      gst: "",
      taxableAmount: "0",
      sku: "",
      batchNo: "",
      hsn: "",
      manufacturer: "",
      mfgDate: "",
      expDate: "",
      packSize: "",
      uom: "",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
  );

  const readOnly = mode === "view";

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      taxableAmount: String(prev.price * prev.stockQty),
    }));
  }, [form.price, form.stockQty]);

  return (
    <div className="pm-form-wrapper">
      <div className="pm-form-card">
        <h2>{mode.toUpperCase()} PRODUCT</h2>

        <label>Product ID</label>
        <input disabled value={form.id || "Auto Generated"} />

        {[
          ["Product Name", "name"],
          ["Category ID", "categoryId"],
          ["Description", "description"],
          ["Price", "price"],
          ["Stock Qty", "stockQty"],
          ["GST %", "gst"],
          ["SKU", "sku"],
          ["Batch No", "batchNo"],
          ["HSN", "hsn"],
          ["Manufacturer", "manufacturer"],
          ["Pack Size", "packSize"],
          ["Unit Of", "uom"],
        ].map(([label, key]) => (
          <div key={`${key}-field`}>
            <label>{label}</label>
            <input
              disabled={readOnly}
              value={(form as any)[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        <label>Manufacture Date</label>
        <input type="date" disabled={readOnly}
          value={form.mfgDate}
          onChange={e => setForm({ ...form, mfgDate: e.target.value })}
        />

        <label>Expiry Date</label>
        <input type="date" disabled={readOnly}
          value={form.expDate}
          onChange={e => setForm({ ...form, expDate: e.target.value })}
        />

        <label>Taxable Amount (Auto)</label>
        <input disabled value={form.taxableAmount} />

        <div className="pm-footer">
          <button className="secondary" onClick={onCancel}>Back</button>
          {mode !== "view" && (
            <button className="primary" onClick={() => onSave(form)}>Save</button>
          )}
        </div>
      </div>
    </div>
  );
}
