import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "/src/context/ThemeContext";

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); 

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [sidebarOpen, setSidebarOpen] = useState(windowWidth > 768);
  const [billingOpen, setBillingOpen] = useState(
    location.pathname.startsWith("/billing") || location.pathname.startsWith("/invoicing")
  );

  // Global App Mode ('flying-colours' or 'daycare')
  const [appMode, setAppMode] = useState(() => {
    const daycarePaths = ["/membership-plans", "/daycare-students", "/companies"];
    return daycarePaths.some(path => window.location.pathname.startsWith(path)) 
      ? "daycare" 
      : "flying-colours";
  });

  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const getLinkStyle = (path) => {
    const active = isActive(path);
    if (sidebarOpen) {
      return active ? styles.activeLinkOpen : styles.linkOpen;
    } else {
      return active ? styles.activeLinkClosed : styles.linkClosed;
    }
  };

  const isMobile = windowWidth <= 768;

  const currentBranding = {
    "flying-colours": {
      title: "My Flying Colours",
      tagline: "Mastering Calculations",
      icon: "🎨"
    },
    "daycare": {
      title: "DayCare",
      tagline: "Nurturing Growth",
      icon: "🧸"
    }
  }[appMode];

  return (
    <div style={styles.layout}>
      {/* =====================================
          TOPBAR WITH DROPDOWN SWITCHER
      ===================================== */}
      <div style={styles.topbar}>
        {/* LEFT BRANDING & SELECTION DROPDOWN */}
        <div
          style={{
            ...styles.logoSection,
            width: sidebarOpen ? "250px" : "72px",
            position: "relative",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            ☰
          </button>

          {sidebarOpen && (
            <div 
              style={styles.dropdownTrigger}
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
            >
              <h2 style={styles.logoText}>
                {currentBranding.title} <span style={{ fontSize: "10px", marginLeft: "4px" }}>▼</span>
              </h2>

              {/* FLOATING NAVBAR DROPDOWN CONTEXT MENU */}
              {navDropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <div 
                    style={{
                      ...styles.dropdownItem,
                      background: appMode === "flying-colours" ? "rgba(96,128,232,0.15)" : "transparent",
                      color: appMode === "flying-colours" ? "#6080E8" : "#ffffff"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAppMode("flying-colours");
                      setNavDropdownOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    <span>🎨</span> My Flying Colours
                  </div>
                  <div 
                    style={{
                      ...styles.dropdownItem,
                      background: appMode === "daycare" ? "rgba(96,128,232,0.15)" : "transparent",
                      color: appMode === "daycare" ? "#6080E8" : "#ffffff"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAppMode("daycare");
                      setNavDropdownOpen(false);
                      navigate("/companies"); // Changed default landing to companies
                    }}
                  >
                    <span>🧸</span> DayCare
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CENTER BRANDING SECTION */}
        <div style={{
          ...styles.artSection,
          display: isMobile ? "none" : "flex"
        }}>
          {appMode === "flying-colours" ? (
            <div style={styles.abacusIcon}>
              <div style={styles.abacusWire}></div>
              <div style={styles.bead}></div>
              <div style={styles.bead}></div>
              <div style={{ ...styles.bead, bottom: '2px' }}></div>
            </div>
          ) : (
            <span style={{ fontSize: "18px" }}>🧸</span>
          )}
          
          <span style={styles.artText}>{currentBranding.tagline}</span>
          
          <div style={styles.vedicSymbol}>
            <div style={styles.innerCircle}></div>
          </div>
        </div>

        {/* RIGHT - THEME TOGGLE SWITCH */}
        <div style={{ paddingRight: "20px" }}>
          <button onClick={toggleTheme} style={styles.themeToggleBtn}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* =====================================
          BODY WITH SEPARATED SIDEBAR VIEWPORT
      ===================================== */}
      <div style={styles.body}>
        {/* SIDEBAR */}
        <div
          style={{
            ...styles.sidebar,
            width: sidebarOpen ? "250px" : "72px",
          }}
        >
          {/* SCROLLABLE ROUTE ACTIONS */}
          <div style={styles.menuScrollContainer}>
            <div style={styles.menu}>

              {/* =====================================
                  CONDITIONALLY RENDERED SIDEBAR VIEWPORTS
              ===================================== */}
              {appMode === "flying-colours" ? (
                <>
                  <Link to="/dashboard" style={getLinkStyle("/dashboard")}>
                    <span style={styles.iconStyle}>📊</span>
                    {sidebarOpen && "Dashboard"}
                  </Link>

                  <Link to="/staff" style={getLinkStyle("/staff")}>
                    <span style={styles.iconStyle}>👥</span>
                    {sidebarOpen && "Staff"}
                  </Link>

                  <Link to="/schools" style={getLinkStyle("/schools")}>
                    <span style={styles.iconStyle}>🏫</span>
                    {sidebarOpen && "Schools"}
                  </Link>

                  <Link to="/allstudents" style={getLinkStyle("/allstudents")}>
                    <span style={styles.iconStyle}>🎓</span>
                    {sidebarOpen && "Students"}
                  </Link>

                  <Link to="/promotions" style={getLinkStyle("/promotions")}>
                    <span style={styles.iconStyle}>📢</span>
                    {sidebarOpen && "Promote"}
                  </Link>

                  <Link to="/courses" style={getLinkStyle("/courses")}>
                    <span style={styles.iconStyle}>📚</span>
                    {sidebarOpen && "Courses"}
                  </Link>

                  <Link to="/products" style={getLinkStyle("/products")}>
                    <span style={styles.iconStyle}>📦</span>
                    {sidebarOpen && "Products"}
                  </Link>

                  <Link to="/inventory" style={getLinkStyle("/inventory")}>
                    <span style={styles.iconStyle}>📋</span>
                    {sidebarOpen && "Inventory"}
                  </Link>

                  <div>
                    <div
                      onClick={() => setBillingOpen(!billingOpen)}
                      style={
                        sidebarOpen 
                          ? (isActive("/billing") || isActive("/invoicing") ? styles.activeLinkOpen : styles.linkOpen)
                          : (isActive("/billing") || isActive("/invoicing") ? styles.activeLinkClosed : styles.linkClosed)
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
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
                        <Link
                          to="/billing"
                          style={{
                            ...styles.subLink,
                            background: location.pathname === "/billing" ? "#2b2b40" : "transparent"
                          }}
                        >
                          • Parent Purchase
                        </Link>

                        <Link
                          to="/invoicing"
                          style={{
                            ...styles.subLink,
                            background: location.pathname.startsWith("/invoicing") ? "#2b2b40" : "transparent"
                          }}
                        >
                          • Invoicing
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link to="/reports" style={getLinkStyle("/reports")}>
                    <span style={styles.iconStyle}>📉</span>
                    {sidebarOpen && "Reports"}
                  </Link>
                </>
              ) : (
                <>
                  {/* DAYCARE MODULE FIELDS (Membership comment out, Companies first, then D-Students) */}
                  {/* 
                  <Link to="/membership-plans" style={getLinkStyle("/membership-plans")}>
                    <span style={styles.iconStyle}>🍼</span>
                    {sidebarOpen && "Membership Plans"}
                  </Link> 
                  */}

                  <Link to="/companies" style={getLinkStyle("/companies")}>
                    <span style={styles.iconStyle}>🏢</span>
                    {sidebarOpen && "Companies"}
                  </Link>

                  <Link to="/daycare-students" style={getLinkStyle("/daycare-students")}>
                    <span style={styles.iconStyle}>👶</span>
                    {sidebarOpen && "D-Students"}
                  </Link>
                </>
              )}

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
  dropdownTrigger: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    height: "100%",
    userSelect: "none"
  },
  dropdownMenu: {
    position: "absolute",
    top: "64px",
    left: "15px",
    background: "#1E1E2D",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    width: "220px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    zIndex: 1000,
    overflow: "hidden",
    padding: "6px 0"
  },
  dropdownItem: {
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "background 0.2s ease, color 0.2s ease",
    cursor: "pointer"
  },
  subLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "10px 18px 10px 52px",
    borderRadius: "8px",
    fontSize: "14px",
    display: "block",
    transition: "background 0.2s ease",
  },
  themeToggleBtn: {
    background: "var(--bg-layout)",
    color: "var(--text-main)",
    border: "1px solid var(--border-main)",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease"
  },
  artSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    opacity: 0.7,
    padding: "0 10px",
    overflow: "hidden",
  },
  artText: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#6080E8",
    textTransform: "uppercase",
    letterSpacing: "2px",
    whiteSpace: "nowrap",
  },
  abacusIcon: {
    width: "14px",
    height: "22px",
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
  bead: { width: "8px", height: "4px", background: "#6080E8", borderRadius: "1px", zIndex: 1 },
  vedicSymbol: { width: "20px", height: "20px", border: "1px solid #6080E8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(45deg)", flexShrink: 0 },
  innerCircle: { width: "10px", height: "10px", border: "1px solid #6080E8" },

  layout: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "var(--bg-layout)", 
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
    height: "72px",
    background: "var(--bg-surface)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid var(--border-main)", 
    boxShadow: "0 2px 12px var(--shadow-light)", 
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
    overflow: "visible", 
    flexShrink: 0,
  },
  menuButton: { background: "transparent", border: "none", color: "#ffffff", fontSize: "26px", cursor: "pointer", minWidth: "30px" },
  logoText: { color: "#ffffff", fontSize: "1.15rem", fontWeight: "750", letterSpacing: "0.5px", whiteSpace: "nowrap", display: "flex", alignItems: "center" },

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
    padding: "10px 12px 20px 12px", // Tightened the top padding to pull items upward cleanly
  },
  linkOpen: {
    color: "rgba(255,255,255,0.75)", textDecoration: "none", padding: "12px 16px", borderRadius: "10px",
    fontWeight: "500", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "flex-start",
    gap: "14px", minHeight: "46px", transition: "all 0.2s ease", whiteSpace: "nowrap", cursor: "pointer"
  },
  activeLinkOpen: {
    background: "linear-gradient(135deg,#6080E8,#7C94F2)", color: "#ffffff", textDecoration: "none",
    padding: "12px 16px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", display: "flex",
    alignItems: "center", justifyContent: "flex-start", gap: "14px", minHeight: "46px", whiteSpace: "nowrap",
    boxShadow: "0 6px 14px rgba(96,128,232,0.3)", cursor: "pointer"
  },
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
    fontSize: "18px", display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: "22px", textAlign: "center", flexShrink: 0
  },
  logout: {
    margin: "16px", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#ffffff",
    border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", fontWeight: "700",
    fontSize: "15px", flexShrink: 0
  },
  content: {
    flex: 1, overflowY: "auto", padding: "25px", background: "var(--bg-layout)", height: "100%"
  }
};