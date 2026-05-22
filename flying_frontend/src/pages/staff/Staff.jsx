import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import AddRole from "./AddRole"; 
import AddStaff from "./AddStaff"; // Imported as modular overlay popup

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); 
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false); // Manages state for Staff entry popup

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
      await API.patch(`/auth/users/toggle-status/${id}/`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>Staff Management</h2>
            </div>
            <p style={styles.subtitle}>Manage your team members and their access levels.</p>
          </div>

          <div style={styles.buttonGroup}>
            <button 
              style={styles.secondaryButton} 
              onClick={() => setIsRoleModalOpen(true)}
            >
              Add Role
            </button>
            <button 
              style={styles.primaryButton} 
              onClick={() => setIsStaffModalOpen(true)}
            >
              + Add Staff
            </button>
          </div>
        </div>

        {/* TABLE CONTAINER WITH HORIZONTAL SCROLLER */}
        <div style={styles.tableWrapper}>
          {users.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userNameContainer}>
                         <div style={styles.avatarPlaceholder}>
                           {user.username.charAt(0).toUpperCase()}
                         </div>
                         {user.username}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.roleBadge}>{user.role || "Staff"}</span>
                    </td>
                    <td style={styles.td}>
                      {user.is_superuser ? (
                        <span style={styles.superAdminBadge}>Super Admin</span>
                      ) : (
                        <button
                          onClick={() => toggleStatus(user.id)}
                          style={{
                            ...styles.statusButton,
                            background: user.is_active ? "#10b981" : "#ef4444",
                          }}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
              <p>No staff members found in the system.</p>
            </div>
          )}
        </div>
      </div>

      {/* POPUP MODAL COMPONENTS */}
      <AddRole 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        onSuccess={() => {
          setIsRoleModalOpen(false);
          fetchUsers(); 
        }}
      />

      <AddStaff
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSuccess={() => {
          setIsStaffModalOpen(false);
          fetchUsers(); // Instantly refreshes list row contents upon successful form generation
        }}
      />
    </Sidebar>
  );
}

const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  headingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  verticalLine: {
    width: "4px",
    height: "24px",
    backgroundColor: "#6080E8",
    borderRadius: "2px",
    flexShrink: 0,
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    paddingLeft: "14px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
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
    whiteSpace: "nowrap",
    boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
    textAlign: "center",
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
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  tableWrapper: {
    width: "100%",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    overflowX: "auto", 
    WebkitOverflowScrolling: "touch",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },
  th: {
    background: "#f8fafc",
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
    color: "#334155",
    whiteSpace: "nowrap",
  },
  userNameContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "500",
  },
  avatarPlaceholder: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#f0f4ff",
    color: "#6080E8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "bold",
    flexShrink: 0,
  },
  roleBadge: {
    background: "#f0f4ff",
    color: "#6080E8",
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  statusButton: {
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },
  superAdminBadge: {
    background: "#1e293b",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#64748b",
  }
};