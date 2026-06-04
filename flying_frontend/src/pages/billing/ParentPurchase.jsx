import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import Pagination from "../../components/Pagination";
import AdvancedTableFilter from "../../components/AdvancedTableFilter";
import CreateReceipt from "./CreateReceipt"; // FIXED: Added missing import to clear ReferenceError

export default function ParentPurchase() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCreateReceipt, setShowCreateReceipt] = useState(false);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await API.get("/info/schools/");
      setSchools(res.data);
      setFilteredSchools(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // PAGINATION
  // =====================================
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchools = filteredSchools.slice(startIndex, startIndex + itemsPerPage);

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
              <h2 style={styles.title}>Parent Purchase</h2>
            </div>
            <p style={styles.subtitle}>Manage school-wise billing and student receipts.</p>
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
  style={{
    ...styles.primaryButton,
    width: isMobile
      ? "100%"
      : "auto",
  }}
  onClick={() => setShowCreateReceipt(true)}  // ← THIS IS THE CHANGE
>
  + Create Receipt
</button>
          </div>
        </div>

        {/* DATA CONTAINER TABLE */}
        <div style={styles.tableWrapper}>
          {schools.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>School Name</th>
                  <th style={styles.th}>Owner Name</th>
                  <th style={styles.th}>Mobile Number</th>
                  <th style={styles.th}>Fees Taken From</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSchools.map((school) => (
                  <tr key={school.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                      {school.school_name}
                    </td>
                    <td style={styles.td}>{school.owner_name || "—"}</td>
                    <td style={styles.td}>{school.mobile_number || "—"}</td>
                    <td style={styles.td}>
                      <span style={styles.feeBadge}>
                        {school.fees_taken_from || "—"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtonGroup}>
                        <button
                          style={{ ...styles.viewBtn, width: isMobile ? "100%" : "auto" }}
                          onClick={() => navigate(`/billing/school/${school.id}/students`)}
                        >
                          View Students
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
              <p>No managed institution data profiles available inside dashboard systems.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* FILTER SLIDING DRAWER PANEL */}
      {isFilterOpen && (
        <div style={styles.drawerOverlay} onClick={() => setIsFilterOpen(false)} />
      )}
      <div style={{
        ...styles.drawer,
        width: isMobile ? "100%" : "360px",
        transform: isFilterOpen ? "translateX(0)" : "translateX(100%)",
      }}>
        <div style={styles.drawerHeader}>
          <h3 style={styles.drawerTitle}>Filters</h3>
          <button style={styles.closeButton} onClick={() => setIsFilterOpen(false)}>×</button>
        </div>
        <div style={styles.drawerContent}>
          <AdvancedTableFilter
            data={schools}
            onFilter={setFilteredSchools}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>


      

      {/* POPUP MODAL HOOK */}
       <CreateReceipt
        isOpen={showCreateReceipt}
        schoolId={null}
        studentId={null}
        onClose={() => setShowCreateReceipt(false)}
        onSuccess={() => {
          // Refresh schools data or show success message
          fetchSchools();
          setShowCreateReceipt(false);
        }}
      />
    </Sidebar>
  );
}

const styles = {
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
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
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
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    marginBottom: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "750px",
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
    transition: "background-color 0.2s ease",
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
    color: "#334155",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  },
  feeBadge: {
    display: "inline-block",
    background: "#f0fdf4",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  actionButtonGroup: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    justifyContent: "center",
  },
  viewBtn: {
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#64748b",
  },
  drawerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 999,
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100vh",
    backgroundColor: "#fff",
    boxShadow: "-4px 0 15px rgba(0,0,0,0.1)",
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
    borderBottom: "1px solid #e2e8f0",
  },
  drawerTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#64748b",
    cursor: "pointer",
    lineHeight: "1",
  },
  drawerContent: {
    padding: "20px",
    overflowY: "auto",
    flexGrow: 1,
  }
};