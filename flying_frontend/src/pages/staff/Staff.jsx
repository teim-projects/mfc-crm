import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Staff() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {

  try {

    const res = await API.get("/auth/users/");

    setUsers(res.data);

  } catch (err) {

    console.log(err);
  }
};

  const toggleStatus = async (id) => {

  try {

    await API.patch(
      `/auth/users/toggle-status/${id}/`
    );

    // refresh users list
    fetchUsers();

  } catch (err) {

    console.log(err);
  }
};

  return (
    <Sidebar>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>Staff List</h2>

        <div style={styles.buttonGroup}>
          <button 
            style={styles.secondaryButton} 
            onClick={() => navigate("/add-role")}
          >
            + Add Role
          </button>

          <button 
            style={styles.primaryButton} 
            onClick={() => navigate("/add-staff")}
          >
            + Add Staff
          </button>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th> {/* Added for a pro look */}
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} style={styles.tr}>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge}>{user.role || "Staff"}</span>
                  </td>
                  <td style={styles.td}>

  {user.is_superuser ? (

    <span style={styles.superAdminBadge}>
      Super Admin
    </span>

  ) : (

    <button
      onClick={() => toggleStatus(user.id)}
      style={{
        ...styles.statusButton,
        background: user.is_active
          ? "#10b981"
          : "#ef4444",
      }}
    >
      {user.is_active ? "Active" : "Inactive"}
    </button>

  )}

</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={styles.emptyState}>No staff members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Sidebar>
  );
}

const styles = {

  statusButton: {
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
},


superAdminBadge: {
  background: "#111827",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
},
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1E1E2D",
    margin: 0,
  },

  buttonGroup: {
    display: "flex",
    gap: "12px",
  },

  primaryButton: {
    background: "#6080E8", // Your brand blue
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.3s ease",
    boxShadow: "0 4px 6px rgba(96, 128, 232, 0.2)",
  },

  secondaryButton: {
    background: "#fff",
    color: "#6080E8",
    border: "1px solid #6080E8",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },

  tableContainer: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
    overflow: "hidden",
    border: "1px solid #edf2f7",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },

  th: {
    background: "#f8fafc",
    padding: "16px 20px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #edf2f7",
  },

  tr: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background 0.2s",
  },

  td: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#2D3748",
  },

  roleBadge: {
    background: "#f0f4ff",
    color: "#6080E8",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },

  statusDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    background: "#10b981", // Green
    borderRadius: "50%",
    marginRight: "8px",
  },

  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#a0aec0",
  }
};