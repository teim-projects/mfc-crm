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

  const [courseTypes, setCourseTypes] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    API.get("/info/course-types/")
      .then(res => setCourseTypes(res.data));
  }, []);

  const handleCourseTypeChange = async (id) => {
    if (!id) {
      setLevels([]);
      setFormData({ ...formData, course_type: "", level: "" });
      return;
    }
    const res = await API.get(`/info/course-levels/?course_type=${id}`);
    setLevels(res.data);
    setFormData({
      ...formData,
      course_type: id,
      level: ""
    });
  };

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
      // Fetch matching levels for editing instance to prevent empty options
      if (res.data.course_type) {
        const levelsRes = await API.get(`/info/course-levels/?course_type=${res.data.course_type}`);
        setLevels(levelsRes.data);
      }
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
                value={formData.course_type}
                onChange={(e) => handleCourseTypeChange(e.target.value)}
                style={styles.select} /* 🌟 Fixed: Applied dark mode style hook */
                required
              >
                <option value="">Select Course Type</option>
                {courseTypes.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Academic Level *</label>
              <select
                value={formData.level}
                name="level"
                onChange={handleChange}
                style={styles.select} /* 🌟 Fixed: Applied dark mode style hook */
                required
              >
                <option value="">Select Level</option>
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.level_name}
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
    backgroundColor: "rgba(0, 0, 0, 0.65)", 
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
    background: "var(--bg-card)", 
    border: "1px solid var(--border-main)", 
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", 
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
    borderBottom: "1px solid var(--border-main)", 
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
    color: "var(--text-main)", 
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "var(--text-muted)", 
    margin: 0,
  },
  closeX: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "var(--text-muted)", 
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
    color: "var(--text-muted)", 
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", 
    background: "var(--bg-surface)", 
    fontSize: "14px",
    outline: "none",
    color: "var(--text-main)", 
    boxSizing: "border-box",
    width: "100%",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", 
    background: "var(--bg-surface)", 
    fontSize: "14px",
    outline: "none",
    color: "var(--text-main)", 
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", 
    background: "var(--bg-surface)", 
    fontSize: "14px",
    outline: "none",
    color: "var(--text-main)", 
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
    borderTop: "1px solid var(--border-main)", 
    paddingTop: "16px",
  },
  cancelBtn: {
    background: "transparent",
    color: "var(--text-main)", 
    border: "1px solid var(--border-main)", 
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