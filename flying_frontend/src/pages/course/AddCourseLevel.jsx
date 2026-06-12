import { useEffect, useState } from "react";
import API from "../../api";

export default function AddCourseLevel({ isOpen, id, onClose, onSuccess }) {
  const [courseTypes, setCourseTypes] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  const [formData, setFormData] = useState({
    course_type: "",
    level_name: "",
    order_no: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCourseTypes();
      if (id) {
        fetchLevel();
      } else {
        setFormData({
          course_type: "",
          level_name: "",
          order_no: "",
        });
      }
    }
  }, [id, isOpen]);

  const fetchCourseTypes = async () => {
    try {
      const res = await API.get("/info/course-types/");
      setCourseTypes(res.data);
    } catch (err) {
      console.log("Error loading catalog course types:", err);
    }
  };

  const fetchLevel = async () => {
    try {
      const res = await API.get(`/info/course-levels/${id}/`);
      setFormData(res.data);
    } catch (err) {
      console.log("Error loading current target level parameters:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/info/course-levels/update/${id}/`, formData);
        alert("Level Updated Successfully ✨");
      } else {
        await API.post("/info/course-levels/create/", formData);
        alert("Level Added Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      alert("Something went wrong processing requested level changes.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>{id ? "Edit Level Parameters" : "Create Curriculum Level"}</h2>
            <p style={styles.subtitle}>Configure sequence routing order maps and category titles.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Course Type Classification *</label>
              <select
                value={formData.course_type}
                onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
                style={styles.select}
                required
              >
                <option value="">Select Course Type</option>
                {courseTypes.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Level Display Name *</label>
              <input
                type="text"
                value={formData.level_name || ""}
                onChange={(e) => setFormData({ ...formData, level_name: e.target.value })}
                placeholder="e.g. Level 1"
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Order No Sequence *</label>
              <input
                type="number"
                value={formData.order_no || ""}
                onChange={(e) => setFormData({ ...formData, order_no: e.target.value })}
                placeholder="e.g. 1"
                style={styles.input}
                required
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
              {id ? "Save Settings" : "Publish Milestone"}
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
  select: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%", cursor: "pointer" },
  actionRow: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingTop: "16px" },
  cancelBtn: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  submitBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)", textAlign: "center" }
};