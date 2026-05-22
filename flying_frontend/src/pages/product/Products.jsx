import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import AddProduct from "./AddProduct";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetProductId, setTargetProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/inventory/products/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenAddModal = () => {
    setTargetProductId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setTargetProductId(id);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setTargetProductId(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/inventory/products/delete/${id}/`);
      alert("Product Deleted");
      fetchProducts();
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
              <h2 style={styles.title}>Inventory Products</h2>
            </div>
            <p style={styles.subtitle}>
              Track book allocations, calculating instruments, and package components across centers.
            </p>
          </div>

          <button style={styles.primaryButton} onClick={handleOpenAddModal}>
            + Add Product
          </button>
        </div>

        {/* DATA SHEET WRAPPER */}
        <div style={styles.tableWrapper}>
          {products.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product Item</th>
                  <th style={styles.th}>Stock Code</th>
                  <th style={styles.th}>Classification</th>
                  <th style={styles.th}>Associated Course</th>
                  <th style={styles.th}>Level Target</th>
                  <th style={styles.th}>Unit Rate</th>
                  <th style={styles.th}>Active Status</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                      {product.product_name}
                    </td>
                    <td style={{ ...styles.td, color: "#475569", fontFamily: "monospace", fontSize: "13px" }}>
                      {product.product_code || "—"}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.typeBadge}>
                        {product.product_type ? product.product_type.toUpperCase() : "—"}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: "#475569" }}>
                      {product.course_type_name === "vedic_maths" ? "Vedic Maths" : product.course_type_name === "abacus" ? "Abacus" : product.course_type_name || "—"}
                    </td>
                    <td style={{ ...styles.td, fontWeight: "500", color: "#64748b" }}>
                      {product.course_level || "Common"}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.rateLabel}>
                        ₹ {Number(product.unit_price || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: product.is_active ? "#dcfce7" : "#fee2e2",
                          color: product.is_active ? "#166534" : "#991b1b",
                        }}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtonGroup}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleOpenEditModal(product.id)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteProduct(product.id)}
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
              <p>No published warehouse stock profiles conform to this tracking filter registry line.</p>
            </div>
          )}
        </div>
      </div>

      {/* COMPONENT OVERLAY POPUP */}
      <AddProduct
        isOpen={modalOpen}
        id={targetProductId}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
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
    minWidth: "900px",
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
  typeBadge: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.02em",
  },
  rateLabel: {
    fontWeight: "600",
    color: "#0f172a",
  },
  statusBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textAlign: "center",
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