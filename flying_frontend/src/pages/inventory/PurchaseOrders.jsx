import { useEffect, useState } from "react";
import API from "../../api";
import AddPo from "./AddPo";
import Pagination from "../../components/Pagination";
import AdvancedTableFilter from "../../components/AdvancedTableFilter";

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredPOs, setFilteredPOs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [targetPOId, setTargetPOId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Controls sliding sidebar filter

  // Real-time responsive layout breakpoint observer
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    fetchPOs();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await API.get("/inventory/po/");
      setPurchaseOrders(res.data);
      setFilteredPOs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenAddModal = () => {
    setTargetPOId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setTargetPOId(id);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setTargetPOId(null);
    fetchPOs();
  };

  const deletePO = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this PO?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/inventory/po/delete/${id}/`);
      alert("PO Deleted");
      fetchPOs();
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // PAGINATION
  // =====================================
  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPOs = filteredPOs.slice(startIndex, startIndex + itemsPerPage);

  const isMobile = windowWidth <= 640;

  return (
    <div style={styles.container}>
      {/* HEADER WITH PRO BAR DESIGN */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center"
      }}>
        <div style={styles.titleSection}>
          <div style={styles.headingWrapper}>
            <div style={styles.verticalLine}></div>
            <h2 style={styles.title}>Purchase Orders</h2>
          </div>
          <p style={styles.subtitle}>Track procurement requests and outbound supply cycles.</p>
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
            onClick={handleOpenAddModal} 
            style={{ ...styles.primaryButton, width: isMobile ? "100%" : "auto" }}
          >
            + Add PO
          </button>
        </div>
      </div>

      {/* HORIZONTAL SCROLL ENHANCED TABLE */}
      <div style={styles.tableWrapper}>
        {purchaseOrders.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PO Number</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>PO Date</th>
                <th style={styles.th}>Delivery Date</th>
                <th style={styles.th}>Grand Total</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPOs.map((po) => (
                <tr key={po.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#6080E8", fontFamily: "monospace" }}>
                    {po.po_number}
                  </td>
                  <td style={{ ...styles.td, fontWeight: "500", color: "#1e293b" }}>{po.vendor_name}</td>
                  <td style={styles.td}>{po.po_date}</td>
                  <td style={styles.td}>{po.delivery_date}</td>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#0f172a" }}>
                    ₹ {Number(po.grand_total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={styles.td}>
                    <div style={{
                      ...styles.actionButtonGroup,
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "8px" : "6px"
                    }}>
                      <button style={{ ...styles.editBtn, width: isMobile ? "100%" : "auto" }} onClick={() => handleOpenEditModal(po.id)}>
                        Edit
                      </button>
                      <button style={{ ...styles.deleteBtn, width: isMobile ? "100%" : "auto" }} onClick={() => deletePO(po.id)}>
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
            <p>No managed procurement orders found in this registry index block.</p>
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
            data={purchaseOrders}
            onFilter={setFilteredPOs}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>

      {/* POPUP CONFIG OVERLAY */}
      <AddPo isOpen={modalOpen} id={targetPOId} onClose={() => setModalOpen(false)} onSuccess={handleModalSuccess} />
    </div>
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
  titleSection: { display: "flex", flexDirection: "column", gap: "4px" },
  headingWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  verticalLine: { width: "4px", height: "24px", backgroundColor: "#6080E8", borderRadius: "2px", flexShrink: 0 },
  title: { fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "#64748b", margin: 0, paddingLeft: "14px" },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  primaryButton: {
    background: "#6080E8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px",
    cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
    textAlign: "center", boxSizing: "border-box",
  },
  secondaryButton: {
    background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "10px 16px", borderRadius: "6px",
    cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", textAlign: "center", boxSizing: "border-box",
  },
  tableWrapper: {
    width: "100%", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)", overflowX: "auto", WebkitOverflowScrolling: "touch",
    marginBottom: "20px"
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "800px" },
  th: {
    background: "#f8fafc", padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "600",
    color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 20px", fontSize: "14px", color: "#334155", whiteSpace: "nowrap", verticalAlign: "middle" },
  actionButtonGroup: { display: "flex", alignItems: "center", justifyContent: "center" },
  editBtn: { background: "#fff", color: "#6080E8", border: "1px solid #6080E8", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px", boxSizing: "border-box" },
  deleteBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px", boxSizing: "border-box" },
  emptyState: { padding: "60px 20px", textAlign: "center", color: "#64748b" },
  
  /* SLIDING SIDEBAR STYLES */
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