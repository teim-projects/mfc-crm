import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function ReceiptDetail() {
  const { receiptId } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic state observer for granular viewport adjustments
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    fetchReceiptDetail();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [receiptId]);

  const fetchReceiptDetail = async () => {
    try {
      const res = await API.get(`/billing/receipts/${receiptId}/`);
      setReceipt(res.data);
    } catch (err) {
      console.error("Error fetching receipt:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${receipt.receipt_no}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .receipt-title { font-size: 28px; font-weight: bold; color: #6080E8; }
            .receipt-no { font-size: 16px; color: #666; margin-top: 5px; }
            .divider { border-top: 2px dashed #ccc; margin: 20px 0; }
            .info-section { margin-bottom: 20px; }
            .info-row { margin-bottom: 10px; }
            .info-label { font-weight: bold; min-width: 120px; display: inline-block; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total-section { margin-top: 20px; text-align: right; }
            .total-row { margin-bottom: 8px; }
            .grand-total { font-size: 20px; font-weight: bold; color: #6080E8; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
            @media print {
              .no-print { display: none; }
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="receipt-title">STUDENT RECEIPT</div>
            <div class="receipt-no">Receipt No: ${receipt.receipt_no}</div>
          </div>
          <div class="divider"></div>
          <div class="info-section">
            <div class="info-row"><span class="info-label">School:</span><span>${receipt.school_name}</span></div>
            <div class="info-row"><span class="info-label">Student:</span><span>${receipt.student_name}</span></div>
            <div class="info-row"><span class="info-label">Date:</span><span>${receipt.receipt_date}</span></div>
            ${receipt.remarks ? `<div class="info-row"><span class="info-label">Remarks:</span><span>${receipt.remarks}</span></div>` : ''}
          </div>
          <div class="divider"></div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${receipt.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}${item.unit ? ' ' + item.unit : ''}</td>
                  <td>₹${parseFloat(item.rate).toFixed(2)}</td>
                  <td>₹${parseFloat(item.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total-section">
            <div class="total-row"><strong>Subtotal:</strong> ₹${parseFloat(receipt.subtotal).toFixed(2)}</div>
            <div class="total-row"><strong>Discount:</strong> ₹${parseFloat(receipt.discount).toFixed(2)}</div>
            <div class="total-row grand-total"><strong>Grand Total:</strong> ₹${parseFloat(receipt.grand_total).toFixed(2)}</div>
          </div>
          <div class="divider"></div>
          <div class="footer">Thank you for your purchase!</div>
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">Print Receipt</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <Sidebar>
        <div style={styles.loading}>Loading receipt details...</div>
      </Sidebar>
    );
  }

  if (!receipt) {
    return (
      <Sidebar>
        <div style={styles.error}>Receipt not found</div>
      </Sidebar>
    );
  }

  const isMobile = windowWidth <= 640;

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER BLOCK CONTROLS */}
        <div style={{
          ...styles.header,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center"
        }}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>Receipt Details</h2>
            </div>
            <p style={styles.subtitle}>Receipt No: {receipt.receipt_no}</p>
          </div>
          
          <div style={{
            ...styles.buttonGroup,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto"
          }}>
            <button
              style={{ ...styles.printButton, width: isMobile ? "100%" : "auto" }}
              onClick={handlePrint}
            >
              🖨️ Print Receipt
            </button>
            <button
              style={{ ...styles.backButton, width: isMobile ? "100%" : "auto" }}
              onClick={() => navigate(`/billing/school/${receipt.school}/students`)}
            >
              ← Back to Students
            </button>
          </div>
        </div>

        {/* RECEIPT METRICS CARD LAYER */}
        <div style={styles.receiptCard}>
          <div style={{
            ...styles.receiptHeader,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "12px" : "16px"
          }}>
            <div style={styles.schoolInfo}>
              <h3 style={styles.schoolName}>{receipt.school_name}</h3>
            </div>
            <div style={styles.receiptBadge}>
              {receipt.receipt_no}
            </div>
          </div>

          <div style={{
            ...styles.infoGrid,
            gridTemplateColumns: windowWidth <= 480 ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))"
          }}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Student Name</div>
              <div style={styles.infoValue}>{receipt.student_name}</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>Receipt Date</div>
              <div style={styles.infoValue}>{receipt.receipt_date}</div>
            </div>
            {receipt.remarks && (
              <div style={{ ...styles.infoItem, gridColumn: windowWidth <= 480 ? "span 1" : "span 2" }}>
                <div style={styles.infoLabel}>Remarks</div>
                <div style={styles.infoValue}>{receipt.remarks}</div>
              </div>
            )}
          </div>

          {/* AUDITED LINE ITEMS TABLE */}
          <div style={styles.itemsSection}>
            <h4 style={styles.itemsTitle}>Items Purchased</h4>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: "50px" }}>#</th>
                    <th style={styles.th}>Product</th>
                    <th style={{ ...styles.th, width: "100px" }}>Quantity</th>
                    <th style={{ ...styles.th, width: "120px" }}>Rate (₹)</th>
                    <th style={{ ...styles.th, width: "140px" }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item, index) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>
                        <div style={styles.productName}>{item.product_name}</div>
                        {item.remarks && (
                          <div style={styles.itemRemarks}>{item.remarks}</div>
                        )}
                      </td>
                      <td style={{ ...styles.td, fontWeight: "500" }}>{item.quantity} {item.unit || "PCS"}</td>
                      <td style={styles.td}>₹{parseFloat(item.rate).toFixed(2)}</td>
                      <td style={{ ...styles.td, fontWeight: "600", color: "var(--text-main)" }}>₹{parseFloat(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NET CALCULATIONS DISPLAY SUMMARY */}
          <div style={{
            ...styles.summarySection,
            maxWidth: isMobile ? "100%" : "380px"
          }}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal:</span>
              <span style={styles.summaryValue}>₹{parseFloat(receipt.subtotal).toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Discount:</span>
              <span style={{ ...styles.summaryValue, color: "#10b981" }}>- ₹{parseFloat(receipt.discount).toFixed(2)}</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.grandTotalRow }}>
              <span style={styles.grandTotalLabel}>Grand Total:</span>
              <span style={styles.grandTotal}>₹{parseFloat(receipt.grand_total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

const styles = {
  container: { width: "100%", boxSizing: "border-box", padding: "4px" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "24px", gap: "16px" },
  titleSection: { display: "flex", flexDirection: "column", gap: "4px" },
  headingWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  verticalLine: { width: "4px", height: "24px", backgroundColor: "#6080E8", borderRadius: "2px", flexShrink: 0 },
  title: { fontSize: "22px", fontWeight: "700", color: "var(--text-main)", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0, paddingLeft: "14px" },
  buttonGroup: { display: "flex", gap: "10px", alignItems: "center" },
  printButton: { background: "#10b981", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", textAlign: "center", boxSizing: "border-box", boxShadow: "0 2px 4px rgba(16, 185, 129, 0.15)" },
  backButton: { background: "var(--bg-card)", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", textAlign: "center", boxSizing: "border-box" },
  receiptCard: { background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-main)", overflow: "hidden", boxShadow: "0 1px 3px var(--shadow-light)" },
  receiptHeader: { background: "rgba(96, 128, 232, 0.15)", borderBottom: "1px solid var(--border-main)", padding: "24px", color: "var(--text-main)", display: "flex", justifyContent: "space-between", boxSizing: "border-box" },
  schoolName: { fontSize: "20px", fontWeight: "700", color: "#6080E8", margin: 0 },
  receiptBadge: { background: "var(--bg-layout)", border: "1px solid var(--border-main)", color: "var(--text-main)", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", fontFamily: "monospace", letterSpacing: "0.02em" },
  infoGrid: { display: "grid", gap: "20px", padding: "24px", borderBottom: "1px solid var(--border-main)" },
  infoItem: { display: "flex", flexDirection: "column", gap: "4px" },
  infoLabel: { fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" },
  infoValue: { fontSize: "15px", fontWeight: "600", color: "var(--text-main)" },
  itemsSection: { padding: "24px" },
  itemsTitle: { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" },
  tableWrapper: { width: "100%", overflowX: "auto", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-main)", WebkitOverflowScrolling: "touch" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "650px" },
  th: { background: "var(--bg-table-th)", padding: "12px 14px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-main)", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid var(--border-light)" },
  td: { padding: "12px 14px", fontSize: "14px", color: "var(--text-td)", verticalAlign: "middle", whiteSpace: "nowrap" },
  productName: { fontWeight: "600", color: "var(--text-main)" },
  itemRemarks: { fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" },
  summarySection: { padding: "24px", borderTop: "1px solid var(--border-main)", background: "var(--bg-layout)", width: "100%", boxSizing: "border-box", marginLeft: "auto", display: "flex", flexDirection: "column", gap: "8px" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" },
  summaryValue: { fontSize: "13px", color: "var(--text-main)", fontWeight: "600" },
  grandTotalRow: { marginTop: "4px", paddingTop: "12px", borderTop: "1px dashed var(--border-main)" },
  grandTotalLabel: { fontSize: "14px", color: "var(--text-main)", fontWeight: "700" },
  grandTotal: { color: "#6080E8", fontSize: "18px", fontWeight: "700" },
  loading: { textAlign: "center", padding: "50px", fontSize: "16px", color: "var(--text-muted)" },
  error: { textAlign: "center", padding: "50px", fontSize: "16px", color: "#ef4444", fontWeight: "500" },
};