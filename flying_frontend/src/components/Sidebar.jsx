import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.layout}>
      {/* FULL WIDTH NAVBAR */}
      <div style={styles.topbar}>
        <div style={styles.logoSection}>
          <h2 style={styles.logoText}>My Flying Colours</h2>
        </div>

        {/* NEW: VEDIC MATH / ABACUS ART SECTION */}
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
        
        <div style={styles.adminSection}>
          <span style={styles.adminUser}>Admin User</span>
        </div>
      </div>

      <div style={styles.wrapper}>
        <div style={styles.sidebar}>
          <div style={styles.menu}>
            <Link to="/dashboard" style={isActive("/dashboard") ? styles.active : styles.link}>Dashboard </Link>
            <Link to="/staff"  style={isActive("/staff") ? styles.active : styles.link}> Staff</Link>
            
           <Link to="/schools" style={isActive("/schools") ? styles.active : styles.link} >  Schools </Link>
          <Link to="/allstudents" style={isActive("/allstudents")  ? styles.active  : styles.link }> Students</Link>
            <Link to="/courses" style={isActive("/courses") ? styles.active : styles.link} > Courses </Link>
            <Link to="/products" style={   isActive("/products")    ? styles.active   : styles.link  }> Products</Link>
            <Link to="/inventory" style={isActive("/inventory")     ? styles.active   : styles.link  }> Inventory</Link>
            <p style={styles.link}>Reports</p>

            <button onClick={handleLogout} style={styles.logout}>Logout</button>
          </div>
        </div>

        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
  },
  topbar: {
    height: "65px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)", 
    borderBottom: "1px solid #edf2f7",
    zIndex: 100,
  },
  logoSection: {
    width: "250px", 
    height: "100%",
    display: "flex",
    alignItems: "center",
    paddingLeft: "20px",
    background: "#1E1E2D", 
  },
  logoText: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "0.5px",
  },

  /* NEW ART STYLES */
  artSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    opacity: 0.6, // Keeps it subtle so it doesn't distract from data
  },
  artText: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#6080E8",
    textTransform: "uppercase",
    letterSpacing: "2px",
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
    justifyContent: "space-around"
  },
  abacusWire: {
    position: "absolute",
    width: "2px",
    height: "100%",
    background: "#6080E8",
  },
  bead: {
    width: "8px",
    height: "4px",
    background: "#6080E8",
    borderRadius: "1px",
    zIndex: 1,
  },
  vedicSymbol: {
    width: "20px",
    height: "20px",
    border: "1px solid #6080E8",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(45deg)"
  },
  innerCircle: {
    width: "10px",
    height: "10px",
    border: "1px solid #6080E8",
  },

  adminSection: {
    paddingRight: "30px",
    display: "flex",
    alignItems: "center",
  },
  adminUser: {
    fontWeight: "500",
    color: "#4A5568",
    fontSize: "0.95rem",
  },
  wrapper: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: "250px",
    background: "#1E1E2D",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 10px rgba(0,0,0,0.02)", 
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.7)",
    padding: "12px 15px",
    borderRadius: "8px",
    display: "block",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "0.2s ease",
  },
  active: {
    background: "#6080E8",
    padding: "12px 15px",
    borderRadius: "8px",
    color: "#fff",
    textDecoration: "none",
    display: "block",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  logout: {
    marginTop: "30px",
    padding: "12px",
    background: "#ef4444", 
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  content: {
    flex: 1,
    padding: "30px",
    background: "#F8FAFC",
    overflowY: "auto",
  },
};