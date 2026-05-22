import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <Sidebar>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard</h2>
        <p style={styles.subtitle}>
          Welcome back! Here's what's happening today at Flying Colors Academy.
        </p>
      </div>

      {/* STATS GRID */}
      <div style={styles.grid}>
        {card("Total Schools", 24, "#6080E8")}
        {card("Total Students", 1248, "#10b981")}
        {card("Monthly Revenue", "₹67,000", "#f59e0b")}
        {card("Pending Payments", "₹12,500", "#ef4444")}
      </div>

      {/* CHARTS SECTION */}
      <div style={styles.chartsRow}>
        
        {/* DUMMY CHART 1: REVENUE */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Monthly Revenue Trend</h3>
          <div style={styles.barChartContainer}>
            <div style={{ ...styles.bar, height: "40%", background: "#E2E8F0" }}></div>
            <div style={{ ...styles.bar, height: "60%", background: "#E2E8F0" }}></div>
            <div style={{ ...styles.bar, height: "85%", background: "#6080E8" }}></div>
            <div style={{ ...styles.bar, height: "50%", background: "#E2E8F0" }}></div>
            <div style={{ ...styles.bar, height: "70%", background: "#E2E8F0" }}></div>
            <div style={{ ...styles.bar, height: "95%", background: "#6080E8" }}></div>
          </div>
          <div style={styles.chartLabels}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        {/* DUMMY CHART 2: ENROLLMENT */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Student Enrollment</h3>
          <div style={styles.activityList}>
            <div style={styles.activityItem}>
              <span style={styles.activityDot}></span>
              <div>
                <p style={styles.activityText}><strong>New Admission</strong> - Aryan Sharma</p>
                <small style={styles.activityTime}>2 mins ago</small>
              </div>
            </div>
            <div style={styles.activityItem}>
              <span style={{...styles.activityDot, background: "#f59e0b"}}></span>
              <div>
                <p style={styles.activityText}><strong>Payment Received</strong> - Little Flower School</p>
                <small style={styles.activityTime}>1 hour ago</small>
              </div>
            </div>
            <div style={styles.activityItem}>
              <span style={{...styles.activityDot, background: "#6080E8"}}></span>
              <div>
                <p style={styles.activityText}><strong>Staff Added</strong> - Ritesh Kumar</p>
                <small style={styles.activityTime}>3 hours ago</small>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Sidebar>
  );
}

function card(title, value, accentColor) {
  return (
    <div style={styles.card}>
      <div style={{...styles.accentBar, background: accentColor}}></div>
      <h4 style={styles.cardLabel}>{title}</h4>
      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1E1E2D",
    margin: "0 0 5px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#718096",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
    border: "1px solid #edf2f7",
    position: "relative",
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
  },
  cardLabel: {
    fontSize: "14px",
    color: "#718096",
    fontWeight: "500",
    margin: "0 0 10px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1E1E2D",
    margin: 0,
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
  },
  chartCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #edf2f7",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },
  chartTitle: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#1E1E2D",
    marginBottom: "20px",
  },
  barChartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "150px",
    padding: "0 10px",
  },
  bar: {
    width: "12%",
    borderRadius: "4px 4px 0 0",
    transition: "0.3s ease",
  },
  chartLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    fontSize: "12px",
    color: "#A0AEC0",
    padding: "0 5px",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  activityItem: {
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
  },
  activityDot: {
    width: "10px",
    height: "10px",
    background: "#10b981",
    borderRadius: "50%",
    marginTop: "6px",
    flexShrink: 0,
  },
  activityText: {
    fontSize: "14px",
    color: "#2D3748",
    margin: 0,
  },
  activityTime: {
    fontSize: "12px",
    color: "#A0AEC0",
  },
};