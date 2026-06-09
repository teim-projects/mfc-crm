import { useEffect, useState } from "react";
import API from "../../api";
import AddPo from "./AddPo";
import Pagination from "../../components/Pagination";
import AdvancedTableFilter from "../../components/AdvancedTableFilter";
import RecordViewer from "../../components/RecordViewer";

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredPOs, setFilteredPOs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [targetPOId, setTargetPOId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedPO, setSelectedPO] = useState(null);

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
                  <td style={{ ...styles.td, fontWeight: "500", color: "var(--text-main)" }}>{po.vendor_name}</td>
                  <td style={styles.td}>{po.po_date}</td>
                  <td style={styles.td}>{po.delivery_date}</td>
                  <td style={{ ...styles.td, fontWeight: "600", color: "var(--text-main)" }}>
                    ₹ {Number(po.grand_total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtonGroup}>
                      <button
                        style={styles.recordBtn}
                        onClick={() => {
                          setSelectedPO(po);
                          setViewOpen(true);
                        }}
                      >
                        +
                      </button>
                      <button style={styles.editBtn} onClick={() => handleOpenEditModal(po.id)}>
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => deletePO(po.id)}>
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
      <RecordViewer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        record={selectedPO}
        title="Purchase Order Details"
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
  titleSection: { display: "flex", flexDirection: "column", gap: "4px" },
  headingWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  verticalLine: { width: "4px", height: "24px", backgroundColor: "#6080E8", borderRadius: "2px", flexShrink: 0 },
  title: { fontSize: "22px", fontWeight: "700", color: "var(--text-main)", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0, paddingLeft: "14px" },
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
    background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 16px", borderRadius: "6px",
    cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", textAlign: "center", boxSizing: "border-box",
  },
  tableWrapper: {
    width: "100%", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-main)",
    boxShadow: "0 1px 3px var(--shadow-light)", overflowX: "auto", WebkitOverflowScrolling: "touch",
    marginBottom: "20px"
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "800px" },
  th: {
    background: "var(--bg-table-th)", padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "600",
    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-main)", whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid var(--border-light)" },
  td: { padding: "12px 20px", fontSize: "14px", color: "var(--text-td)", whiteSpace: "nowrap", verticalAlign: "middle" },
  actionButtonGroup: { display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", flexWrap: "nowrap", gap: "6px" },
  editBtn: { background: "transparent", color: "#6080E8", border: "1px solid #6080E8", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px", boxSizing: "border-box", whiteSpace: "nowrap" },
  deleteBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px", boxSizing: "border-box", whiteSpace: "nowrap" },
  emptyState: { padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" },
  
  /* SLIDING SIDEBAR STYLES */
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