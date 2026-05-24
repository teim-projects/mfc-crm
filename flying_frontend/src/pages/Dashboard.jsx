import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER WITH PRO BAR DESIGN */}
        <div style={styles.header}>
          <div style={styles.headingWrapper}>
            <div style={styles.verticalLine}></div>
            <h2 style={styles.title}>Dashboard</h2>
          </div>
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
            <h3 style={styles.chartTitle}>Recent Activity Log</h3>
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
  container: {
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "24px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  card: {
    background: "#fff",
    padding: "20px 24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    border: "1px solid #e2e8f0",
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
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "600",
    margin: "0 0 6px 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardValue: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  chartsRow: {
    display: "grid",
    /* 🌟 Dynamic clamping ensures it scales seamlessly without hard logic scripts */
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
    gap: "20px",
  },
  chartCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    boxSizing: "border-box",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
  },
  barChartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "140px",
    padding: "0 4px",
  },
  bar: {
    width: "11%",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.3s ease",
  },
  chartLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px",
    fontSize: "12px",
    color: "#94a3b8",
    padding: "0 2px",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  activityItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  activityDot: {
    width: "8px",
    height: "8px",
    background: "#10b981",
    borderRadius: "50%",
    marginTop: "6px",
    flexShrink: 0,
  },
  activityText: {
    fontSize: "13.5px",
    color: "#334155",
    margin: 0,
    lineHeight: "1.4",
  },
  activityTime: {
    fontSize: "11px",
    color: "#94a3b8",
  },
};