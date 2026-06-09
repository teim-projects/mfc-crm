import { useEffect, useState } from "react";
import API from "../../api";

export default function AddVendor({ isOpen, id, onClose, onSuccess }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );
  const [formData, setFormData] = useState({
    vendor_name: "",
    email: "",
    phone: "",
    operating_state: "",
    gst_number: "",
    category: "",
    contact_person: "",
    address: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && id) {
      fetchVendor();
    } else if (!id) {
      setFormData({
        vendor_name: "",
        email: "",
        phone: "",
        operating_state: "",
        gst_number: "",
        category: "",
        contact_person: "",
        address: "",
      });
    }
  }, [id, isOpen]);

  const fetchVendor = async () => {
    try {
      const res = await API.get(`/inventory/vendors/${id}/`);
      setFormData({
        vendor_name: res.data.vendor_name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        operating_state: res.data.operating_state || "",
        gst_number: res.data.gst_number || "",
        category: res.data.category || "",
        contact_person: res.data.contact_person || "",
        address: res.data.address || "",
      });
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
        await API.put(`/inventory/vendors/update/${id}/`, formData);
        alert("Vendor Updated Successfully ✨");
      } else {
        await API.post("/inventory/vendors/create/", formData);
        alert("Vendor Added Successfully 🚀");
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
            <h2 style={styles.title}>{id ? "Edit Vendor Details" : "Register Supplier Vendor"}</h2>
            <p style={styles.subtitle}>Configure trading lines, offices, and registration markers.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Vendor Agency Name *</label>
              <input
                type="text"
                name="vendor_name"
                placeholder="Corporate Enterprises"
                value={formData.vendor_name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Point of Contact Email</label>
              <input
                type="email"
                name="email"
                placeholder="supplier@agency.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Mobile / Connection Phone *</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone line details"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Operating State Region</label>
              <input
                type="text"
                name="operating_state"
                placeholder="State Province"
                value={formData.operating_state}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>GST Tax Reference Code</label>
              <input
                type="text"
                name="gst_number"
                placeholder="GST Identification Line"
                value={formData.gst_number}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "initial" }}>
              <label style={styles.fieldLabel}>Product Distribution Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Stationary, Uniforms"
                value={formData.category}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Office POC Lead Manager</label>
              <input
                type="text"
                name="contact_person"
                placeholder="Full Name of direct account manager handler"
                value={formData.contact_person}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Warehouse / Corporate Address</label>
              <textarea
                name="address"
                placeholder="Full physical headquarters information details..."
                value={formData.address}
                onChange={handleChange}
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
              {id ? "Save Business Configurations" : "Register Vendor Supplier"}
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
    backgroundColor: "rgba(0, 0, 0, 0.65)", // Darkened backdrop mask context definition
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
    border: "1px solid var(--border-main)", // 🌟 Highlighted frame boundary definition wireframe
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // Deep depth drop shadow mapping
    width: "100%",
    maxWidth: "620px",
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