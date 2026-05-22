import { useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
export default function AddRole() {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/auth/roles/create/", { name });
      alert("Role created successfully!");
    } catch {
      alert("Error creating role");
    }
  };

  return (
    <Sidebar>
      <div style={styles.container}>
        <h2 style={styles.title}>Add New Role</h2>
        
        <div style={styles.card}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role Name</label>
            <input
              style={styles.input}
              placeholder="e.g. Manager, Teacher"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button style={styles.primaryButton} onClick={handleSubmit}>
            Create Role
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1E1E2D",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #edf2f7",
  },
  inputGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4A5568",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  primaryButton: {
    width: "100%",
    background: "#6080E8",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
    marginTop: "10px",
    boxShadow: "0 4px 6px rgba(96, 128, 232, 0.2)",
  },
};