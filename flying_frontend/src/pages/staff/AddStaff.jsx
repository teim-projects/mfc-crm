import { useEffect, useState } from "react";
import API from "../../api";

export default function AddStaff({ isOpen, id, onClose, onSuccess }) {
  const [roles, setRoles] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    address: "",
    mobile_number: "",
    spouse_number: "",
    email_id: "",
    qualification: "",
    date_of_birth: "",
    joining_date: "",
    salary: ""
  });

  // Track viewport resizing for dynamic layout adjustment
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      API.get("/auth/roles/")
        .then((res) => setRoles(res.data))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && id) {
      fetchStaff();
    } else if (isOpen && !id) {
      setForm({
        username: "",
        password: "",
        role: "",
        address: "",
        mobile_number: "",
        spouse_number: "",
        email_id: "",
        qualification: "",
        date_of_birth: "",
        joining_date: "",
        salary: "",
      });
    }
  }, [id, isOpen]);

  const fetchStaff = async () => {
    try {
      const res = await API.get(`/auth/users/${id}/`);
      setForm({
        username: res.data.username || "",
        password: "",
        role: res.data.role || "",
        address: res.data.address || "",
        mobile_number: res.data.mobile_number || "",
        spouse_number: res.data.spouse_number || "",
        email_id: res.data.email_id || "",
        qualification: res.data.qualification || "",
        date_of_birth: res.data.date_of_birth || "",
        joining_date: res.data.joining_date || "",
        salary: res.data.salary || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!form.username.trim() || !form.role) {
      alert("Username and Role are required.");
      return;
    }

    try {
      const payload = { ...form };

      if (id) {
        if (!payload.password) {
          delete payload.password;
        }
        await API.put(`/auth/users/update/${id}/`, payload);
        alert("Staff Updated Successfully ✨");
      } else {
        if (!form.password.trim()) {
          alert("Password is required.");
          return;
        }
        await API.post("/auth/users/create/", form);
        alert("Staff Created Successfully 🚀");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err.response?.data);
      alert("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>{id ? "Edit Staff Member" : "Add New Staff"}</h2>
            <p style={styles.modalSubtitle}>Configure system access parameters, registry codes, and payroll details.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* MULTI-COLUMN RESPONSIVE CREDENTIALS CONTAINER */}
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username *</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Enter unique profile handle"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Assign System Role *</label>
              <select
                style={styles.select}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: Number(e.target.value) })}
                required
              >
                <option value="">Select an authorization tier</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>{id ? "Update Password (Optional)" : "Account Password *"}</label>
              <input
                type="password"
                style={styles.input}
                placeholder={id ? "Leave blank to preserve existing token" : "Create standard secure password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!id}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Primary Contact Number</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Mobile number"
                value={form.mobile_number}
                onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Secondary Emergency Contact</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Spouse / guardian phone"
                value={form.spouse_number}
                onChange={(e) => setForm({ ...form, spouse_number: e.target.value })}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                style={styles.input}
                placeholder="name@myflyingcolours.com"
                value={form.email_id}
                onChange={(e) => setForm({ ...form, email_id: e.target.value })}
              />
            </div>



            <div style={styles.inputGroup}>
  <label style={styles.label}>Date of Birth</label>
  <input
    type="date"
    style={styles.input}
    value={form.date_of_birth}
    onChange={(e) =>
      setForm({
        ...form,
        date_of_birth: e.target.value,
      })
    }
  />
</div>

            <div style={styles.inputGroup}>
  <label style={styles.label}>Qualification</label>
  <input
    type="text"
    style={styles.input}
    placeholder="B.Sc, B.Com, MBA, MCA..."
    value={form.qualification}
    onChange={(e) =>
      setForm({
        ...form,
        qualification: e.target.value,
      })
    }
  />
</div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Joining</label>
              <input
                type="date"
                style={styles.input}
                value={form.joining_date}
                onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Basic Base Salary (₹)</label>
              <input
                type="number"
                style={styles.input}
                placeholder="0.00"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </div>

            <div style={{ ...styles.inputGroup, gridColumn: isMobile ? "initial" : "span 2" }}>
              <label style={styles.label}>Residential Mailing Address</label>
              <textarea
                style={styles.textarea}
                rows="2"
                placeholder="Provide physical street location details..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          {/* ACTION BUTTON GROUP FOOTER */}
          <div style={{
            ...styles.footerActions,
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              {id ? "Update Staff Member" : "Create Staff Profile"}
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
    backgroundColor: "rgba(0, 0, 0, 0.65)", // Match high contrast background backdrop mask shadow logic
    backdropFilter: "blur(5px)", 
    WebkitBackdropFilter: "blur(5px)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 2000, 
    padding: "16px", 
    boxSizing: "border-box" 
  },
  modalCard: { 
    background: "var(--bg-card)", 
    border: "1px solid var(--border-main)", // Highlighting perimeter structure wireline definitions
    padding: "26px", 
    borderRadius: "16px", 
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", 
    width: "100%", 
    maxWidth: "640px", 
    maxHeight: "85vh", 
    overflowY: "auto", 
    boxSizing: "border-box" 
  },
  modalHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    borderBottom: "1px solid var(--border-main)", 
    paddingBottom: "14px", 
    marginBottom: "18px" 
  },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: 0 },
  modalSubtitle: { fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0", lineHeight: "1.4" },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "var(--text-muted)", cursor: "pointer", lineHeight: "1" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  formGrid: { display: "grid", gap: "14px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" },
  input: { 
    padding: "10px 12px", 
    borderRadius: "6px", 
    border: "1px solid var(--border-main)", 
    background: "var(--bg-surface)",
    fontSize: "14px", 
    outline: "none", 
    color: "var(--text-main)", 
    width: "100%", 
    boxSizing: "border-box" 
  },
  select: { 
    padding: "10px 12px", 
    borderRadius: "6px", 
    border: "1px solid var(--border-main)", 
    background: "var(--bg-surface)",
    fontSize: "14px", 
    outline: "none", 
    color: "var(--text-main)", 
    width: "100%", 
    boxSizing: "border-box", 
    cursor: "pointer" 
  },
  textarea: { 
    padding: "10px 12px", 
    borderRadius: "6px", 
    border: "1px solid var(--border-main)", 
    background: "var(--bg-surface)",
    fontSize: "14px", 
    outline: "none", 
    resize: "none", 
    width: "100%", 
    boxSizing: "border-box", 
    color: "var(--text-main)", 
    fontFamily: "inherit" 
  },
  footerActions: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingTop: "14px" },
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
  }
};