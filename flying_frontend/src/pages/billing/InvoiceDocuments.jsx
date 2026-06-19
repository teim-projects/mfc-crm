import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import AdvancedTableFilter from "../../components/AdvancedTableFilter";
import RecordViewer from "../../components/RecordViewer";
import AddInvoiceDocument from "./AddInvoiceDocument"; 

export default function InvoiceDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false); 
  const [targetId, setTargetId] = useState(null); 
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/billing/invoice-documents/");
      setDocuments(res.data);
      setFilteredDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeBadge = (type) => {
    if (type === "PROFORMA") {
      return <span style={styles.proformaBadge}>Proforma Invoice</span>;
    }
    return <span style={styles.invoiceBadge}>Invoice</span>;
  };

  const handleDelete = async (id, documentNo) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${documentNo}?`);
    if (!confirmDelete) return;

    try {
      await API.delete(`/billing/invoice-documents/delete/${id}/`);
      alert("Document deleted successfully!");
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document");
    }
  };

  const handleConvertToInvoice = async (doc) => {
    if (doc.document_type !== "PROFORMA") {
      alert("Only Proforma Invoices can be converted to actual invoices.");
      return;
    }
    
    const confirmConvert = window.confirm(
      `Convert ${doc.document_no} to Actual Invoice?\n\nThis will change the document type from PROFORMA to INVOICE.`
    );
    
    if (!confirmConvert) return;
    
    try {
      const updatedDoc = { ...doc, document_type: "INVOICE" };
      await API.put(`/billing/invoice-documents/update/${doc.id}/`, updatedDoc);
      alert(`Successfully converted ${doc.document_no} to Invoice!`);
      fetchDocuments(); 
    } catch (err) {
      console.error("Error converting document:", err);
      alert(err.response?.data?.message || "Failed to convert document");
    }
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + itemsPerPage);

  const isMobile = windowWidth <= 640;

  if (loading) {
    return (
      <Sidebar>
        <div style={styles.loading}>Loading documents...</div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER AREA */}
        <div style={{
          ...styles.header,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center"
        }}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>Invoices & Proforma</h2>
            </div>
            <p style={styles.subtitle}>
              Manage all your invoices and proforma documents.
            </p>
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
              style={{ ...styles.primaryButton, width: isMobile ? "100%" : "auto" }}
              onClick={() => {
                setTargetId(null); 
                setIsCreateOpen(true);
              }}
            >
              + Create Document
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW MATRIX CARDS */}
        <div style={{
          ...styles.statsContainer,
          gridTemplateColumns: windowWidth <= 480 ? "1fr" : windowWidth <= 820 ? "1fr 1fr" : "repeat(auto-fit, minmax(180px, 1fr))"
        }}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{documents.length}</div>
            <div style={styles.statLabel}>Total Documents</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#7C94F2" }}>
              {documents.filter(d => d.document_type === "INVOICE").length}
            </div>
            <div style={styles.statLabel}>Invoices</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#f59e0b" }}>
              {documents.filter(d => d.document_type === "PROFORMA").length}
            </div>
            <div style={styles.statLabel}>Proforma</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#10b981" }}>
              {/* Reference color used for financial registration badges */}
              ₹{documents.reduce((sum, d) => sum + parseFloat(d.grand_total || 0), 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
            <div style={styles.statLabel}>Total Value</div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div style={styles.tableWrapper}>
          {filteredDocuments.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Document No.</th>
                  <th style={styles.th}>Type Classification</th>
                  <th style={styles.th}>School Origin</th>
                  <th style={styles.th}>Billing Date</th>
                  <th style={styles.th}>Grand Total</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDocuments.map((doc) => (
                  <tr key={doc.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#6080E8", fontFamily: "monospace" }}>
                      {doc.document_no}
                    </td>
                    <td style={styles.td}>
                      {getDocumentTypeBadge(doc.document_type)}
                    </td>
                    <td style={{ ...styles.td, fontWeight: "600", color: "var(--text-main)" }}>{doc.school_name}</td>
                    <td style={{ ...styles.td, color: "var(--text-muted)" }}>{doc.invoice_date}</td>
                    <td style={{ ...styles.td, fontWeight: "700", color: "var(--text-main)" }}>
                      ₹{parseFloat(doc.grand_total).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtonGroup}>
                        <button
                          style={styles.recordBtn}
                          onClick={() => {
                            setSelectedRecord(doc);
                            setViewOpen(true);
                          }}
                          title="View Details"
                        >
                          +
                        </button>
                        
                        {/* Convert Button - Only for Proforma */}
                        {doc.document_type === "PROFORMA" ? (
                          <button
                            style={styles.convertBtn}
                            onClick={() => handleConvertToInvoice(doc)}
                            title="Convert to Invoice"
                          >
                            Convert
                          </button>
                        ) : (
                          <button
                            style={{ ...styles.convertBtn, opacity: 0.5, cursor: "not-allowed", background: "#e2e8f0", color: "#94a3b8", borderColor: "#cbd5e1" }}
                            disabled
                            title="Already an Invoice"
                          >
                            Invoiced
                          </button>
                        )}

                        <button
                          style={styles.viewBtn}
                          onClick={() => window.open(`/api/billing/invoice-pdf/${doc.id}/`, '_blank')}
                          title="View PDF"
                        >
                          View
                        </button>

                        <button
                          style={styles.downloadPdfBtn}
                          onClick={() => window.location.href = `/api/billing/invoice-download/${doc.id}/`}
                          title="Download PDF"
                        >
                          📥
                        </button>

                        <button
                          style={styles.editBtn}
                          onClick={() => {
                            setTargetId(doc.id);
                            setIsCreateOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(doc.id, doc.document_no)}
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
              {documents.length === 0 ? (
                <>
                  <p>No document structures found filed within standard clusters.</p>
                  <button
                    style={styles.createButton}
                    onClick={() => {
                      setTargetId(null);
                      setIsCreateOpen(true);
                    }}
                  >
                    Create Your First Document
                  </button>
                </>
              ) : (
                <p>No logged vouchers match current tracking parameters.</p>
              )}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* FILTER DRAWER */}
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
            data={documents}
            onFilter={setFilteredDocuments}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      <AddInvoiceDocument
        isOpen={isCreateOpen}
        id={targetId} 
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          setIsCreateOpen(false);
          fetchDocuments();
        }}
      />

      {/* RECORD VIEWER MODAL */}
      <RecordViewer
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        record={selectedRecord}
        title="Document Details"
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
  statsContainer: {
    display: "grid",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "var(--bg-card)",
    padding: "18px 16px",
    borderRadius: "12px",
    border: "1px solid var(--border-main)",
    textAlign: "center",
    boxShadow: "0 1px 3px var(--shadow-light)"
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#6080E8",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "600"
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
    minWidth: "850px",
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
    padding: "14px 20px",
    fontSize: "14px",
    color: "var(--text-td)",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  },
  proformaBadge: {
    background: "rgba(217, 119, 6, 0.15)",
    color: "#f59e0b",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block",
    textTransform: "uppercase"
  },
  invoiceBadge: {
    background: "rgba(96, 128, 232, 0.15)",
    color: "#7C94F2",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block",
    textTransform: "uppercase"
  },
  actionButtonGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: "6px",
    flexWrap: "nowrap"
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
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },
  convertBtn: {
    background: "#10b981",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },
  viewBtn: {
    background: "var(--bg-layout)",
    color: "var(--text-main)",
    border: "1px solid var(--border-main)",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },
  downloadPdfBtn: {
    background: "var(--bg-layout)",
    color: "var(--text-main)",
    border: "1px solid var(--border-main)",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
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
    whiteSpace: "nowrap",
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
    whiteSpace: "nowrap",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "var(--text-muted)",
  },
  createButton: {
    marginTop: "16px",
    background: "#6080E8",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px"
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "16px",
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