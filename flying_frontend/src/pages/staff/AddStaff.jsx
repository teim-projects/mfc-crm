import { useEffect, useState } from "react";
import API from "../../api";

export default function AddStaff({ isOpen, onClose, onSuccess }) {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: ""
  });

  useEffect(() => {
    if (isOpen) {
      API.get("/auth/roles/")
        .then((res) => setRoles(res.data))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.username.trim() || !form.password.trim() || !form.role) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      await API.post("/auth/users/create/", form);
      alert("Staff created successfully!");
      setForm({ username: "", password: "", role: "" }); // Reset on successful creation
      onSuccess();
    } catch {
      alert("Error creating staff");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      {/* Click propagation stopped to prevent modal closing when working inside the card container */}
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.title}>Add New Staff</h2>
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div style={styles.formContent}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter secure password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Assign Role</label>
            <select
              style={styles.select}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.actionGroup}>
          <button style={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.primaryButton} onClick={handleSubmit}>
            Create Staff Member
          </button>
        </div>
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
    backgroundColor: "rgba(30, 30, 45, 0.4)", // Perfectly balances transparency depth
    backdropFilter: "blur(5px)", // Consistent frosted glass layout look
    WebkitBackdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    background: "#fff",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid #edf2f7",
    width: "100%",
    maxWidth: "480px",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "4px",
    lineHeight: "1",
  },
  formContent: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginBottom: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    color: "#334155",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    color: "#334155",
    background: "#fff",
    cursor: "pointer",
  },
  actionGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  secondaryButton: {
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  primaryButton: {
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