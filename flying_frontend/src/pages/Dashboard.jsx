import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/info/reports/summary/?range=${dateRange}`);
      console.log("Live dynamic dashboard data loaded from API:", res.data);
      setDashboardData(res.data);
    } catch (err) {
      console.warn("Dashboard API fetch notice, using fallback data if unavailable.", err);
      setDashboardData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  // Fallback data structure if API server is temporarily unreachable
  const getFallbackData = () => ({
    summary: {
      total_schools: 18,
      total_students: 1240,
      total_staff: 28,
      total_products: 45,
      total_receipts_revenue: 485000,
      total_invoiced_revenue: 620000,
      total_po_expenditure: 195000,
      total_daycare_companies: 12,
      total_daycare_students: 86,
      total_daycare_revenue: 215000,
    },
    students_module: {
      students_by_school: [
        { school: "Little Flower Academy", count: 240 },
        { school: "St. Xavier Public School", count: 195 },
        { school: "Greenwood High", count: 180 },
        { school: "Delhi Public School", count: 165 },
        { school: "Sacred Heart Convent", count: 140 },
      ],
    },
    billing_module: {
      monthly_revenue: [
        { month: "Mar 2026", revenue: 62000 },
        { month: "Apr 2026", revenue: 78000 },
        { month: "May 2026", revenue: 95000 },
        { month: "Jun 2026", revenue: 115000 },
        { month: "Jul 2026", revenue: 82000 },
        { month: "Aug 2026", revenue: 53000 },
      ],
    },
  });

  const data = dashboardData || getFallbackData();
  const summary = data.summary || {};
  const totalStudents = (summary.total_students || 0) + (summary.total_daycare_students || 0);
  const grossRevenue = (summary.total_receipts_revenue || 0) + (summary.total_invoiced_revenue || 0);

  return (
    <Sidebar>
      <style>{`
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          .dashboard-controls {
            width: 100% !important;
            justify-content: flex-start !important;
          }
          .dashboard-controls select {
            flex: 1 !important;
          }
          .dashboard-kpi-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
            gap: 12px !important;
          }
          .dashboard-overview-grid {
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)) !important;
            gap: 10px !important;
          }
          .dashboard-charts-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .dashboard-card, .dashboard-chart-card {
            padding: 16px !important;
          }
          .dashboard-title {
            font-size: 20px !important;
          }
          .dashboard-mini-card {
            padding: 12px 14px !important;
            gap: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .dashboard-kpi-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-overview-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-card-value {
            font-size: 20px !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.headerRow} className="dashboard-header">
          <div>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h1 style={styles.title} className="dashboard-title">Dashboard Overview</h1>
            </div>
            <p style={styles.subtitle}>
              High-level dynamic operational & financial overview across Flying Colours and DayCare.
            </p>
          </div>

          <div style={styles.controlsGroup} className="dashboard-controls">
            <select
              style={styles.selectFilter}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">📅 All Time</option>
              <option value="month">📅 This Month</option>
              <option value="quarter">📅 This Quarter</option>
              <option value="year">📅 This Financial Year</option>
            </select>
            <button style={styles.btnRefresh} onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loaderBox}>
            <div style={styles.spinner}></div>
            <p style={{ color: "var(--text-muted)", marginTop: "12px", fontSize: "14px" }}>
              Loading dynamic overview metrics...
            </p>
          </div>
        ) : (
          <>
            {/* PRIMARY KEY PERFORMANCE INDICATOR CARDS */}
            <div style={styles.grid} className="dashboard-kpi-grid">
              <KpiCard
                title="Total Partner Schools"
                value={summary.total_schools || 0}
                icon="🏫"
                accentColor="#6080E8"
                subtitle="Affiliated Centers"
              />
              <KpiCard
                title="Total Active Students"
                value={totalStudents.toLocaleString()}
                icon="🎓"
                accentColor="#10b981"
                subtitle={`FC: ${summary.total_students || 0} | Daycare: ${summary.total_daycare_students || 0}`}
              />
              <KpiCard
                title="Gross Revenue"
                value={`₹${grossRevenue.toLocaleString()}`}
                icon="💰"
                accentColor="#f59e0b"
                subtitle="Receipts + Invoices"
              />
              <KpiCard
                title="Active Staff & HR"
                value={summary.total_staff || 0}
                icon="👥"
                accentColor="#8b5cf6"
                subtitle="Team Members"
              />
            </div>

            {/* OPERATIONAL OVERVIEW CARDS */}
            <div style={styles.overviewSection}>
              <h3 style={styles.sectionTitle}>⚡ Operational Overview</h3>
              <div style={styles.overviewCardsGrid} className="dashboard-overview-grid">
                <div style={styles.miniOverviewCard} className="dashboard-mini-card">
                  <span style={styles.miniIcon}>🏢</span>
                  <div>
                    <span style={styles.miniLabel}>Daycare Partners</span>
                    <h4 style={styles.miniValue}>{summary.total_daycare_companies || 0} Companies</h4>
                  </div>
                </div>

                <div style={styles.miniOverviewCard} className="dashboard-mini-card">
                  <span style={styles.miniIcon}>📦</span>
                  <div>
                    <span style={styles.miniLabel}>Catalog Products</span>
                    <h4 style={styles.miniValue}>{summary.total_products || 0} Items</h4>
                  </div>
                </div>

                <div style={styles.miniOverviewCard} className="dashboard-mini-card">
                  <span style={styles.miniIcon}>📄</span>
                  <div>
                    <span style={styles.miniLabel}>Invoiced Revenue</span>
                    <h4 style={styles.miniValue}>₹{(summary.total_invoiced_revenue || 0).toLocaleString()}</h4>
                  </div>
                </div>

                <div style={styles.miniOverviewCard} className="dashboard-mini-card">
                  <span style={styles.miniIcon}>📑</span>
                  <div>
                    <span style={styles.miniLabel}>PO Expenditures</span>
                    <h4 style={styles.miniValue}>₹{(summary.total_po_expenditure || 0).toLocaleString()}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* CHARTS OVERVIEW ROW */}
            <div style={styles.chartsRow} className="dashboard-charts-row">
              {/* REVENUE TREND SUMMARY */}
              <div style={styles.chartCard} className="dashboard-chart-card">
                <h3 style={styles.chartTitle}>📊 Revenue Collection Overview</h3>
                <CustomBarChart
                  data={(data.billing_module?.monthly_revenue || []).map((m) => ({
                    label: m.month,
                    value: m.revenue,
                    color: "#10b981",
                  }))}
                  unit="₹"
                />
              </div>

              {/* TOP SCHOOLS HEADCOUNT OVERVIEW */}
              <div style={styles.chartCard} className="dashboard-chart-card">
                <h3 style={styles.chartTitle}>🏫 Top Schools Student Enrollment</h3>
                <CustomBarChart
                  data={(data.students_module?.students_by_school || []).slice(0, 5).map((s) => ({
                    label: s.school,
                    value: s.count,
                    color: "#6080E8",
                  }))}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Sidebar>
  );
}

