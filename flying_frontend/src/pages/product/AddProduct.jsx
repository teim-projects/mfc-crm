import { useEffect, useState } from "react";
import API from "../../api";

export default function AddProduct({ isOpen, id, onClose, onSuccess }) {
  const [courses, setCourses] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  const [formData, setFormData] = useState({
    product_name: "",
    product_type: "",
    course_type: "",
    course: "",
    unit_price: "",
    description: "",
    is_active: true,
  });

  // Track viewport resizing for dynamic layout adjustment
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      if (id) {
        fetchProduct();
      } else {
        setFormData({
          product_name: "",
          product_type: "",
          course_type: "",
          course: "",
          unit_price: "",
          description: "",
          is_active: true,
        });
      }
    }
  }, [id, isOpen]);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/info/courses/");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/inventory/products/${id}/`);
      setFormData({
        ...res.data,
        course: res.data.course || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const filteredCourses = courses.filter((course) => {
    return course.course_type === formData.course_type;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product_type") {
      if (value === "bag") {
        setFormData({
          ...formData,
          product_type: value,
          course_type: "common",
          course: "",
        });
        return;
      }
      setFormData({
        ...formData,
        product_type: value,
        course_type: "",
        course: "",
      });
      return;
    }

    if (name === "course_type") {
      setFormData({
        ...formData,
        course_type: value,
        course: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };

      if (payload.product_type === "bag") {
        payload.course_type = "common";
        payload.course = null;
      }

      if (payload.product_type === "instrument") {
        payload.course = null;
      }

      if (id) {
        await API.put(`/inventory/products/update/${id}/`, payload);
        alert("Product Updated Successfully ✨");
      } else {
        await API.post("/inventory/products/create/", payload);
        alert("Product Added Successfully 🚀");
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
            <h2 style={styles.title}>{id ? "Edit Stock Item" : "Register New Product"}</h2>
            <p style={styles.subtitle}>Configure material inventory parameters and rate listings.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Product Display Name *</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name || ""}
                onChange={handleChange}
                placeholder="e.g. Abacus Toolkit Level 1"
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Inventory Item Type *</label>
              <select
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select Product Type</option>
                <option value="book">Book</option>
                <option value="instrument">Instrument</option>
                <option value="bag">Bag</option>
              </select>
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Selling Unit Price (₹) *</label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                placeholder="0.00"
                style={styles.input}
                required
              />
            </div>

            {/* COURSE TYPE FIELD */}
            {(formData.product_type === "book" ||
              formData.product_type === "instrument" ||
              formData.product_type === "bag") && (
              <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
                <label style={styles.fieldLabel}>Course Alignment Type *</label>
                <select
                  name="course_type"
                  value={formData.course_type}
                  onChange={handleChange}
                  style={styles.select}
                  required
                  disabled={formData.product_type === "bag"}
                >
                  <option value="">Select Course Alignment</option>
                  <option value="abacus">Abacus</option>
                  <option value="vedic_maths">Vedic Maths</option>
                  {formData.product_type === "bag" && <option value="common">Common</option>}
                </select>
              </div>
            )}

            {/* DYNAMIC COURSE LEVEL BOUNDARY FIELD */}
            {formData.product_type === "book" && (
              <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
                <label style={styles.fieldLabel}>Specific Course Target Level *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select Associated Level</option>
                  {filteredCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_type === "abacus" ? "Abacus" : "Vedic Maths"} - {course.level}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* STATIC LABEL LABELS */}
            {formData.product_type === "instrument" && (
              <div style={{ ...styles.infoWrapper, gridColumn: isMobile ? "span 1" : "initial" }}>
                <span style={styles.infoLabel}>Automated Level Assignment</span>
                <div style={styles.infoBox}>All Levels Applicable</div>
              </div>
            )}

            {formData.product_type === "bag" && (
              <div style={{ ...styles.infoWrapper, gridColumn: isMobile ? "span 1" : "initial" }}>
                <span style={styles.infoLabel}>Automated Level Assignment</span>
                <div style={styles.infoBox}>Common Distribution Set</div>
              </div>
            )}

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Product Description Summary</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Add stock notes or package specifications here..."
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
              {id ? "Save Item Parameters" : "Publish Stock Item"}
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
    backgroundColor: "rgba(0, 0, 0, 0.65)", // Darkened backdrop mask logic
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
    border: "1px solid var(--border-main)", // 🌟 Perimeter framework highlights
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // Soft shadow depth tracking
    width: "100%",
    maxWidth: "580px",
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
    fontSize: "14px",
    outline: "none",
    color: "var(--text-main)", // 👈 Variable
    boxSizing: "border-box",
    width: "100%",
    background: "var(--bg-surface)", // 👈 Variable
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
    fontFamily: "inherit",
  },
  infoWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  infoLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-muted)", // 👈 Variable
  },
  infoBox: {
    background: "var(--bg-surface)", // 👈 Variable
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", // 👈 Variable
    color: "var(--text-td)", // 👈 Variable
    fontSize: "14px",
    fontWeight: "600",
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
    textAlign: "center",
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
    textAlign: "center",
  },
};