import { useEffect, useState } from "react";
import API from "../../api";

export default function AddCourse({ isOpen, id, onClose, onSuccess }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  const [formData, setFormData] = useState({
    course_type: "",
    level: "",
    tuition_fees: "",
    duration: "",
    description: "",
  });

  // Track viewport resizing for dynamic layout adjustment
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && id) {
      fetchCourse();
    } else if (!id) {
      setFormData({
        course_type: "",
        level: "",
        tuition_fees: "",
        duration: "",
        description: "",
      });
    }
  }, [id, isOpen]);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/info/courses/${id}/`);
      setFormData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/info/courses/update/${id}/`, formData);
        alert("Course Updated Successfully ✨");
      } else {
        await API.post("/info/courses/create/", formData);
        alert("Course Added Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      alert("Something went wrong");
    }
  };

  const getLevels = () => {
    if (formData.course_type === "vedic_maths") {
      return ["Level 1", "Level 2", "Level 3"];
    }
    if (formData.course_type === "abacus") {
      return Array.from({ length: 12 }, (_, i) => `Level ${i + 1}`);
    }
    return [];
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>{id ? "Edit Course Config" : "Create New Course"}</h2>
            <p style={styles.subtitle}>Configure curriculums, pricing models, and timeline metrics.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Course Program Type *</label>
              <select
                name="course_type"
                value={formData.course_type}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select Course Type</option>
                <option value="vedic_maths">Vedic Maths</option>
                <option value="abacus">Abacus</option>
              </select>
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Academic Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={styles.select}
                required
                disabled={!formData.course_type}
              >
                <option value="">Select Level</option>
                {getLevels().map((level, i) => (
                  <option key={i} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Tuition Base Fees (₹) *</label>
              <input
                type="number"
                name="tuition_fees"
                value={formData.tuition_fees}
                onChange={handleChange}
                placeholder="e.g. 4500"
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Expected Duration Track *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 3 Months"
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Syllabus Summary / Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detail core operations covered in this track level..."
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
              {id ? "Update Course Data" : "Save Course Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)", // Darkened overlay mask configuration
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
    boxSizing: "border-box",
  },
  modalCard: {
    background: "var(--bg-card)", // 👈 Variable
    border: "1px solid var(--border-main)", // 🌟 Polished highlighted outer edge tracking frame 
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // Heightened shadow configuration logic
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid var(--border-main)", // 👈 Variable
    paddingBottom: "16px",
    marginBottom: "20px",
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-main)", // 👈 Variable
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "var(--text-muted)", // 👈 Variable
    margin: 0,
  },
  closeX: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "var(--text-muted)", // 👈 Variable
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: "1",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGrid: {
    display: "grid",
    gap: "16px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-muted)", // 👈 Variable
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", // 👈 Variable
    background: "var(--bg-surface)", // 👈 Variable
    fontSize: "14px",
    outline: "none",
    color: "var(--text-main)", // 👈 Variable
    boxSizing: "border-box",
    width: "100%",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", // 👈 Variable
    background: "var(--bg-surface)", // 👈 Variable
    fontSize: "14px",
    outline: "none",
    color: "var(--text-main)", // 👈 Variable
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", // 👈 Variable
    background: "var(--bg-surface)", // 👈 Variable
    fontSize: "14px",
    outline: "none",
    color: "var(--text-main)", // 👈 Variable
    boxSizing: "border-box",
    width: "100%",
    minHeight: "90px",
    resize: "vertical",
    fontFamily: "inherit"
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    borderTop: "1px solid var(--border-main)", // 👈 Variable
    paddingTop: "16px",
  },
  cancelBtn: {
    background: "transparent",
    color: "var(--text-main)", // 👈 Variable
    border: "1px solid var(--border-main)", // 👈 Variable
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "center"
  },
  submitBtn: {
    background: "#6080E8",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
    textAlign: "center"
  },
};