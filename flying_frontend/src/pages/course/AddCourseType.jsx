import { useEffect, useState } from "react";
import API from "../../api";

export default function AddCourseType({ isOpen, id, onClose, onSuccess }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: ""
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (id) {
        fetchData();
      } else {
        setFormData({ name: "", code: "", description: "" });
      }
    }
  }, [id, isOpen]);

  const fetchData = async () => {
    try {
      const res = await API.get(`/info/course-types/${id}/`);
      setFormData(res.data);
    } catch (err) {
      console.log("Error loading course type profile details:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/info/course-types/update/${id}/`, formData);
        alert("Course Type Updated Successfully ✨");
      } else {
        await API.post(`/info/course-types/create/`, formData);
        alert("Course Type Registered Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      alert("Something went wrong processing standard payloads.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>{id ? "Edit Course Classification" : "Register Course Type"}</h2>
            <p style={styles.subtitle}>Configure curriculum groups and classification keys.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Course Type Name *</label>
              <input
                type="text"
                placeholder="e.g. Abacus Mental Arithmetic"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Unique Identifier Code *</label>
              <input
                type="text"
                placeholder="e.g. ABACUS"
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Program Description Summary</label>
              <textarea
                placeholder="Core objectives or structural specifications covered..."
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={styles.textarea}
              />
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
              {id ? "Save Changes" : "Publish Classification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 2000, padding: "20px", boxSizing: "border-box"
  },
  modalCard: {
    background: "var(--bg-card)", border: "1px solid var(--border-main)", padding: "30px",
    borderRadius: "14px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", width: "100%",
    maxWidth: "540px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box"
  },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-main)", paddingBottom: "16px", marginBottom: "20px" },
  titleWrapper: { display: "flex", flexDirection: "column", gap: "4px" },
  title: { fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: 0 },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0 },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "var(--text-muted)", cursor: "pointer", padding: "0 4px", lineHeight: "1" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  formGrid: { display: "grid", gap: "16px" },
  inputContainer: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" },
  input: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%" },
  textarea: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%", minHeight: "95px", resize: "vertical", fontFamily: "inherit" },
  actionRow: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingTop: "16px" },
  cancelBtn: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  submitBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)", textAlign: "center" }
};