import { useState } from "react";
import "./CategoryManagementPage.css";

/* ================= CATEGORY TYPES ================= */

export interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface CategoryCreate {
  name: string;
  code: string;
  description: string;
}

export type CategoryUpdate = Category;

/* ================= PAGE TYPES ================= */

type Mode = "list" | "add" | "view" | "edit";

interface CategoryWithDates extends Category {
  created_at?: string;
  updated_at?: string;
}

/* ================= HELPERS ================= */

function generateNextCode(categories: { code: string }[]) {
  const numbers = categories
    .map(c => parseInt(c.code.replace("C", ""), 10))
    .filter(n => !isNaN(n));

  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `C${String(next).padStart(3, "0")}`;
}

/* ================= MAIN ================= */

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<CategoryWithDates[]>([
    {
      id: 1,
      name: "Cement",
      code: "C001",
      description: "Construction Material",
      created_at: "2026-01-10",
      updated_at: "2026-01-12",
    },
    {
      id: 2,
      name: "Steel",
      code: "C002",
      description: "Raw Material",
      created_at: "2026-01-09",
      updated_at: "2026-01-11",
    },
    {
      id: 3,
      name: "Bricks",
      code: "C003",
      description: "Building Blocks",
      created_at: "2026-01-08",
      updated_at: "2026-01-10",
    },
  ]);

  const [mode, setMode] = useState<Mode>("list");
  const [selected, setSelected] = useState<CategoryWithDates | null>(null);
  const [search, setSearch] = useState("");

  /* ================= HANDLERS ================= */

  const handleSave = (data: CategoryWithDates) => {
    const today = new Date().toISOString().slice(0, 10);

    if (mode === "add") {
      setCategories(prev => [
        ...prev,
        { ...data, created_at: today, updated_at: today },
      ]);
    } else {
      setCategories(prev =>
        prev.map(c =>
          c.id === data.id ? { ...data, updated_at: today } : c
        )
      );
    }

    setMode("list");
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const filtered = categories.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <>
      {mode === "list" && (
        <>
          <div className="category-header">
            <input
              className="category-search"
              placeholder="Search by Category Code"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <button
              className="primary"
              onClick={() => {
                setSelected({
                  id: Date.now(),
                  name: "",
                  code: generateNextCode(categories),
                  description: "",
                });
                setMode("add");
              }}
            >
              + Add Category
            </button>
          </div>

          <div className="category-card">
            <table className="category-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th align="right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.code}</td>
                    <td>{c.description}</td>
                    <td>{c.created_at}</td>
                    <td>{c.updated_at}</td>
                    <td align="right">
                      <div className="action-group">
                        <button onClick={() => { setSelected(c); setMode("view"); }}>View</button>
                        <button onClick={() => { setSelected(c); setMode("edit"); }}>Edit</button>
                        <button onClick={() => handleDelete(c.id)}>Delete</button>
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
        <CategoryForm
          mode={mode}
          data={selected}
          onCancel={() => setMode("list")}
          onSave={handleSave}
        />
      )}
    </>
  );
}

/* ================= FORM ================= */

function CategoryForm({
  mode,
  data,
  onCancel,
  onSave,
}: {
  mode: Mode;
  data: CategoryWithDates | null;
  onCancel: () => void;
  onSave: (c: CategoryWithDates) => void;
}) {

  const [form, setForm] = useState<CategoryWithDates>(() => {
    if (data) return data;

    const today = new Date().toISOString().slice(0, 10);

    return {
      id: Date.now(),
      name: "",
      code: "",
      description: "",
      created_at: today,
      updated_at: today,
    };
  });

  const readOnly = mode === "view";

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <h2>
          {mode === "add" ? "Add" : mode === "edit" ? "Edit" : "View"} Category
        </h2>

        <label>Category Name</label>
        <input
          disabled={readOnly}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <label>Category Code</label>
        <input disabled value={form.code} />

        <label>Description</label>
        <textarea
          disabled={readOnly}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <div className="form-actions">
          <button className="secondary" onClick={onCancel}>Back</button>
          {mode !== "view" && (
            <button className="primary" onClick={() => onSave(form)}>Save</button>
          )}
        </div>
      </div>
    </div>
  );
}
