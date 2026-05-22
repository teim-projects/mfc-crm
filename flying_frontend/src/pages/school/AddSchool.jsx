import { useState, useEffect } from "react";
import API from "../../api";

export default function AddSchool({ isOpen, id, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    school_name: "",
    owner_name: "",
    email: "",
    address: "",
    contact_person: "",
    mobile_number: "",
    contact_person_no: "",
    fees_taken_from: "parents",
    coordinator_name: "",
    coordinator_number: "",
    landline_number: "",
    tution_fees: "" // Added to ensure matching state variables are captured seamlessly
  });

  useEffect(() => {
    if (isOpen && id) {
      fetchSchool();
    } else if (!id) {
      // Clear data when opening fresh to add a school
      setFormData({
        school_name: "",
        owner_name: "",
        email: "",
        address: "",
        contact_person: "",
        mobile_number: "",
        contact_person_no: "",
        fees_taken_from: "parents",
        coordinator_name: "",
        coordinator_number: "",
        landline_number: "",
        tution_fees: ""
      });
    }
  }, [id, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchSchool = async () => {
    try {
      const res = await API.get(`/info/schools/${id}/`);
      setFormData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/info/schools/update/${id}/`, formData);
        alert("School Updated Successfully ✨");
      } else {
        await API.post("/info/schools/create/", formData);
        alert("School Added Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err.response?.data || err);
      alert("Something went wrong");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>{id ? "Edit School Details" : "Register New School"}</h2>
            <p style={styles.subtitle}>Fill in the structural configurations for this institution.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>School Name *</label>
              <input
                type="text"
                name="school_name"
                required
                value={formData.school_name || ""}
                onChange={handleChange}
                placeholder="Academy International"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Owner Name</label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name || ""}
                onChange={handleChange}
                placeholder="John Doe"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="contact@school.com"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Primary Mobile Number</label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number || ""}
                onChange={handleChange}
                placeholder="+1 555-0199"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Contact Person</label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person || ""}
                onChange={handleChange}
                placeholder="Registrar Name"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Contact Person Phone</label>
              <input
                type="text"
                name="contact_person_no"
                value={formData.contact_person_no || ""}
                onChange={handleChange}
                placeholder="Contact line"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Coordinator Name</label>
              <input
                type="text"
                name="coordinator_name"
                value={formData.coordinator_name || ""}
                onChange={handleChange}
                placeholder="Lead supervisor"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Coordinator Number</label>
              <input
                type="text"
                name="coordinator_number"
                value={formData.coordinator_number || ""}
                onChange={handleChange}
                placeholder="Coordinator line"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Landline Number</label>
              <input
                type="text"
                name="landline_number"
                value={formData.landline_number || ""}
                onChange={handleChange}
                placeholder="Office landline"
                style={styles.input}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Tuition Fees (₹)</label>
              <input
                type="number"
                name="tution_fees"
                value={formData.tution_fees || ""}
                onChange={handleChange}
                placeholder="5000"
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: "span 2" }}>
              <label style={styles.fieldLabel}>Physical Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Street address, City, State"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.billingSection}>
            <span style={styles.billingTitle}>Billing Target Method</span>
            <div style={styles.radioContainer}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="fees_taken_from"
                  value="parents"
                  checked={formData.fees_taken_from === "parents"}
                  onChange={handleChange}
                  style={styles.radioInput}
                />
                Tuition fees will be taken from Parents
              </label>

              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="fees_taken_from"
                  value="school"
                  checked={formData.fees_taken_from === "school"}
                  onChange={handleChange}
                  style={styles.radioInput}
                />
                Tuition fees will be taken from School
              </label>
            </div>
          </div>

          <div style={styles.actionRow}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              {id ? "Save Structural Changes" : "Register School Institution"}
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
    backgroundColor: "rgba(15, 23, 42, 0.4)",
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
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    width: "100%",
    maxWidth: "680px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid #f1f5f9",
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
    color: "#1e293b",
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  closeX: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: "1",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: window.innerWidth <= 600 ? "1fr" : "1fr 1fr",
    gap: "16px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    gridColumn: window.innerWidth <= 600 ? "span 2" : "initial",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    color: "#334155",
    boxSizing: "border-box",
    width: "100%",
  },
  billingSection: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  billingTitle: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
  radioContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "500",
  },
  radioInput: {
    accentColor: "#6080E8",
    margin: 0,
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
    marginTop: "10px",
  },
  cancelBtn: {
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  submitBtn: {
    background: "#6080E8",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
  },
};