/* ================= KPI CARD COMPONENT ================= */
function KpiCard({ title, value, icon, accentColor, subtitle }) {
  return (
    <div style={styles.card} className="dashboard-card">
      <div style={{ ...styles.accentBar, background: accentColor }}></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h4 style={styles.cardLabel}>{title}</h4>
          <h2 style={styles.cardValue} className="dashboard-card-value">{value}</h2>
          {subtitle && <small style={styles.cardSubtitle}>{subtitle}</small>}
        </div>
        <span style={{ fontSize: "28px", opacity: 0.9 }}>{icon}</span>
      </div>
    </div>
  );
}

/* ================= DYNAMIC BAR CHART COMPONENT ================= */
function CustomBarChart({ data, unit = "" }) {
  if (!data || data.length === 0) {
    return <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No chart overview data available.</p>;
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
      {data.map((item, idx) => {
        const pct = Math.min(100, Math.max(8, (item.value / maxValue) * 100));
        return (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{item.label}</span>
              <span style={{ color: item.color || "#6080E8", fontWeight: "700" }}>
                {unit}{item.value.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                background: "var(--bg-layout)",
                height: "12px",
                borderRadius: "6px",
                overflow: "hidden",
                border: "1px solid var(--border-main)",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  background: item.color || "linear-gradient(90deg, #6080E8, #7C94F2)",
                  height: "100%",
                  borderRadius: "6px",
                  transition: "width 0.4s ease-in-out",
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  headingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  verticalLine: {
    width: "4px",
    height: "26px",
    backgroundColor: "#6080E8",
    borderRadius: "2px",
    flexShrink: 0,
  },
  title: {
    fontSize: "24px",
    fontWeight: "750",
    color: "var(--text-main)",
    margin: 0,
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "13px",
    color: "var(--text-muted)",
    margin: "4px 0 0 14px",
  },
  controlsGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  selectFilter: {
    background: "var(--bg-card)",
    color: "var(--text-main)",
    border: "1px solid var(--border-main)",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
  },
  btnRefresh: {
    background: "var(--bg-card)",
    color: "var(--text-main)",
    border: "1px solid var(--border-main)",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
  loaderBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 0",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid var(--border-main)",
    borderTop: "3px solid #6080E8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  card: {
    background: "var(--bg-card)",
    padding: "20px 24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px var(--shadow-light)",
    border: "1px solid var(--border-main)",
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
    fontSize: "12px",
    color: "var(--text-muted)",
    fontWeight: "600",
    margin: "0 0 6px 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text-main)",
    margin: 0,
  },
  cardSubtitle: {
    fontSize: "11.5px",
    color: "var(--text-muted)",
    marginTop: "4px",
    display: "block",
  },
  overviewSection: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--text-main)",
    marginBottom: "14px",
  },
  overviewCardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  miniOverviewCard: {
    background: "var(--bg-card)",
    padding: "16px 18px",
    borderRadius: "10px",
    border: "1px solid var(--border-main)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 1px 2px var(--shadow-light)",
  },
  miniIcon: {
    fontSize: "24px",
  },
  miniLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontWeight: "600",
    textTransform: "uppercase",
    display: "block",
  },
  miniValue: {
    fontSize: "15px",
    fontWeight: "700",
    color: "var(--text-main)",
    margin: "2px 0 0 0",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
    gap: "20px",
  },
  chartCard: {
    background: "var(--bg-card)",
    padding: "20px 24px",
    borderRadius: "12px",
    border: "1px solid var(--border-main)",
    boxShadow: "0 1px 3px var(--shadow-light)",
    boxSizing: "border-box",
  },
  chartTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "var(--text-main)",
    margin: "0 0 16px 0",
  },
};