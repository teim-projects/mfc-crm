import { useState } from "react";

import Sidebar from "../../components/Sidebar";

import Vendors from "./Vendors";
import PurchaseOrders from "./PurchaseOrders";
import GRN from "./GRN";

export default function Inventory() {

  const [activeTab, setActiveTab] =
    useState("vendor");

  return (

    <Sidebar>

      {/* TOP TABS */}

      <div style={styles.tabContainer}>

        <button
          style={
            activeTab === "vendor"
              ? styles.activeTab
              : styles.tab
          }
          onClick={() =>
            setActiveTab("vendor")
          }
        >
          Vendor
        </button>

        <button
          style={
            activeTab === "po"
              ? styles.activeTab
              : styles.tab
          }
          onClick={() =>
            setActiveTab("po")
          }
        >
          Purchase Order
        </button>

        <button
          style={
            activeTab === "grn"
              ? styles.activeTab
              : styles.tab
          }
          onClick={() =>
            setActiveTab("grn")
          }
        >
          GRN
        </button>

      </div>

      {/* CONTENT */}

      {activeTab === "vendor" &&
        <Vendors />
      }

      {activeTab === "po" &&
        <PurchaseOrders />
      }

      {activeTab === "grn" &&
        <GRN />
      }

    </Sidebar>
  );
}

const styles = {

  tabContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },

  tab: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "8px",
    background: "#e2e8f0",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  activeTab: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
};