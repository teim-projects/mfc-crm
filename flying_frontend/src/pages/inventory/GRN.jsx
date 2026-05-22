import { useEffect, useState } from "react";
import API from "../../api";
import AddGRN from "./AddGRN";

export default function GRN() {
  const [grns, setGrns] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetGRNId, setTargetGRNId] = useState(null);

  useEffect(() => {
    fetchGRN();
  }, []);

  const fetchGRN = async () => {
    try {
      const res = await API.get("/inventory/grn/");
      setGrns(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenAddModal = () => {
    setTargetGRNId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setTargetGRNId(id);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setTargetGRNId(null);
    fetchGRN();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this GRN?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/inventory/grn/delete/${id}/`);
      alert("GRN Deleted Successfully");
      fetchGRN();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.headingWrapper}>
            <div style={styles.verticalLine}></div>
            <h2 style={styles.title}>Goods Receive Notes (GRN)</h2>
          </div>
          <p style={styles.subtitle}>Verify physical warehouse inward arrivals against active order logs.</p>
        </div>

        <button style={styles.primaryButton} onClick={handleOpenAddModal}>
          + Create GRN
        </button>
      </div>

      {/* HORIZONTAL SWIPE WRAPPER CONTAINER */}
      <div style={styles.tableWrapper}>
        {grns.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>GRN Slips Reference</th>
                <th style={styles.th}>PO Reference Code</th>
                <th style={styles.th}>Vendor Supplier</th>
                <th style={styles.th}>Received Inward Date</th>
                <th style={styles.th}>Verification Status</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grns.map((grn) => (
                <tr key={grn.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b", fontFamily: "monospace" }}>
                    {grn.grn_number}
                  </td>
                  <td style={{ ...styles.td, fontWeight: "500", color: "#64748b", fontFamily: "monospace" }}>
                    {grn.po_number}
                  </td>
                  <td style={styles.td}>{grn.vendor_name}</td>
                  <td style={styles.td}>{grn.grn_date}</td>
                  <td style={styles.td}>
                    <span style={styles.activeStatusTag}>
                      {grn.status ? grn.status.toUpperCase() : "VERIFIED"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtonGroup}>
                      <button style={styles.editBtn} onClick={() => handleOpenEditModal(grn.id)}>
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(grn.id)}>
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
            <p>No verified warehouse asset arrival receipts exist within the current panel parameters.</p>
          </div>
        )}
      </div>

      {/* OVERLAY SYSTEM ENTRY POPUP */}
      <AddGRN isOpen={modalOpen} id={targetGRNId} onClose={() => setModalOpen(false)} onSuccess={handleModalSuccess} />
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  },
  titleSection: { display: "flex", flexDirection: "column", gap: "4px" },
  headingWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  verticalLine: { width: "4px", height: "24px", backgroundColor: "#6080E8", borderRadius: "2px", flexShrink: 0 },
  title: { fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "#64748b", margin: 0, paddingLeft: "14px" },
  primaryButton: {
    background: "#6080E8", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px",
    cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
  },
  tableWrapper: {
    width: "100%", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)", overflowX: "auto", WebkitOverflowScrolling: "touch",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "800px" },
  th: {
    background: "#f8fafc", padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "600",
    color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 20px", fontSize: "14px", color: "#334155", whiteSpace: "nowrap", verticalAlign: "middle" },
  activeStatusTag: { display: "inline-block", background: "#f0fdf4", color: "#166534", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.02em" },
  actionButtonGroup: { display: "flex", gap: "6px", alignItems: "center", justifyContent: "center" },
  editBtn: { background: "#fff", color: "#6080E8", border: "1px solid #6080E8", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" },
  deleteBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" },
  emptyState: { padding: "60px 20px", textAlign: "center", color: "#64748b" },
};