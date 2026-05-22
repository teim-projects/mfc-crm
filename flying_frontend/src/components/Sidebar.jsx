import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useState,
  useEffect
} from "react";

export default function Sidebar({
  children
}) {

  const navigate = useNavigate();

  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(
      window.innerWidth > 768
    );

  // =====================================
  // RESPONSIVE
  // =====================================

  useEffect(() => {

    const handleResize = () => {

      if (
        window.innerWidth <= 768
      ) {

        setSidebarOpen(false);

      } else {

        setSidebarOpen(true);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.removeItem(
      "access"
    );

    navigate("/");
  };

  // =====================================
  // ACTIVE ROUTE
  // =====================================

  const isActive = (path) => {

    return location.pathname.startsWith(
      path
    );
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

            width: sidebarOpen
              ? "250px"
              : "72px",
          }}
        >

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            style={styles.menuButton}
          >
            ☰
          </button>

          {sidebarOpen && (

            <h2 style={styles.logoText}>
              My Flying Colours
            </h2>

          )}

        </div>

        {/* CENTER */}

        <div style={styles.artSection}>
          {/* Simple Abacus Icon Design */}
          <div style={styles.abacusIcon}>
            <div style={styles.abacusWire}></div>
            <div style={styles.bead}></div>
            <div style={styles.bead}></div>
            <div style={{...styles.bead, bottom: '2px'}}></div>
          </div>
          
          <span style={styles.artText}>Mastering Calculations</span>
          
          {/* Decorative Geometric Symbol */}
          <div style={styles.vedicSymbol}>
            <div style={styles.innerCircle}></div>
          </div>
        </div>

        {/* RIGHT */}

        {/* <div style={styles.userSection}>

          <span style={styles.userText}>
            Admin User
          </span>

        </div> */}

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

            width: sidebarOpen
              ? "250px"
              : "72px",
          }}
        >

          <div style={styles.menu}>

            {/* DASHBOARD */}

            <Link
              to="/dashboard"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/dashboard"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Dashboard"}
            </Link>

            {/* STAFF */}

            <Link
              to="/staff"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/staff"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Staff"}
            </Link>

            {/* SCHOOLS */}

            <Link
              to="/schools"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/schools"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Schools"}
            </Link>

            {/* STUDENTS */}

            <Link
              to="/allstudents"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/allstudents"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Students"}
            </Link>

            {/* COURSES */}

            <Link
              to="/courses"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/courses"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Courses"}
            </Link>

            {/* PRODUCTS */}

            <Link
              to="/products"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/products"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Products"}
            </Link>

            {/* INVENTORY */}

            <Link
              to="/inventory"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/inventory"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Inventory"}
            </Link>

            {/* REPORTS */}

            <Link
              to="/reports"
              style={
                sidebarOpen
                  ? (
                      isActive(
                        "/reports"
                      )
                        ? styles.activeLink
                        : styles.link
                    )
                  : styles.link
              }
            >
              {sidebarOpen &&
                "Reports"}
            </Link>

          </div>

          {/* =====================================
              LOGOUT
          ===================================== */}

          {sidebarOpen && (

            <button
              onClick={
                handleLogout
              }
              style={styles.logout}
            >
              Logout
            </button>

          )}

        </div>

        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <div style={styles.content}>

          {children}

        </div>

      </div>

    </div>
  );
}

const styles = {

  /* NEW ART STYLES */
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
  fontSize: window.innerWidth <= 768 ? "0.55rem" : "0.85rem",
  fontWeight: "600",
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

abacusWire: {
  position: "absolute",
  width: "2px",
  height: "100%",
  background: "#6080E8",
},

bead: {
  width: window.innerWidth <= 768 ? "5px" : "8px",
  height: window.innerWidth <= 768 ? "3px" : "4px",
  background: "#6080E8",
  borderRadius: "1px",
  zIndex: 1,
},

vedicSymbol: {
  width: window.innerWidth <= 768 ? "14px" : "20px",
  height: window.innerWidth <= 768 ? "14px" : "20px",
  border: "1px solid #6080E8",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "rotate(45deg)",
  flexShrink: 0,
},

innerCircle: {
  width: window.innerWidth <= 768 ? "6px" : "10px",
  height: window.innerWidth <= 768 ? "6px" : "10px",
  border: "1px solid #6080E8",
},

  // =====================================
  // LAYOUT
  // =====================================

  layout: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    background: "#f5f7fb",
  },

  body: {
    display: "flex",
    height:
      "calc(100vh - 72px)",
  },

  // =====================================
  // TOPBAR
  // =====================================

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
},

  logoSection: {
    height: "100%",
    background: "#1E1E2D",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0 20px",
    transition:
      "all 0.3s ease",
    overflow: "hidden",
    flexShrink: 0,
  },

 menuButton: {
  background: "transparent",
  border: "none",
  color: "#ffffff",
  fontSize: window.innerWidth <= 768 ? "22px" : "26px",
  cursor: "pointer",
  minWidth: "30px",
},

  logoText: {
  color: "#ffffff",
  fontSize: "1.2rem",
  fontWeight: "750",
  letterSpacing: "0.5px",
  whiteSpace: "nowrap",
},

  centerSection: {
    flex: 1,
    display: "flex",
    justifyContent:
      "center",
  },

  centerText: {
    color: "#8b9df5",
    fontWeight: "700",
    letterSpacing: "2px",
    fontSize: "0.9rem",
  },

  userSection: {
    paddingRight: "25px",
  },

  userText: {
    color: "#4b5563",
    fontWeight: "600",
  },

  // =====================================
  // SIDEBAR
  // =====================================

  sidebar: {
    background: "#1E1E2D",
    transition:
      "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent:
      "space-between",
    overflow: "hidden",
    borderRight:
      "1px solid rgba(255,255,255,0.05)",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px 15px",
  },

  link: {
    color:
      "rgba(255,255,255,0.75)",

    textDecoration: "none",

    padding: "14px 18px",

    borderRadius: "12px",

    fontWeight: "500",

    display: "flex",

    alignItems: "center",

    minHeight: "50px",

    transition:
      "all 0.2s ease",

    whiteSpace: "nowrap",
  },

  activeLink: {
    background:
      "linear-gradient(135deg,#6080E8,#7C94F2)",

    color: "#ffffff",

    textDecoration: "none",

    padding: "14px 18px",

    borderRadius: "12px",

    fontWeight: "700",

    display: "flex",

    alignItems: "center",

    minHeight: "50px",

    whiteSpace: "nowrap",

    boxShadow:
      "0 8px 18px rgba(96,128,232,0.35)",
  },

  logout: {
    margin: "20px",
    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "#ffffff",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },

  // =====================================
  // CONTENT
  // =====================================

  content: {
    flex: 1,
    overflowY: "auto",
    padding: "25px",
    background: "#f5f7fb",
  },
};