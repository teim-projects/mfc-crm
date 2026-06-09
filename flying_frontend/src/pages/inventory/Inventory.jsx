import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Vendors from "./Vendors";
import PurchaseOrders from "./PurchaseOrders";
import GRN from "./GRN";
import StockSummary from "./StockSummary";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("vendor");

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* TOP SEGMENTED CONTROLS / TABS */}
        <div style={styles.tabContainer}>
          <button
            style={activeTab === "vendor" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("vendor")}
          >
            Vendors
          </button>

          <button
            style={activeTab === "po" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("po")}
          >
            Purchase Orders
          </button>

          <button
            style={activeTab === "grn" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("grn")}
          >
            GRN Slips
          </button>

          <button
            style={activeTab === "stock" ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab("stock")}
          >
            Stock Summary
          </button>
        </div>

        {/* COMPONENT CONTENT VIEWS */}
        <div style={styles.contentArea}>
          {activeTab === "vendor" && <Vendors />}
          {activeTab === "po" && <PurchaseOrders />}
          {activeTab === "grn" && <GRN />}
          {activeTab === "stock" && (<StockSummary />)}
        </div>
      </div>
    </Sidebar>
  );
}

const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
  },
  tabContainer: {
    display: "inline-flex",
    background: "var(--border-main)", // 👈 Dynamic Variable (Flips dark container background lines automatically)
    padding: "4px",
    borderRadius: "8px",
    marginBottom: "24px",
    gap: "4px",
    maxWidth: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  tab: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    color: "var(--text-muted)", // 👈 Dynamic Variable
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
  },
  activeTab: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    background: "var(--bg-surface)", // 👈 Dynamic Variable (Creates matching card panels surfaces backdrop in light/dark mode)
    color: "#6080E8", // Accent text color retained
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    whiteSpace: "nowrap",
    boxShadow: "0 1px 3px var(--shadow-light)", // 👈 Dynamic Variable
    transition: "all 0.2s ease",
  },
  contentArea: {
    width: "100%",
  },
};