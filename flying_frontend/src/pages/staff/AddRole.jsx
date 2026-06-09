import { useState } from "react";
import API from "../../api";

export default function AddRole({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a role name");
      return;
    }
    try {
      await API.post("/auth/roles/create/", { name });
      alert("Role created successfully!");
      onSuccess(); 
    } catch {
      alert("Error creating role");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.title}>Add New Role</h2>
          <button style={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Role Name</label>
          <input
            style={styles.input}
            placeholder="e.g. Manager, Teacher"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.actionGroup}>
          <button style={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.primaryButton} onClick={handleSubmit}>
            Create Role
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
    backgroundColor: "rgba(0, 0, 0, 0.65)", // 🌟 Darkened backdrop overlay for crisp popup isolation
    backdropFilter: "blur(5px)", 
    WebkitBackdropFilter: "blur(5px)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000, 
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    background: "var(--bg-card)", // 👈 Dynamic variable
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // 🌟 Deep depth shadow highlight
    border: "1px solid var(--border-main)", // 👈 Dynamic highlighted border frame line
    width: "100%",
    maxWidth: "450px", 
    boxSizing: "border-box",
    animation: "fadeIn 0.2s ease-out",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-main)", // 👈 Dynamic variable
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "var(--text-muted)", // 👈 Dynamic variable
    cursor: "pointer",
    padding: "4px",
    lineHeight: "1",
  },
  inputGroup: {
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-muted)", // 👈 Dynamic variable
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid var(--border-main)", // 👈 Dynamic variable
    background: "var(--bg-surface)", // 👈 Dynamic variable (contrasts against card bg)
    fontSize: "14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    color: "var(--text-main)", // 👈 Dynamic variable
  },
  actionGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
  },
  secondaryButton: {
    background: "transparent",
    color: "var(--text-main)", // 👈 Dynamic variable
    border: "1px solid var(--border-main)", // 👈 Dynamic variable
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "center",
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
    textAlign: "center",
  },
};