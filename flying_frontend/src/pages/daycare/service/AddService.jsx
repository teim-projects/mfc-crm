import { useEffect, useState } from "react";
import api from "../../../api";

export default function AddService({ isOpen, id, onClose, onSuccess }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  const [formData, setFormData] = useState({
    service_name: "",
    default_amount: "",
    description: "",
    active: true
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (id) {
      fetchService();
    } else {
      setFormData({
        service_name: "",
        default_amount: "",
        description: "",
        active: true
      });
    }
  }, [id, isOpen]);

  const fetchService = async () => {
    try {
      const res = await api.get(`/daycare/daycare-services/${id}/`);
      setFormData(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch service parameters.");
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/daycare/daycare-services/${id}/update/`, formData);
        alert("Service Updated Successfully ✨");
      } else {
        await api.post("/daycare/daycare-services/create/", formData);
        alert("Service Added Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err);
      alert("Something went wrong while trying to update parameters.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>{id ? "Edit Service Parameters" : "Register New Facility Service"}</h2>
            <p style={styles.subtitle}>Configure material metrics and standard flat-rate listings.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            {/* SERVICE NAME */}
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Service Display Name *</label>
              <input
                type="text"
                name="service_name"
                value={formData.service_name || ""}
                onChange={handleChange}
                placeholder="e.g. Extended Hour Supervision"
                style={styles.input}
                required
              />
            </div>

            {/* DEFAULT AMOUNT */}
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Default Unit Base Rate (₹) *</label>
              <input
                type="number"
                name="default_amount"
                value={formData.default_amount || ""}
                onChange={handleChange}
                placeholder="e.g. 1500.00"
                style={styles.input}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Service Description Notes</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Specify service rules, facilities included, or internal structural comments here..."
                style={styles.textarea}
              />
            </div>

            {/* STATUS CHECKBOX */}
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "var(--text-main)", fontWeight: "600", fontSize: "14px" }}>
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active !== false}
                  onChange={handleChange}
                  style={{ cursor: "pointer" }}
                />
                Service Active
              </label>
            </div>
          </div>

          <div style={{
            ...styles.actionRow,
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              {id ? "Save Item Parameters" : "Publish Service Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", boxSizing: "border-box" },
  modalCard: { background: "var(--bg-card)", border: "1px solid var(--border-main)", padding: "30px", borderRadius: "14px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", width: "100%", maxWidth: "550px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-main)", paddingBottom: "16px", marginBottom: "20px" },
  titleWrapper: { display: "flex", flexDirection: "column", gap: "4px" },
  title: { fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0 },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "var(--text-muted)", cursor: "pointer", padding: "0 4px", lineHeight: "1" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  formGrid: { display: "grid", gap: "16px" },
  inputContainer: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" },
  input: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%" },
  textarea: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%", minHeight: "90px", resize: "vertical", fontFamily: "inherit" },
  actionRow: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingTop: "16px" },
  cancelBtn: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  submitBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)", textAlign: "center" }
};