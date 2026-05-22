import { useEffect, useState } from "react";
import API from "../../api";
import AddVendor from "./AddVendor"; // Adjust route file paths if necessary

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetVendorId, setTargetVendorId] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await API.get("/inventory/vendors/");
      setVendors(res.data);
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

  return (
    <div>
      {/* HEADER CONTROLS */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div style={styles.headingWrapper}>
            <div style={styles.verticalLine}></div>
            <h2 style={styles.title}>Vendor Directory</h2>
          </div>
          <p style={styles.subtitle}>Manage institutional product suppliers and commercial business profiles.</p>
        </div>

        <button style={styles.primaryButton} onClick={handleOpenAddModal}>
          + Add Vendor
        </button>
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
              {vendors.map((vendor) => (
                <tr key={vendor.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                    <div style={styles.vendorRowSection}>
                      <div style={styles.avatarPlaceholder}>
                        {vendor.vendor_name ? vendor.vendor_name.charAt(0).toUpperCase() : "V"}
                      </div>
                      {vendor.vendor_name}
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

      {/* MODAL WRAPPER INSTANCE */}
      <AddVendor
        isOpen={modalOpen}
        id={targetVendorId}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
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
    padding: "12px 20px",
    fontSize: "14px",
    color: "#334155",
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
    background: "#f0f4ff",
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
    background: "#f1f5f9",
    color: "#475569",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  actionButtonGroup: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    background: "#fff",
    color: "#6080E8",
    border: "1px solid #6080E8",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#64748b",
  },
};