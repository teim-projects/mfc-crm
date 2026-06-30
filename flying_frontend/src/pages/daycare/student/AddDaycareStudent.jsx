import { useEffect, useState } from "react";
import api from "../../../api";

export default function AddDaycareStudent({ isOpen, onClose, onSuccess, student }) {
  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  const [formData, setFormData] = useState({
    child_name: "",
    age: "",
    date_of_birth: "",
    gender: "",
    parent_name: "",
    father_name: "",
    mother_name: "",
    mobile_no: "",
    alternate_mobile: "",
    email: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_no: "",
    company: "",
    hours_per_day: "",
    days_per_month: 30,
    hourly_rate: "",
    allergies: "",
    medical_notes: "",
    special_instructions: "",
    selected_services: [],
    active: true
  });

  const [childPhoto, setChildPhoto] = useState(null);
  const [parentPhoto, setParentPhoto] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      loadServices();
    }
  }, [isOpen]);

  useEffect(() => {
    if (student) {
      setFormData({
        child_name: student.child_name || "",
        age: student.age || "",
        date_of_birth: student.date_of_birth || "",
        gender: student.gender || "",
        parent_name: student.parent_name || "",
        father_name: student.father_name || "",
        mother_name: student.mother_name || "",
        mobile_no: student.mobile_no || "",
        alternate_mobile: student.alternate_mobile || "",
        email: student.email || "",
        address: student.address || "",
        emergency_contact_name: student.emergency_contact_name || "",
        emergency_contact_no: student.emergency_contact_no || "",
        company: student.company || "",
        hours_per_day: student.hours_per_day || "",
        days_per_month: student.days_per_month || 30,
        hourly_rate: student.hourly_rate || "",
        allergies: student.allergies || "",
        medical_notes: student.medical_notes || "",
        special_instructions: student.special_instructions || "",
        selected_services: student.selected_services || [],
        active: student.active ?? true
      });
    } else {
      setFormData({
        child_name: "",
        age: "",
        date_of_birth: "",
        gender: "",
        parent_name: "",
        father_name: "",
        mother_name: "",
        mobile_no: "",
        alternate_mobile: "",
        email: "",
        address: "",
        emergency_contact_name: "",
        emergency_contact_no: "",
        company: "",
        hours_per_day: "",
        days_per_month: 30,
        hourly_rate: "",
        allergies: "",
        medical_notes: "",
        special_instructions: "",
        selected_services: [],
        active: true
      });
    }
  }, [student]);

  const loadCompanies = async () => {
    try {
      const res = await api.get("/daycare/companies/");
      setCompanies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadServices = async () => {
    try {
      const res = await api.get("/daycare/daycare-services/");
      setServices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleServiceChange = (id) => {
    let arr = [...formData.selected_services];
    if (arr.includes(id)) {
      arr = arr.filter(item => item !== id);
    } else {
      arr.push(id);
    }
    setFormData({ ...formData, selected_services: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "selected_services") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (childPhoto) data.append("child_photo", childPhoto);
      if (parentPhoto) data.append("parent_photo", parentPhoto);

      if (student?.id) {
        await api.put(
          `/daycare/daycare-students/${student.id}/update/`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        alert("Student Updated Successfully 🚀");
      } else {
        await api.post(
          "/daycare/daycare-students/create/",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        alert("Student Added Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      alert("Error Saving Student Profile");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>
              {student ? "Edit Daycare Student" : "Register Daycare Student"}
            </h2>
            <p style={styles.subtitle}>Configure child details, parent logs, allocations, and service matrix cards.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* SECTION 1: CHILD PROFILE */}
          <h4 style={styles.sectionHeading}>Child Profile Parameters</h4>
          <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Child Name *</label>
              <input 
                type="text" 
                name="child_name" 
                placeholder="e.g. Aarav Sharma" 
                style={styles.input} 
                value={formData.child_name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Age *</label>
              <input 
                type="number" 
                name="age" 
                placeholder="e.g. 4" 
                style={styles.input} 
                value={formData.age} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Date of Birth *</label>
              <input 
                type="date" 
                name="date_of_birth" 
                style={styles.input} 
                value={formData.date_of_birth} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Gender Classification *</label>
              <select 
                name="gender" 
                style={styles.select} 
                value={formData.gender} 
                onChange={handleChange} 
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Child Identification Photograph</label>
              <input type="file" style={styles.fileInput} onChange={(e) => setChildPhoto(e.target.files[0])} />
            </div>
          </div>

          {/* SECTION 2: PARENT SPECIFICATIONS */}
          <h4 style={styles.sectionHeading}>Parent/Guardian Details</h4>
          <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Primary Parent Name *</label>
              <input 
                type="text" 
                name="parent_name" 
                placeholder="Primary Guardian Name" 
                style={styles.input} 
                value={formData.parent_name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Father's Name</label>
              <input 
                type="text" 
                name="father_name" 
                placeholder="Father's Full Name" 
                style={styles.input} 
                value={formData.father_name} 
                onChange={handleChange} 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Mother's Name</label>
              <input 
                type="text" 
                name="mother_name" 
                placeholder="Mother's Full Name" 
                style={styles.input} 
                value={formData.mother_name} 
                onChange={handleChange} 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Primary Mobile Connection *</label>
              <input 
                type="text" 
                name="mobile_no" 
                placeholder="10-digit mobile number" 
                style={styles.input} 
                value={formData.mobile_no} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Alternate Mobile Connection</label>
              <input 
                type="text" 
                name="alternate_mobile" 
                placeholder="Secondary fallback connection" 
                style={styles.input} 
                value={formData.alternate_mobile} 
                onChange={handleChange} 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="guardian@example.com" 
                style={styles.input} 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Parent/Guardian Photograph File</label>
              <input type="file" style={styles.fileInput} onChange={(e) => setParentPhoto(e.target.files[0])} />
            </div>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Residential Address Summary *</label>
              <textarea 
                name="address" 
                placeholder="Enter complete residential street location details..." 
                style={styles.textarea} 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* SECTION 3: EMERGENCY & COMPANY TIE-UPS */}
          <h4 style={styles.sectionHeading}>Emergency Registry & Affiliation</h4>
          <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>SOS Contact Name *</label>
              <input 
                type="text" 
                name="emergency_contact_name" 
                placeholder="Emergency Contact Name" 
                style={styles.input} 
                value={formData.emergency_contact_name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>SOS Connection Phone *</label>
              <input 
                type="text" 
                name="emergency_contact_no" 
                placeholder="Emergency Contact Phone" 
                style={styles.input} 
                value={formData.emergency_contact_no} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={{ ...styles.inputContainer, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.fieldLabel}>Corporate Partnership Affiliation</label>
              <select 
                name="company" 
                style={styles.select} 
                value={formData.company} 
                onChange={handleChange}
              >
                <option value="">Select Associated Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 4: FINANCIAL CRITERIA */}
          <h4 style={styles.sectionHeading}>Pricing Matrix Configuration</h4>
          <div style={{ ...styles.formGrid, gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)" }}>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Hours Per Day *</label>
              <input 
                type="number" 
                name="hours_per_day" 
                placeholder="e.g. 6" 
                style={styles.input} 
                value={formData.hours_per_day} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Days Per Month *</label>
              <input 
                type="number" 
                name="days_per_month" 
                style={styles.input} 
                value={formData.days_per_month} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Hourly Rate (₹) *</label>
              <input 
                type="number" 
                name="hourly_rate" 
                placeholder="e.g. 120" 
                style={styles.input} 
                value={formData.hourly_rate} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* SECTION 5: SERVICES LOG SELECTION */}
          <h4 style={styles.sectionHeading}>Associated Daycare Services</h4>
          <div style={styles.checkboxContainerBlock}>
            {services.map((s) => (
              <label key={s.id} style={styles.checkboxLabelItem}>
                <input 
                  type="checkbox" 
                  checked={formData.selected_services.includes(s.id)}
                  onChange={() => handleServiceChange(s.id)} 
                  style={{ cursor: "pointer" }} 
                />
                <span style={{ color: "var(--text-td)", fontSize: "14px" }}>{s.service_name}</span>
              </label>
            ))}
          </div>

          {/* SECTION 6: ADDITIONAL PARAMETERS */}
          <h4 style={styles.sectionHeading}>Medical Records & Special Parameters</h4>
          <div style={styles.form}>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Allergies Description Summary</label>
              <textarea 
                name="allergies" 
                placeholder="Specify any food, chemical, or environment allergies..." 
                style={styles.textarea} 
                value={formData.allergies} 
                onChange={handleChange} 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Critical Medical Notes</label>
              <textarea 
                name="medical_notes" 
                placeholder="Enter pre-existing conditions or medical instructions..." 
                style={styles.textarea} 
                value={formData.medical_notes} 
                onChange={handleChange} 
              />
            </div>
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Special Operations Instructions</label>
              <textarea 
                name="special_instructions" 
                placeholder="Enter pick-up rules, custom timing conditions, or specific constraints..." 
                style={styles.textarea} 
                value={formData.special_instructions} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* FORM FOOTER CONTAINER BUTTONS */}
          <div style={{
            ...styles.actionRow,
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>
              {student ? "Update Student" : "Save Student Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", boxSizing: "border-box" },
  modalCard: { background: "var(--bg-card)", border: "1px solid var(--border-main)", padding: "30px", borderRadius: "14px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-main)", paddingBottom: "16px", marginBottom: "20px" },
  titleWrapper: { display: "flex", flexDirection: "column", gap: "4px" },
  title: { fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0 },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "var(--text-muted)", cursor: "pointer", padding: "0 4px", lineHeight: "1" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  sectionHeading: { fontSize: "14px", fontWeight: "700", color: "#6080E8", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px dashed var(--border-main)", paddingBottom: "6px", margin: "14px 0 6px 0" },
  formGrid: { display: "grid", gap: "14px" },
  inputContainer: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" },
  input: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%" },
  fileInput: { padding: "8px 12px", borderRadius: "6px", border: "1px dashed var(--border-main)", background: "var(--bg-layout)", color: "var(--text-muted)", fontSize: "13px", outline: "none", cursor: "pointer", width: "100%", boxSizing: "border-box" },
  select: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%", background: "var(--bg-surface)", cursor: "pointer" },
  textarea: { padding: "10px 14px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", boxSizing: "border-box", width: "100%", minHeight: "75px", resize: "vertical", fontFamily: "inherit" },
  checkboxContainerBlock: { display: "flex", flexDirection: "column", gap: "10px", background: "var(--bg-surface)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-main)" },
  checkboxLabelItem: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  actionRow: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingTop: "16px", marginTop: "12px" },
  cancelBtn: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  submitBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)", textAlign: "center" }
};