import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [billingOpen, setBillingOpen] = useState(location.pathname.startsWith("/billing"));

  // =====================================
  // RESPONSIVE
  // =====================================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =====================================
  // LOGOUT
  // =====================================
  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  // =====================================
  // ACTIVE ROUTE
  // =====================================
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const getLinkStyle = (path) => {
    const active = isActive(path);
    if (sidebarOpen) {
      return active ? styles.activeLinkOpen : styles.linkOpen;
    } else {
      return active ? styles.activeLinkClosed : styles.linkClosed;
    }
  };

  return (
    <div style={styles.layout}>
      {/* =====================================
          TOPBAR
      ===================================== */}
      <div style={styles.topbar}>
        {/* LEFT */}
        <div
          style={{
            ...styles.logoSection,
            width: sidebarOpen ? "250px" : "72px",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            ☰
          </button>

          {sidebarOpen && (
            <h2 style={styles.logoText}>My Flying Colours</h2>
          )}
        </div>

        {/* CENTER */}
        <div style={styles.artSection}>
          <div style={styles.abacusIcon}>
            <div style={styles.abacusWire}></div>
            <div style={styles.bead}></div>
            <div style={styles.bead}></div>
            <div style={{ ...styles.bead, bottom: '2px' }}></div>
          </div>
          
          <span style={styles.artText}>Mastering Calculations</span>
          
          <div style={styles.vedicSymbol}>
            <div style={styles.innerCircle}></div>
          </div>
        </div>
      </div>

      {/* =====================================
          BODY
      ===================================== */}
      <div style={styles.body}>
        {/* =====================================
            SIDEBAR
        ===================================== */}
        <div
          style={{
            ...styles.sidebar,
            width: sidebarOpen ? "250px" : "72px",
          }}
        >
          {/* SCROLLABLE MENU WRAPPER */}
          <div style={styles.menuScrollContainer}>
            <div style={styles.menu}>
              {/* DASHBOARD */}
              <Link to="/dashboard" style={getLinkStyle("/dashboard")}>
                <span style={styles.iconStyle}>📊</span>
                {sidebarOpen && "Dashboard"}
              </Link>

              {/* STAFF */}
              <Link to="/staff" style={getLinkStyle("/staff")}>
                <span style={styles.iconStyle}>👥</span>
                {sidebarOpen && "Staff"}
              </Link>

              {/* SCHOOLS */}
              <Link to="/schools" style={getLinkStyle("/schools")}>
                <span style={styles.iconStyle}>🏫</span>
                {sidebarOpen && "Schools"}
              </Link>

              {/* STUDENTS */}
              <Link to="/allstudents" style={getLinkStyle("/allstudents")}>
                <span style={styles.iconStyle}>🎓</span>
                {sidebarOpen && "Students"}
              </Link>

              {/* PROMOTIONS */}
              <Link to="/promotions" style={getLinkStyle("/promotions")}>
                <span style={styles.iconStyle}>📢</span>
                {sidebarOpen && "Promotions"}
              </Link>

              {/* COURSES */}
              <Link to="/courses" style={getLinkStyle("/courses")}>
                <span style={styles.iconStyle}>📚</span>
                {sidebarOpen && "Courses"}
              </Link>

              {/* PRODUCTS */}
              <Link to="/products" style={getLinkStyle("/products")}>
                <span style={styles.iconStyle}>📦</span>
                {sidebarOpen && "Products"}
              </Link>

              {/* INVENTORY */}
              <Link to="/inventory" style={getLinkStyle("/inventory")}>
                <span style={styles.iconStyle}>📋</span>
                {sidebarOpen && "Inventory"}
              </Link>

              {/* BILLING */}
              <div>
                <div
                  onClick={() => setBillingOpen(!billingOpen)}
                  style={
                    sidebarOpen 
                      ? (isActive("/billing") ? styles.activeLinkOpen : styles.linkOpen)
                      : (isActive("/billing") ? styles.activeLinkClosed : styles.linkClosed)
                  }
                >
                  <span style={styles.iconStyle}>💳</span>
                  {sidebarOpen && (
                    <>
                      <span>Billing</span>
                      <span style={{ marginLeft: "auto", fontSize: "11px" }}>
                        {billingOpen ? "▼" : "▶"}
                      </span>
                    </>
                  )}
                </div>

                {billingOpen && sidebarOpen && (
                  <Link
                    to="/billing"
                    style={{
                      ...styles.subLink,
                      background: location.pathname.startsWith("/billing") ? "#2b2b40" : "transparent"
                    }}
                  >
                    • Parent Purchase
                  </Link>
                )}
              </div>

              {/* REPORTS */}
              <Link to="/reports" style={getLinkStyle("/reports")}>
                <span style={styles.iconStyle}>📉</span>
                {sidebarOpen && "Reports"}
              </Link>
            </div>
          </div>

          {/* STATIC BASE LOGOUT BUTTON */}
          {sidebarOpen && (
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          )}
        </div>

        {/* PAGE CONTENT */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  subLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "10px 18px 10px 52px",
    borderRadius: "8px",
    fontSize: "14px", // 🌟 Increased slightly from 13.5px
    display: "block",
    marginTop: "4px",
    transition: "background 0.2s ease",
  },
  
  /* ARTWORK HEADERS */
  artSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: window.innerWidth <= 768 ? "8px" : "15px",
    opacity: 0.7,
    padding: "0 10px",
    overflow: "hidden",
  },
  artText: {
    fontSize: window.innerWidth <= 768 ? "0.75rem" : "0.85rem",
    fontWeight: "700",
    color: "#6080E8",
    textTransform: "uppercase",
    letterSpacing: window.innerWidth <= 768 ? "1px" : "2px",
    whiteSpace: "nowrap",
  },
  abacusIcon: {
    width: window.innerWidth <= 768 ? "10px" : "14px",
    height: window.innerWidth <= 768 ? "16px" : "22px",
    border: "2px solid #6080E8",
    borderRadius: "2px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    flexShrink: 0,
  },
  abacusWire: { position: "absolute", width: "2px", height: "100%", background: "#6080E8" },
  bead: { width: window.innerWidth <= 768 ? "5px" : "8px", height: window.innerWidth <= 768 ? "3px" : "4px", background: "#6080E8", borderRadius: "1px", zIndex: 1 },
  vedicSymbol: { width: window.innerWidth <= 768 ? "14px" : "20px", height: window.innerWidth <= 768 ? "14px" : "20px", border: "1px solid #6080E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)", flexShrink: 0 },
  innerCircle: { width: window.innerWidth <= 768 ? "6px" : "10px", height: window.innerWidth <= 768 ? "6px" : "10px", border: "1px solid #6080E8" },

  // =====================================
  // MASTER APPLICATION LAYOUT FRAME
  // =====================================
  layout: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "#f5f7fb",
    display: "flex",
    flexDirection: "column"
  },
  body: {
    display: "flex",
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  topbar: {
    height: window.innerWidth <= 768 ? "60px" : "72px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    position: "sticky",
    top: 0,
    zIndex: 999,
    flexShrink: 0,
  },
  logoSection: {
    height: "100%",
    background: "#1E1E2D",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0 20px",
    transition: "all 0.3s ease",
    overflow: "hidden",
    flexShrink: 0,
  },
  menuButton: { background: "transparent", border: "none", color: "#ffffff", fontSize: window.innerWidth <= 768 ? "22px" : "26px", cursor: "pointer", minWidth: "30px" },
  logoText: { color: "#ffffff", fontSize: "1.2rem", fontWeight: "750", letterSpacing: "0.5px", whiteSpace: "nowrap" },

  // =====================================
  // SIDEBAR CONFIGS
  // =====================================
  sidebar: {
    background: "#1E1E2D",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    height: "100%",
  },
  menuScrollContainer: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "20px 12px",
  },

  /* OPEN LINK SYSTEM */
  linkOpen: {
    color: "rgba(255,255,255,0.75)", textDecoration: "none", padding: "12px 16px", borderRadius: "10px",
    fontWeight: "500", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "flex-start", // 🌟 Increased to 15px
    gap: "14px", minHeight: "46px", transition: "all 0.2s ease", whiteSpace: "nowrap", cursor: "pointer"
  },
  activeLinkOpen: {
    background: "linear-gradient(135deg,#6080E8,#7C94F2)", color: "#ffffff", textDecoration: "none",
    padding: "12px 16px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", display: "flex", // 🌟 Increased to 15px
    alignItems: "center", justifyContent: "flex-start", gap: "14px", minHeight: "46px", whiteSpace: "nowrap",
    boxShadow: "0 6px 14px rgba(96,128,232,0.3)", cursor: "pointer"
  },

  /* CLOSED ICON PANEL LINK SYSTEM */
  linkClosed: {
    color: "rgba(255,255,255,0.75)", textDecoration: "none", padding: "12px 0", borderRadius: "10px",
    fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "46px",
    width: "46px", margin: "0 auto", transition: "all 0.2s ease", cursor: "pointer"
  },
  activeLinkClosed: {
    background: "linear-gradient(135deg,#6080E8,#7C94F2)", color: "#ffffff", textDecoration: "none",
    padding: "12px 0", borderRadius: "10px", fontWeight: "700", display: "flex", alignItems: "center",
    justifyContent: "center", minHeight: "46px", width: "46px", margin: "0 auto",
    boxShadow: "0 4px 12px rgba(96,128,232,0.35)", cursor: "pointer"
  },

  iconStyle: {
    fontSize: "18px", // 🌟 Increased slightly to match new font balance
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: "22px", textAlign: "center", flexShrink: 0
  },
  logout: {
    margin: "16px", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#ffffff",
    border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", fontWeight: "700",
    fontSize: "15px", flexShrink: 0 // 🌟 Increased to 15px
  },
  content: {
    flex: 1, overflowY: "auto", padding: "25px", background: "#f5f7fb", height: "100%"
  }
};