import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import client from "../../api/client";
import { confirmToast } from "../../utils/confirmToast";

const emptyForm = { id: null, title: "", subtitle: "", link_url: "", order: 0, active: true };

export default function AdminSlideshow() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoadError("");
    client
      .get("/offers/slideshow/")
      .then((r) => setSlides(Array.isArray(r.data) ? r.data : r.data.results || []))
      .catch((err) => {
        setLoadError(
          err.response?.status === 401 || err.response?.status === 403
            ? "You need to be logged in as an admin to view slides."
            : "Couldn't load slides. Is the backend server running?"
        );
      });
  };
  useEffect(load, []);

  const update = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: val });
  };

  const editSlide = (s) => {
    setForm({ id: s.id, title: s.title, subtitle: s.subtitle, link_url: s.link_url, order: s.order, active: s.active });
    toast.info(`Editing slide "${s.title}"`, { autoClose: 1800 });
  };
  const resetForm = () => { setForm(emptyForm); setImageFile(null); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const wasEditing = Boolean(form.id);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("subtitle", form.subtitle);
      fd.append("link_url", form.link_url);
      fd.append("order", form.order);
      fd.append("active", form.active);
      if (imageFile) fd.append("image", imageFile);

      if (form.id) {
        await client.patch(`/offers/slideshow/${form.id}/`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        if (!imageFile) {
          toast.error("Please choose an image for the new slide.");
          setSaving(false);
          return;
        }
        await client.post("/offers/slideshow/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      toast.success(wasEditing ? `Slide "${form.title}" updated.` : `Slide "${form.title}" added.`);
      resetForm();
      load();
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

  const doRemove = async (s) => {
    try {
      await client.delete(`/offers/slideshow/${s.id}/`);
      toast.success(`Slide "${s.title}" was deleted.`);
      load();
    } catch {
      toast.error(`Could not delete slide "${s.title}".`);
    }
  };

  const removeSlide = (s) => {
    confirmToast(`Remove slide "${s.title}" from the homepage? This can't be undone.`, () => doRemove(s));
  };

  const toggleActive = async (s) => {
    try {
      await client.patch(`/offers/slideshow/${s.id}/`, { active: !s.active });
      toast.success(`Slide "${s.title}" is now ${!s.active ? "active" : "hidden"}.`);
      load();
    } catch {
      toast.error(`Could not update slide "${s.title}".`);
    }
  };

  if (loadError) {
    return (
      <div className="empty-state">
        <p style={{ fontWeight: 700 }}>{loadError}</p>
        <button className="btn" onClick={load}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ maxWidth: 560, marginBottom: 24 }}>
        <h3>{form.id ? `Edit slide #${form.id}` : "Add a new offer slide"}</h3>
        <form onSubmit={submit}>
          <div className="field"><label>Title</label><input value={form.title} onChange={update("title")} required /></div>
          <div className="field"><label>Subtitle</label><input value={form.subtitle} onChange={update("subtitle")} /></div>
          <div className="field"><label>Link (optional)</label><input value={form.link_url} onChange={update("link_url")} placeholder="/product/12" /></div>
          <div className="field"><label>Order</label><input type="number" value={form.order} onChange={update("order")} /></div>
          <div className="field"><label>Image</label><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <input type="checkbox" style={{ width: "auto" }} checked={form.active} onChange={update("active")} /> Active (visible on homepage)
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : form.id ? "Save changes" : "Add slide"}
            </button>
            {form.id && <button type="button" className="btn secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </div>

      <h3 className="section-title">All slides</h3>
      {slides.length === 0 ? (
        <p style={{ color: "var(--hl-gray)" }}>No slides yet - add one above.</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead><tr><th>Title</th><th>Order</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {slides.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.order}</td>
                  <td><button className="btn secondary" onClick={() => toggleActive(s)}>{s.active ? "Active" : "Hidden"}</button></td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => editSlide(s)}><Pencil size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Edit</button>
                    <button className="btn danger" onClick={() => removeSlide(s)}><Trash2 size={14} style={{ verticalAlign: "-2px", marginRight: 5 }} />Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}