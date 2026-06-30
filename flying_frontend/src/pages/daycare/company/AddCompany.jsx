// src/pages/daycare/membership/AddCompany.jsx

import { useEffect, useState } from "react";
import API from "../../../api";

export default function AddCompany({ isOpen, id, onClose, onSuccess }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  const [formData, setFormData] = useState({
    company_name: "",
    company_code: "",
    contact_person: "",
    designation: "",
    phone: "",
    email: "",
    address: "",
    membership_fee: "",
    tie_up_start_date: "",
    tie_up_end_date: "",
    remarks: "",
    is_active: true,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (id) {
      loadCompany();
    } else {
      setFormData({
        company_name: "",
        company_code: "",
        contact_person: "",
        designation: "",
        phone: "",
        email: "",
        address: "",
        membership_fee: "",
        tie_up_start_date: "",
        tie_up_end_date: "",
        remarks: "",
        is_active: true,
      });
    }
  }, [id, isOpen]);

  const loadCompany = async () => {
    try {
      const res = await API.get(`/daycare/companies/${id}/`);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load company profile parameters.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/daycare/companies/${id}/update/`, formData);
        alert("Company Updated Successfully ✨");
      } else {
        await API.post("/daycare/companies/create/", formData);
        alert("Company Added Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Unable to save company specifications registry.");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>{id ? "Edit Company Registry" : "Register Corporate Unit"}</h2>
            <p style={styles.subtitle}>Configure corporate profile parameters and billing settings.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            {/* COMPANY NAME */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleChange}
                placeholder="e.g. Acme Corporation"
                style={styles.input}
                required
              />
            </div>

            {/* COMPANY CODE */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Company Code *</label>
              <input
                type="text"
                name="company_code"
                value={formData.company_code || ""}
                onChange={handleChange}
                placeholder="e.g. ACM-4221"
                style={styles.input}
                required
              />
            </div>

            {/* CONTACT PERSON */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Contact Person</label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person || ""}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                style={styles.input}
              />
            </div>

            {/* DESIGNATION */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation || ""}
                onChange={handleChange}
                placeholder="e.g. HR Manager"
                style={styles.input}
              />
            </div>

            {/* PHONE */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                style={styles.input}
              />
            </div>

            {/* EMAIL */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="e.g. contact@acme.com"
                style={styles.input}
              />
            </div>

            {/* MEMBERSHIP FEE */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Membership Fee (₹)</label>
              <input
                type="number"
                name="membership_fee"
                value={formData.membership_fee || ""}
                onChange={handleChange}
                placeholder="e.g. 5000"
                style={styles.input}
              />
            </div>

            {/* DUMMY ROW GAP PREVENTER SPANNING */}
            <div style={styles.inputContainer} />

            {/* TIE UP START DATE */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Tie Up Start Date</label>
              <input
                type="date"
                name="tie_up_start_date"
                value={formData.tie_up_start_date || ""}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* TIE UP END DATE */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Tie Up End Date</label>
              <input
                type="date"
                name="tie_up_end_date"
                value={formData.tie_up_end_date || ""}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* ADDRESS */}
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Address</label>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Enter complete office or corporate business address details..."
                style={styles.textarea}
              />
            </div>

            {/* REMARKS */}
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
                placeholder="Add special corporate arrangements, references or custom partnership terms..."
                style={styles.textarea}
              />
            </div>

            {/* ACTIVE CHECKS */}
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "var(--text-main)", fontWeight: "600", fontSize: "14px" }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active || false}
                  onChange={handleChange}
                  style={{ cursor: "pointer" }}
                />
                Company Track Active
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
              {id ? "Save Framework Changes" : "Publish Corporate Unit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", boxSizing: "border-box" },
  modalCard: { background: "var(--bg-card)", border: "1px solid var(--border-main)", padding: "30px", borderRadius: "14px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" },
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
  textarea: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%", minHeight: "80px", resize: "vertical", fontFamily: "inherit" },
  actionRow: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingTop: "16px" },
  cancelBtn: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  submitBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)", textAlign: "center" }
};