import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function AddStaff() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: ""
  });

  useEffect(() => {
    API.get("/auth/roles/")
      .then(res => setRoles(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    try {
      await API.post("/auth/users/create/", form);
      alert("Staff created successfully!");
    } catch {
      alert("Error creating staff");
    }
  };

  return (
    <Sidebar>
      <div style={styles.container}>
        <h2 style={styles.title}>Add New Staff</h2>

        <div style={styles.card}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              placeholder="Enter username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter secure password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Assign Role</label>
            <select
              style={styles.input}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select a Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <button style={styles.primaryButton} onClick={handleSubmit}>
            Create Staff Member
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

// THIS BLOCK WAS LIKELY MISSING OR MISPLACED
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