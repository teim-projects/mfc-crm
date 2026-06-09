import { useEffect, useState } from "react";
import API from "../../api";
import AddVendor from "./AddVendor"; 
import Pagination from "../../components/Pagination";
import AdvancedTableFilter from "../../components/AdvancedTableFilter";
import RecordViewer from "../../components/RecordViewer";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [targetVendorId, setTargetVendorId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Real-time responsive layout breakpoint observer
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    fetchVendors();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await API.get("/inventory/vendors/");
      setVendors(res.data);
      setFilteredVendors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenAddModal = () => {
    setTargetVendorId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setTargetVendorId(id);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setTargetVendorId(null);
    fetchVendors();
  };

  const deleteVendor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/inventory/vendors/delete/${id}/`);
      alert("Vendor Deleted");
      fetchVendors();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // =====================================
  // PAGINATION
  // =====================================
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  const isMobile = windowWidth <= 640;

  return (
    <div style={styles.container}>
      {/* HEADER CONTROLS */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center"
      }}>
        <div style={styles.titleSection}>
          <div style={styles.headingWrapper}>
            <div style={styles.verticalLine}></div>
            <h2 style={styles.title}>Vendor Directory</h2>
          </div>
          <p style={styles.subtitle}>Manage institutional product suppliers and commercial business profiles.</p>
        </div>

        <div style={{
          ...styles.buttonGroup,
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "100%" : "auto"
        }}>
          {/* COMPACT FILTER TRIGGER */}
          <button 
            style={{ ...styles.secondaryButton, width: isMobile ? "100%" : "auto" }} 
            onClick={() => setIsFilterOpen(true)}
          >
            🔍 Filter
          </button>
          <button 
            style={{ ...styles.primaryButton, width: isMobile ? "100%" : "auto" }} 
            onClick={handleOpenAddModal}
          >
            + Add Vendor
          </button>
        </div>
      </div>

      {/* HORIZONTAL SWIPE CONTAINER SCROLLER */}
      <div style={styles.tableWrapper}>
        {vendors.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Vendor / Agency Name</th>
                <th style={styles.th}>Mobile Connection</th>
                <th style={styles.th}>Email Address</th>
                <th style={styles.th}>GST Tax Reference</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.map((vendor) => (
                <tr key={vendor.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.vendorRowSection}>
                      <div style={styles.avatarPlaceholder}>
                        {vendor.vendor_name ? vendor.vendor_name.charAt(0).toUpperCase() : "V"}
                      </div>
                      <span style={{ fontWeight: "600", color: "var(--text-main)" }}>
                        {vendor.vendor_name}
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>{vendor.phone || "—"}</td>
                  <td style={styles.td}>{vendor.email || "—"}</td>
                  <td style={styles.td}>
                    <span style={styles.gstMarker}>{vendor.gst_number || "—"}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtonGroup}>
                      <button
                        style={styles.recordBtn}
                        onClick={() => {
                          setSelectedVendor(vendor);
                          setViewOpen(true);
                        }}
                      >
                        +
                      </button>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleOpenEditModal(vendor.id)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteVendor(vendor.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyState}>
            <p>No business vendor accounts are found recorded within this panel subsystem yet.</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* SLIDING FILTER SIDEBAR PANEL */}
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
            data={vendors}
            onFilter={setFilteredVendors}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>

      {/* MODAL WRAPPER INSTANCE */}
      <AddVendor
        isOpen={modalOpen}
        id={targetVendorId}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
      <RecordViewer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        record={selectedVendor}
        title="Vendor Details"
      />
    </div>
  );
}

const styles = {
  recordBtn: {
    background: "var(--bg-layout)",
    color: "#6080E8",
    border: "1px solid #6080E8",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
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
    minWidth: "750px",
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
    transition: "background-color 0.2s ease",
  },
  td: {
    padding: "12px 20px",
    fontSize: "14px",
    color: "var(--text-td)",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  },
  vendorRowSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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
  gstMarker: {
    fontFamily: "monospace",
    background: "var(--bg-surface)",
    color: "var(--text-td)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    display: "inline-block",
    border: "1px solid var(--border-main)"
  },
  actionButtonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: "6px"
  },
  editBtn: {
    background: "transparent",
    color: "#6080E8",
    border: "1px solid #6080E8",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    boxSizing: "border-box",
    whiteSpace: "nowrap"
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    boxSizing: "border-box",
    whiteSpace: "nowrap"
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