import { useEffect, useState } from "react";
import API from "../../api";
import AddPo from "./AddPo";

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetPOId, setTargetPOId] = useState(null);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await API.get("/inventory/po/");
      setPurchaseOrders(res.data);
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

  return (
    <div>
      {/* HEADER WITH PRO BAR DESIGN */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.headingWrapper}>
            <div style={styles.verticalLine}></div>
            <h2 style={styles.title}>Purchase Orders</h2>
          </div>
          <p style={styles.subtitle}>Track procurement requests and outbound supply cycles.</p>
        </div>

        <button onClick={handleOpenAddModal} style={styles.primaryButton}>
          + Add PO
        </button>
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
              {purchaseOrders.map((po) => (
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
                    <div style={styles.actionButtonGroup}>
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

      {/* POPUP CONFIG OVERLAY */}
      <AddPo isOpen={modalOpen} id={targetPOId} onClose={() => setModalOpen(false)} onSuccess={handleModalSuccess} />
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
  actionButtonGroup: { display: "flex", gap: "6px", alignItems: "center", justifyContent: "center" },
  editBtn: { background: "#fff", color: "#6080E8", border: "1px solid #6080E8", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" },
  deleteBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" },
  emptyState: { padding: "60px 20px", textAlign: "center", color: "#64748b" },
};