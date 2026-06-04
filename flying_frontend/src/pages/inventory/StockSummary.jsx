import { useEffect, useState } from "react";
import API from "../../api";
import Pagination from "../../components/Pagination";
import AdvancedTableFilter from "../../components/AdvancedTableFilter";

export default function StockSummary() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Controls sliding sidebar drawer

  // Real-time layout breakpoint monitor
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    fetchStocks();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await API.get("/inventory/stock/");
      setStocks(res.data);
      setFilteredStocks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // PAGINATION
  // =====================================
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStocks = filteredStocks.slice(startIndex, startIndex + itemsPerPage);

  const isMobile = windowWidth <= 640;

  return (
    <div style={styles.container}>
      {/* HEADER SECTION WITH TOP CONTROLS */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center"
      }}>
        <div style={styles.titleSection}>
          <div style={styles.headingWrapper}>
            <div style={styles.verticalLine}></div>
            <h2 style={styles.title}>Stock Summary</h2>
          </div>
          <p style={styles.subtitle}>Monitor current warehouse quantities, rolling sales metrics, and item balances.</p>
        </div>

        <div style={{
          ...styles.buttonGroup,
          width: isMobile ? "100%" : "auto"
        }}>
          {/* COMPACT SIDEBAR OVERLAY TOGGLE */}
          <button 
            style={{ ...styles.secondaryButton, width: isMobile ? "100%" : "auto" }} 
            onClick={() => setIsFilterOpen(true)}
          >
            🔍 Filter
          </button>
        </div>
      </div>

      {/* DATA SUMMARY SCROLLER SHEET */}
      <div style={styles.tableWrapper}>
        {stocks.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Level</th>
                <th style={styles.th}>Inward</th>
                
                <th style={styles.th}>Outward</th>
                <th style={styles.th}>Damaged</th>
                <th style={styles.th}>Current</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStocks.map((stock) => (
                <tr key={stock.id} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                    {stock.product_name}
                  </td>
                  <td style={{ ...styles.td, fontFamily: "monospace", fontSize: "13px", color: "#475569" }}>
                    {stock.product_code || "—"}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>
                      {stock.product_type ? stock.product_type.toUpperCase() : "—"}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: "#475569" }}>
                    {stock.course_type === "vedic_maths" ? "Vedic Maths" : stock.course_type === "abacus" ? "Abacus" : stock.course_type || "—"}
                  </td>
                  <td style={{ ...styles.td, color: "#64748b", fontWeight: "500" }}>
                    {stock.course_level || "Common"}
                  </td>
                 <td style={styles.td}>{stock.inward_stock}</td>
                  <td style={styles.td}>{stock.outward_stock}</td>
                  <td style={{ ...styles.td, color: stock.damaged_stock > 0 ? "#ef4444" : "#334155" }}>
                    {stock.damaged_stock}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      color: stock.current_stock > 5 ? "#16a34a" : "#dc2626",
                      fontWeight: "600"
                    }}>
                      {stock.current_stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyState}>
            <p>No product tracking metrics matching current profile logs found.</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* FILTER RIGHT-SLIDE DRAWER & BACKDROP OVERLAY */}
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
            data={stocks}
            onFilter={setFilteredStocks}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </div>
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
  table: { width: "100%", borderCollapse: "collapse", minWidth: "850px" },
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
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 20px", fontSize: "14px", color: "#334155", whiteSpace: "nowrap", verticalAlign: "middle" },
  typeBadge: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block"
  },
  emptyState: { padding: "60px 20px", textAlign: "center", color: "#64748b" },

  /* SLIDING SIDEBAR DRAWER PANEL STYLES */
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