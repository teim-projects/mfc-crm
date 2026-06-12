import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import AddRole from "./AddRole"; 
import AddStaff from "./AddStaff"; 
import Pagination from "../../components/Pagination";
import AdvancedTableFilter from "../../components/AdvancedTableFilter";
import RecordViewer from "../../components/RecordViewer";

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); 
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [targetStaffId, setTargetStaffId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    fetchUsers();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users/");
      setUsers(res.data);
      setFilteredUsers(res.data);
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

  const deleteStaff = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/auth/users/delete/${id}/`);
      alert("Staff Deleted Successfully");
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const isMobile = windowWidth <= 640;

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={{
          ...styles.header,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center"
        }}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>Staff Management</h2>
            </div>
            <p style={styles.subtitle}>Manage your team members and their access levels.</p>
          </div>

          <div style={{
            ...styles.buttonGroup,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto"
          }}>
            <button 
              style={{ ...styles.secondaryButton, width: isMobile ? "100%" : "auto" }} 
              onClick={() => setIsFilterOpen(true)}
            >
              🔍 Filter
            </button>
            <button 
              style={{ ...styles.secondaryButton, width: isMobile ? "100%" : "auto" }} 
              onClick={() => setIsRoleModalOpen(true)}
            >
              Add Role
            </button>
            <button 
              style={{ ...styles.primaryButton, width: isMobile ? "100%" : "auto" }} 
              onClick={() => {
                setTargetStaffId(null);
                setIsStaffModalOpen(true);
              }}
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
                  <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={{ ...styles.userNameContainer, color: "var(--text-main)" }}>
                         <div style={styles.avatarPlaceholder}>
                           {user.username.charAt(0).toUpperCase()}
                         </div>
                         {user.username}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.roleBadge}>{user.role_name || "Staff"}</span>
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
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          style={styles.recordBtn}
                          onClick={() => {
                            setSelectedUser(user);
                            setViewOpen(true);
                          }}
                        >
                          +
                        </button>

                        <button
                          style={styles.editBtn}
                          onClick={() => {
                            setTargetStaffId(user.id);
                            setIsStaffModalOpen(true);
                          }}
                        >
                          Edit
                        </button>

                        {!user.is_superuser && (
  <button
    style={styles.deleteBtn}
    onClick={() => deleteStaff(user.id)}
  >
    Delete
  </button>
)}
                      </div>
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
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* FILTER SLIDING DRAWER & OVERLAY */}
      {isFilterOpen && (
        <div style={styles.drawerOverlay} onClick={() => setIsFilterOpen(false)} />
      )}
      <div style={{
        ...styles.drawer,
        width: isMobile ? "100%" : "360px",
        transform: isFilterOpen ? "translateX(0)" : "translateX(100%)"
      }}>
        <div style={styles.drawerHeader}>
          <h3 style={styles.drawerTitle}>Filters</h3>
          <button style={styles.closeButton} onClick={() => setIsFilterOpen(false)}>×</button>
        </div>
        <div style={styles.drawerContent}>
          <AdvancedTableFilter
            data={users}
            onFilter={setFilteredUsers}
            setItemsPerPage={setItemsPerPage}
          />
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
        id={targetStaffId}
        onClose={() => {
          setIsStaffModalOpen(false);
          setTargetStaffId(null);
        }}
        onSuccess={() => {
          setIsStaffModalOpen(false);
          setTargetStaffId(null);
          fetchUsers();
        }}
      />
      <RecordViewer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        record={selectedUser}
        title="Staff Details"
      />
    </Sidebar>
  );
}

const styles = {
  actionButtons: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "nowrap"
  },
  editBtn: {
    background: "transparent",
    color: "#6080E8",
    border: "1px solid #6080E8",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
  recordBtn: {
    background: "var(--bg-layout)",
    color: "#6080E8",
    border: "1px solid #6080E8",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    boxSizing: "border-box",
    padding: "4px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "16px",
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
    color: "var(--text-main)",
    margin: 0,
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "13px",
    color: "var(--text-muted)",
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
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
    textAlign: "center",
    boxSizing: "border-box",
  },
  secondaryButton: {
    background: "var(--bg-card)",
    color: "var(--text-main)",
    border: "1px solid var(--border-main)",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
    textAlign: "center",
    boxSizing: "border-box",
  },
  tableWrapper: {
    width: "100%",
    background: "var(--bg-card)",
    borderRadius: "12px",
    border: "1px solid var(--border-main)",
    boxShadow: "0 1px 3px var(--shadow-light)",
    overflowX: "auto", 
    WebkitOverflowScrolling: "touch",
    marginBottom: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
  },
  th: {
    background: "var(--bg-table-th)",
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid var(--border-main)",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid var(--border-light)",
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
    color: "var(--text-td)",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
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
    background: "rgba(96, 128, 232, 0.15)",
    color: "#6080E8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "bold",
    flexShrink: 0,
  },
  roleBadge: {
    background: "rgba(96, 128, 232, 0.12)",
    color: "#7C94F2",
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
    background: "#6080E8",
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
    color: "var(--text-muted)",
  },
  drawerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    backgroundColor: "var(--bg-card)",
    boxShadow: "-4px 0 15px rgba(0,0,0,0.2)",
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid var(--border-main)",
  },
  drawerTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text-main)",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "var(--text-muted)",
    cursor: "pointer",
    lineHeight: "1",
  },
  drawerContent: {
    padding: "20px",
    overflowY: "auto",
    flexGrow: 1,
  }
};