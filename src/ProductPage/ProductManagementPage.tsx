import { useEffect, useRef, useState } from "react";
import "./ProductManagementPage.css";

/* ================= TYPES ================= */

type Mode = "list" | "add" | "edit" | "view" | "priceHistory" | "changeLog";

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stockQty: number;
  gst: string;
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

/* ================= HELPERS ================= */

const getNextProductId = (products: Product[]) => {
  if (!products.length) return 1;
  return Math.max(...products.map(p => Number(p.id.replace("P", "")))) + 1;
};

/* ================= MAIN ================= */

export default function ProductManagementPage() {
  const idCounter = useRef<number>(1);

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

  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);

  useEffect(() => {
    idCounter.current = getNextProductId(products);
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("priceHistory", JSON.stringify(priceHistory));
  }, [priceHistory]);

  useEffect(() => {
    localStorage.setItem("changeLogs", JSON.stringify(changeLogs));
  }, [changeLogs]);

  const [mode, setMode] = useState<Mode>("list");
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPriceHistory = priceHistory.filter(p =>
    logSearch ? p.productId.includes(logSearch) : true
  );

  const filteredChangeLogs = changeLogs.filter(c =>
    logSearch ? c.productId.includes(logSearch) : true
  );

  /* ================= SAVE ================= */

  const handleSave = (data: Product) => {
    const today = new Date().toISOString().slice(0, 10);

    if (mode === "add") {
      const newId = `P${String(idCounter.current).padStart(3, "0")}`;
      idCounter.current++;

      const newProduct: Product = {
        ...data,
        id: newId,
        createdAt: today,
        updatedAt: today,
      };

      setProducts(prev => [...prev, newProduct]);
      setPriceHistory(prev => [
        ...prev,
        { productId: newId, price: newProduct.price, start: today, end: null },
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
              at: today,
              by: "Admin",
            },
          ]);
        }
      });

      setProducts(prev =>
        prev.map(p => (p.id === data.id ? { ...data, updatedAt: today } : p))
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
    <>
      {mode === "list" && (
        <>
          <div className="pm-header">
            <input
              className="pm-search"
              placeholder="Search product"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="pm-btn-group">
              <button className="primary" onClick={() => setMode("add")}>
                + Add Product
              </button>
              <button className="secondary" onClick={() => setMode("priceHistory")}>
                Price History
              </button>
              <button className="secondary" onClick={() => setMode("changeLog")}>
                Change Log
              </button>
            </div>
          </div>

          <div className="pm-card">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stockQty}</td>
                    <td className="right">
                      <div className="pm-actions">
                        <button onClick={() => { setSelected(p); setMode("view"); }}>View</button>
                        <button onClick={() => { setSelected(p); setMode("edit"); }}>Edit</button>
                        <button onClick={() => handleDelete(p.id)}>Delete</button>
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
          headers={["Product ID", "Price", "Start", "End"]}
          rows={filteredPriceHistory.map(p => [
            p.productId,
            `₹${p.price}`,
            p.start,
            p.end ?? "Current",
          ])}
          search={logSearch}
          setSearch={setLogSearch}
          onBack={() => setMode("list")}
        />
      )}

      {mode === "changeLog" && (
        <HistoryTable
          title="Change Log"
          headers={["Product ID", "Field", "Old", "New", "Date", "By"]}
          rows={filteredChangeLogs.map(c => [
            c.productId,
            c.field,
            c.oldVal,
            c.newVal,
            c.at,
            c.by,
          ])}
          search={logSearch}
          setSearch={setLogSearch}
          onBack={() => setMode("list")}
        />
      )}
    </>
  );
}

/* ================= HISTORY TABLE ================= */

function HistoryTable({
  title,
  headers,
  rows,
  search,
  setSearch,
  onBack,
}: {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  search: string;
  setSearch: (v: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="pm-card">
      <h3>{title}</h3>

      <input
        className="pm-search"
        placeholder="Search by Product ID"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="pm-table">
        <thead>
          <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => <td key={j}>{String(c)}</td>)}
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

type EditableField =
  | "name"
  | "categoryId"
  | "description"
  | "price"
  | "stockQty";

function ProductForm({
  mode,
  data,
  onCancel,
  onSave,
}: {
  mode: Mode;
  data: Product | null;
  onCancel: () => void;
  onSave: (p: Product) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<Product>(
    data ?? {
      id: "",
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      stockQty: 0,
      gst: "",
      sku: "",
      batchNo: "",
      hsn: "",
      manufacturer: "",
      mfgDate: "",
      expDate: "",
      packSize: "",
      uom: "",
      createdAt: today,
      updatedAt: today,
    }
  );

  const readOnly = mode === "view";
  const taxableAmount = form.price * form.stockQty;

  const fields: [string, EditableField, "text" | "number"][] = [
    ["Name", "name", "text"],
    ["Category ID", "categoryId", "text"],
    ["Description", "description", "text"],
    ["Price", "price", "number"],
    ["Stock Qty", "stockQty", "number"],
  ];

  return (
    <div className="pm-form-wrapper">
      <div className="pm-form-card">
        <h2>{mode.toUpperCase()} PRODUCT</h2>

        {fields.map(([label, key, type]) => (
          <div key={key}>
            <label>{label}</label>
            <input
              type={type}
              disabled={readOnly}
              value={form[key]}
              onChange={e =>
                setForm({
                  ...form,
                  [key]: type === "number"
                    ? Number(e.target.value)
                    : e.target.value,
                })
              }
            />
          </div>
        ))}

        <label>Taxable Amount</label>
        <input disabled value={taxableAmount} />

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
