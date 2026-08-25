import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import client from "../../api/client";
import { confirmToast } from "../../utils/confirmToast";

const emptyForm = {
  id: null,
  category: "",
  name: "",
  description: "",
  price: "",
  in_stock: true,
  is_on_offer: false,
  offer_price: "",
  watts: "",
  power_output_levels: "",
  channel_lock_system: "",
  voltage: "",
  warranty_months: 12,
  size: "",
  material: "",
  induction_compatible: false,
  has_lid: true,
};

export default function AdminProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadAll = () => {
    setLoadError("");
    client.get("/products/categories/").then((r) => setCategories(r.data)).catch(() => {
      setLoadError("Couldn't load categories. Is the backend server running? (Try: python manage.py seed_categories)");
    });
    client.get("/products/").then((r) => setProducts(r.data.results || r.data)).catch(() => {
      setLoadError("Couldn't load products. Is the backend server running?");
    });
  };

  useEffect(loadAll, []);

  const selectedCategory = categories.find((c) => String(c.id) === String(form.category));
  const categorySlug = selectedCategory?.slug || "";
  const isInduction = categorySlug.includes("induction");
  const isSufuria = categorySlug.includes("sufuria") || categorySlug.includes("kitchen") || categorySlug.includes("pan");

  const update = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: val });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
  };

  const editProduct = (p) => {
    setForm({
      id: p.id,
      category: p.category,
      name: p.name,
      description: p.description,
      price: p.price,
      in_stock: p.in_stock,
      is_on_offer: p.is_on_offer,
      offer_price: p.offer_price || "",
      watts: p.induction_cooker_spec?.watts || "",
      power_output_levels: p.induction_cooker_spec?.power_output_levels || "",
      channel_lock_system: p.induction_cooker_spec?.channel_lock_system || "",
      voltage: p.induction_cooker_spec?.voltage || "",
      warranty_months: p.induction_cooker_spec?.warranty_months || 12,
      size: p.sufuria_spec?.size || "",
      material: p.sufuria_spec?.material || "",
      induction_compatible: p.sufuria_spec?.induction_compatible || false,
      has_lid: p.sufuria_spec?.has_lid ?? true,
    });
    toast.info(`Editing "${p.name}"`, { autoClose: 1800 });
  };

  const buildPayload = () => {
    const payload = {
      category: form.category,
      name: form.name,
      description: form.description,
      price: form.price,
      in_stock: form.in_stock,
      is_on_offer: form.is_on_offer,
      offer_price: form.is_on_offer ? form.offer_price || null : null,
    };
    if (isInduction) {
      payload.induction_cooker_spec = {
        watts: form.watts || 0,
        power_output_levels: form.power_output_levels || 0,
        channel_lock_system: form.channel_lock_system,
        voltage: form.voltage,
        warranty_months: form.warranty_months || 12,
      };
    }
    if (isSufuria) {
      payload.sufuria_spec = {
        size: form.size,
        material: form.material,
        induction_compatible: form.induction_compatible,
        has_lid: form.has_lid,
      };
    }
    return payload;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const wasEditing = Boolean(form.id);
    try {
      const payload = buildPayload();
      let productId = form.id;

      if (form.id) {
        await client.patch(`/products/${form.id}/`, payload);
      } else {
        const { data } = await client.post("/products/", payload);
        productId = data.id;
      }

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        await client.patch(`/products/${productId}/`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }

      toast.success(wasEditing ? `"${form.name}" updated successfully.` : `"${form.name}" added to the store.`);
      resetForm();
      loadAll();
    } catch (err) {
      const detail = err.response?.data;
      const message = detail && typeof detail === "object"
        ? Object.entries(detail).map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(", ") : errs}`).join(" | ")
        : "Something went wrong while saving.";
      toast.error(message, { autoClose: 6000 });
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async (p) => {
    try {
      await client.delete(`/products/${p.id}/`);
      toast.success(`"${p.name}" was deleted.`);
      loadAll();
    } catch {
      toast.error(`Could not delete "${p.name}".`);
    }
  };

  const deleteProduct = (p) => {
    confirmToast(`Remove "${p.name}" from the site? This can't be undone.`, () => doDelete(p));
  };

  const toggleStock = async (p) => {
    try {
      await client.patch(`/products/${p.id}/`, { in_stock: !p.in_stock });
      toast.success(`"${p.name}" marked as ${!p.in_stock ? "in stock" : "out of stock"}.`);
      loadAll();
    } catch {
      toast.error(`Could not update stock status for "${p.name}".`);
    }
  };

  const toggleOffer = async (p) => {
    try {
      await client.patch(`/products/${p.id}/`, { is_on_offer: !p.is_on_offer });
      toast.success(`"${p.name}" is ${!p.is_on_offer ? "now on offer" : "no longer on offer"}.`);
      loadAll();
    } catch {
      toast.error(`Could not update offer status for "${p.name}".`);
    }
  };

  return (
    <div>
      {loadError && (
        <div className="card" style={{ borderColor: "var(--hl-danger)", marginBottom: 20 }}>
          <p className="status-rejected">{loadError}</p>
          <button className="btn secondary" onClick={loadAll}>Try again</button>
        </div>
      )}
      <div className="card" style={{ maxWidth: 640, marginBottom: 24 }}>
        <h3>{form.id ? `Edit product #${form.id}` : "Add a new product"}</h3>
        <form onSubmit={submit}>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={update("category")} required>
              <option value="">Select category...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Name</label><input value={form.name} onChange={update("name")} required /></div>
          <div className="field"><label>Description</label><textarea rows={3} value={form.description} onChange={update("description")} /></div>
          <div className="field"><label>Price (KES)</label><input type="number" step="0.01" value={form.price} onChange={update("price")} required /></div>
          <div className="field"><label>Image</label><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></div>

          <div className="field" style={{ display: "flex", gap: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" style={{ width: "auto" }} checked={form.in_stock} onChange={update("in_stock")} /> In stock
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" style={{ width: "auto" }} checked={form.is_on_offer} onChange={update("is_on_offer")} /> On offer
            </label>
          </div>
          {form.is_on_offer && (
            <div className="field"><label>Offer price (KES)</label><input type="number" step="0.01" value={form.offer_price} onChange={update("offer_price")} /></div>
          )}

          {isInduction && (
            <>
              <h4 style={{ color: "var(--hl-amber)" }}>Induction Cooker details</h4>
              <div className="field"><label>Watts</label><input type="number" value={form.watts} onChange={update("watts")} required /></div>
              <div className="field"><label>Power output levels</label><input type="number" value={form.power_output_levels} onChange={update("power_output_levels")} required /></div>
              <div className="field"><label>Channel / lock system</label><input value={form.channel_lock_system} onChange={update("channel_lock_system")} placeholder="e.g. Child lock, Touch lock" /></div>
              <div className="field"><label>Voltage</label><input value={form.voltage} onChange={update("voltage")} placeholder="e.g. 220-240V" /></div>
              <div className="field"><label>Warranty (months)</label><input type="number" value={form.warranty_months} onChange={update("warranty_months")} /></div>
            </>
          )}

          {isSufuria && (
            <>
              <h4 style={{ color: "var(--hl-amber)" }}>Sufuria / Pan details</h4>
              <div className="field"><label>Size</label><input value={form.size} onChange={update("size")} placeholder="e.g. 28cm / 5 Litres" required /></div>
              <div className="field"><label>Material</label><input value={form.material} onChange={update("material")} placeholder="e.g. Aluminium" required /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <input type="checkbox" style={{ width: "auto" }} checked={form.induction_compatible} onChange={update("induction_compatible")} /> Induction compatible
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" style={{ width: "auto" }} checked={form.has_lid} onChange={update("has_lid")} /> Has lid
              </label>
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : form.id ? "Save changes" : "Add product"}
            </button>
            {form.id && <button type="button" className="btn secondary" onClick={resetForm}>Cancel edit</button>}
          </div>
        </form>
      </div>

      <h3 className="section-title">All products</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Offer</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category_name}</td>
                <td>KES {Number(p.price).toLocaleString()}</td>
                <td>
                  <button className="btn secondary" onClick={() => toggleStock(p)}>
                    {p.in_stock ? "In stock" : "Out of stock"}
                  </button>
                </td>
                <td>
                  <button className="btn secondary" onClick={() => toggleOffer(p)}>
                    {p.is_on_offer ? "On offer" : "Not on offer"}
                  </button>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn" onClick={() => editProduct(p)}><Pencil size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Edit</button>
                  <button className="btn danger" onClick={() => deleteProduct(p)}><Trash2 size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}