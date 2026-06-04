import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import CreateReceipt from "./CreateReceipt"; 
import AdvancedTableFilter from "../../components/AdvancedTableFilter"; 
import Pagination from "../../components/Pagination"; // Pagination Component

export default function SchoolStudents() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentReceipts, setStudentReceipts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  // Pagination State hooks linked to filter panel
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [receiptSearchTerm, setReceiptSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const [isCreateReceiptOpen, setIsCreateReceiptOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

 useEffect(() => {
  const initializeData = async () => {
    setLoading(true);
    await fetchSchoolDetails();
    // 🌟 Step 1: Fetch receipts FIRST so the mapping object exists before filtering students
    const receiptsMap = await fetchAllReceipts();
    // 🌟 Step 2: Pass that map directly to the student fetch pipeline
    await fetchStudents(receiptsMap);
  };

  initializeData();

  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, [schoolId]);

  // Reset page position to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredStudents]);

  const fetchSchoolDetails = async () => {
    try {
      const res = await API.get(`/info/schools/${schoolId}/`);
      setSchool(res.data);
    } catch (err) {
      console.error("Error fetching school:", err);
    }
  };

  const fetchStudents = async (receiptsMap) => {
  try {
    const res = await API.get(`/billing/students-by-school/${schoolId}/`);
    
    // 🌟 FILTER LOGIC: Only retain students who have at least one generated invoice receipt entry mapped
    const activeReceiptMap = receiptsMap || studentReceipts;
    const studentsWithReceipts = res.data.filter(student => 
      activeReceiptMap[student.id] && activeReceiptMap[student.id].length > 0
    );

    setStudents(studentsWithReceipts);
    setFilteredStudents(studentsWithReceipts);
  } catch (err) {
    console.error("Error fetching students:", err);
  } finally {
    setLoading(false);
  }
};

  const fetchAllReceipts = async () => {
  try {
    const res = await API.get("/billing/receipts/");
    const receiptsByStudent = {};
    
    res.data.forEach(receipt => {
      if (receipt.school === parseInt(schoolId)) {
        if (!receiptsByStudent[receipt.student]) {
          receiptsByStudent[receipt.student] = [];
        }
        receiptsByStudent[receipt.student].push(receipt);
      }
    });
    
    setStudentReceipts(receiptsByStudent);
    return receiptsByStudent; // 🌟 Added: Returns map for sequential data synchronizations
  } catch (err) {
    console.error("Error fetching receipts:", err);
    return {};
  }
};

  const handleViewReceipts = (student) => {
    setSelectedStudent(student);
    setReceiptSearchTerm(""); 
    setShowReceiptModal(true);
  };

  const handleOpenCreateModal = (studentId = null) => {
    setSelectedStudentId(studentId);
    setIsCreateReceiptOpen(true);
  };

  const handlePrintReceipt = (receipt) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${receipt.receipt_no}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .receipt-title { font-size: 24px; font-weight: bold; color: #6080E8; }
            .receipt-no { font-size: 16px; color: #666; margin-top: 5px; }
            .divider { border-top: 2px dashed #ccc; margin: 20px 0; }
            .info-section { margin-bottom: 20px; }
            .info-row { margin-bottom: 10px; }
            .info-label { font-weight: bold; min-width: 120px; display: inline-block; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total-section { margin-top: 20px; text-align: right; }
            .total-row { margin-bottom: 8px; }
            .grand-total { font-size: 18px; font-weight: bold; color: #6080E8; }
            @media print { button { display: none; } }
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
          </div>
          <table>
            <thead><tr><th>#</th><th>Product</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead>
            <tbody>
              ${receipt.items.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.product_name}</td>
                  <td>${item.quantity} ${item.unit || ''}</td>
                  <td>₹${item.rate}</td>
                  <td>₹${item.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total-section">
            <div class="total-row">Subtotal: ₹${receipt.subtotal}</div>
            <div class="total-row">Discount: ₹${receipt.discount}</div>
            <div class="total-row grand-total">Grand Total: ₹${receipt.grand_total}</div>
          </div>
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">Print</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getTotalSpent = (studentId) => {
    const receipts = studentReceipts[studentId] || [];
    return receipts.reduce((sum, r) => sum + parseFloat(r.grand_total), 0);
  };

  const getReceiptCount = (studentId) => {
    return (studentReceipts[studentId] || []).length;
  };

  const getFilteredReceipts = (studentId) => {
    const allReceipts = studentReceipts[studentId] || [];
    if (!receiptSearchTerm) return allReceipts;
    return allReceipts.filter(r => 
      r.receipt_no?.toLowerCase().includes(receiptSearchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <Sidebar>
        <div style={styles.loading}>Loading students...</div>
      </Sidebar>
    );
  }

  // =====================================
  // DYNAMIC PAGINATION ENGINE
  // =====================================
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const isMobile = windowWidth <= 640;

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={{
          ...styles.header,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center"
        }}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>School Students</h2>
            </div>
            <p style={styles.subtitle}>
              {school?.school_name || "School"} - Manage student receipts
            </p>
          </div>
          
          <div style={{
            ...styles.buttonGroup,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto"
          }}>
            <button
              style={{ ...styles.secondaryButton, width: isMobile ? "100%" : "auto" }}
              onClick={() => setIsFilterOpen(true)}
            >
              🔍 Filter
            </button>
            <button
              style={{ ...styles.secondaryButton, width: isMobile ? "100%" : "auto" }}
              onClick={() => navigate("/billing")}
            >
              ← Back to Schools
            </button>
            <button
              style={{ ...styles.primaryButton, width: isMobile ? "100%" : "auto" }}
              onClick={() => handleOpenCreateModal(null)}
            >
              + Create Receipt
            </button>
          </div>
        </div>

        {/* CARDS GRID */}
        <div style={{
          ...styles.studentsGrid,
          gridTemplateColumns: windowWidth <= 520 
            ? "1fr" 
            : windowWidth <= 950 
              ? "1fr 1fr" 
              : "1fr 1fr 1fr"
        }}>
          {/* FIXED: We map over paginatedStudents so row limits apply instantly */}
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student) => {
              const totalSpent = getTotalSpent(student.id);
              const receiptCount = getReceiptCount(student.id);
              
              return (
                <div key={student.id} style={styles.studentCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.studentAvatar}>
                      {student.student_name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.studentInfo}>
                      <h3 style={styles.studentName}>{student.student_name}</h3>
                      <p style={styles.parentName}>Parent: {student.parent_name || "—"}</p>
                      <p style={styles.contact}>Contact: {student.parent_contact || "—"}</p>
                    </div>
                  </div>
                  
                  <div style={styles.cardStats}>
                    <div style={styles.statItem}>
                      <div style={styles.statValue}>{receiptCount}</div>
                      <div style={styles.statLabel}>Receipts</div>
                    </div>
                    <div style={styles.statItem}>
                      <div style={styles.statValue}>₹{totalSpent.toFixed(2)}</div>
                      <div style={styles.statLabel}>Total Spent</div>
                    </div>
                  </div>
                  
                  <div style={{
                    ...styles.cardActions,
                    flexDirection: windowWidth <= 380 ? "column" : "row"
                  }}>
                    <button
                      style={styles.viewReceiptsBtn}
                      onClick={() => handleViewReceipts(student)}
                      disabled={receiptCount === 0}
                    >
                      📋 View Receipts ({receiptCount})
                    </button>
                    <button
                      style={styles.createReceiptBtn}
                      onClick={() => handleOpenCreateModal(student.id)}
                    >
                      + New Receipt
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ ...styles.emptyState, gridColumn: "1 / -1" }}>
              <p>No students found matching current filter parameters.</p>
              <p style={styles.emptyHint}>Update filters inside the options panel or add new students directly.</p>
            </div>
          )}
        </div>

        {/* INJECTED PAGINATION CONTROLS */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* VIEW RECEIPTS MODAL */}
        {showReceiptModal && selectedStudent && (
          <>
            <div style={styles.modalOverlay} onClick={() => setShowReceiptModal(false)} />
            <div style={{ 
              ...styles.modal, 
              width: isMobile ? "95%" : "90%"
            }}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>Receipts: {selectedStudent.student_name}</h3>
                  <p style={styles.modalSubtitle}>
                    Parent: {selectedStudent.parent_name} | Contact: {selectedStudent.parent_contact}
                  </p>
                </div>
                <button style={styles.modalClose} onClick={() => setShowReceiptModal(false)}>&times;</button>
              </div>

              <div style={styles.modalSearchArea}>
                <input 
                  type="text" 
                  placeholder="🔍 Search specific receipt number (e.g. REC-178...)"
                  value={receiptSearchTerm}
                  onChange={(e) => setReceiptSearchTerm(e.target.value)}
                  style={styles.modalSearchField}
                />
                {receiptSearchTerm && (
                  <button onClick={() => setReceiptSearchTerm("")} style={styles.modalClearBtn}>
                    Clear
                  </button>
                )}
              </div>
              
              <div style={styles.modalContent}>
                {getFilteredReceipts(selectedStudent.id).length > 0 ? (
                  <div style={styles.receiptsList}>
                    {getFilteredReceipts(selectedStudent.id)
                      .sort((a, b) => new Date(b.receipt_date) - new Date(a.receipt_date))
                      .map((receipt) => (
                        <div key={receipt.id} style={styles.receiptCard}>
                          <div style={{
                            ...styles.receiptHeader,
                            flexDirection: windowWidth <= 420 ? "column" : "row",
                            alignItems: windowWidth <= 420 ? "flex-start" : "center",
                            gap: "8px"
                          }}>
                            <div>
                              <div style={styles.receiptNo}>{receipt.receipt_no}</div>
                              <div style={styles.receiptDate}>{receipt.receipt_date}</div>
                            </div>
                            <div style={styles.receiptAmount}>
                              ₹{parseFloat(receipt.grand_total).toFixed(2)}
                            </div>
                          </div>
                          
                          <div style={{
                            ...styles.receiptItems,
                            flexDirection: windowWidth <= 480 ? "column" : "row",
                            alignItems: windowWidth <= 480 ? "stretch" : "center",
                            gap: "12px"
                          }}>
                            <div style={styles.itemsPreview}>
                              {receipt.items?.slice(0, 2).map((item, idx) => (
                                <span key={idx} style={styles.itemTag}>
                                  {item.product_name} ({item.quantity})
                                </span>
                              ))}
                              {receipt.items?.length > 2 && (
                                <span style={styles.moreTag}>+{receipt.items.length - 2} more</span>
                              )}
                            </div>
                            <div style={{
                              ...styles.receiptActions,
                              width: windowWidth <= 480 ? "100%" : "auto",
                              justifyContent: "flex-end"
                            }}>
                              <button
                                style={{ ...styles.viewReceiptDetailsBtn, flex: windowWidth <= 480 ? 1 : "initial" }}
                                onClick={() => {
                                  setShowReceiptModal(false);
                                  navigate(`/billing/receipt-detail/${receipt.id}`);
                                }}
                              >
                                Details
                              </button>
                              <button
                                style={{ ...styles.printReceiptBtn, flex: windowWidth <= 480 ? 1 : "initial" }}
                                onClick={() => handlePrintReceipt(receipt)}
                              >
                                Print
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div style={styles.noReceipts}>
                    <p>{receiptSearchTerm ? "No receipts match that code pattern filter." : "No receipts found for this student."}</p>
                    {!receiptSearchTerm && (
                      <button
                        style={styles.createFirstBtn}
                        onClick={() => {
                          setShowReceiptModal(false);
                          handleOpenCreateModal(selectedStudent.id);
                        }}
                      >
                        Create First Receipt
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* REUSABLE SIDE BAR DRAWER */}
        {isFilterOpen && (
          <div style={styles.drawerOverlay} onClick={() => setIsFilterOpen(false)} />
        )}
        <div style={{
          ...styles.drawer,
          width: isMobile ? "100%" : "360px",
          transform: isFilterOpen ? "translateX(0)" : "translateX(100%)",
        }}>
          <div style={styles.drawerHeader}>
            <h3 style={styles.drawerTitle}>Filters</h3>
            <button style={styles.closeButton} onClick={() => setIsFilterOpen(false)}>×</button>
          </div>
          <div style={styles.drawerContent}>
            <AdvancedTableFilter
              data={students}
              onFilter={setFilteredStudents}
              setItemsPerPage={setItemsPerPage} /* Fixed hook to listen to per-page dropdown select triggers */
            />
          </div>
        </div>

        {/* MODAL SYSTEM OVERLAY POPUP */}
        <CreateReceipt
          isOpen={isCreateReceiptOpen}
          schoolId={parseInt(schoolId)}
          studentId={selectedStudentId}
          onClose={() => setIsCreateReceiptOpen(false)}
          onSuccess={() => {
            setIsCreateReceiptOpen(false);
            fetchAllReceipts();
          }}
        />
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
  title: { fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "#64748b", margin: 0, paddingLeft: "14px" },
  buttonGroup: { display: "flex", gap: "10px", alignItems: "center" },
  primaryButton: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)", textAlign: "center", boxSizing: "border-box" },
  secondaryButton: { background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "10px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap", textAlign: "center", boxSizing: "border-box" },
  studentsGrid: { display: "grid", gap: "20px" },
  studentCard: { background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardHeader: { padding: "20px", display: "flex", gap: "16px", borderBottom: "1px solid #f1f5f9", flexGrow: 1 },
  studentAvatar: { width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, #6080E8 0%, #4a6ad8 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "20px", fontWeight: "600", flexShrink: 0 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: "16px", fontWeight: "600", color: "#1e293b", margin: "0 0 4px 0" },
  parentName: { fontSize: "13px", color: "#64748b", margin: "2px 0" },
  contact: { fontSize: "12px", color: "#94a3b8", margin: "2px 0" },
  cardStats: { display: "flex", padding: "16px 20px", gap: "20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" },
  statItem: { flex: 1, textAlign: "center" },
  statValue: { fontSize: "16px", fontWeight: "700", color: "#6080E8" },
  statLabel: { fontSize: "11px", color: "#64748b", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.02em" },
  cardActions: { display: "flex", gap: "10px", padding: "16px 20px" },
  viewReceiptsBtn: { flex: 1, padding: "10px 8px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600", boxSizing: "border-box" },
  createReceiptBtn: { flex: 1, padding: "10px 8px", background: "#6080E8", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600", boxSizing: "border-box", textAlign: "center" },
  emptyState: { textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" },
  emptyHint: { fontSize: "13px", color: "#94a3b8", marginTop: "8px" },
  loading: { textAlign: "center", padding: "50px", fontSize: "16px", color: "#64748b" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", zIndex: 999 },
  modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: "700px", background: "#fff", borderRadius: "16px", zIndex: 1000, display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", boxSizing: "border-box", maxHeight: "85vh" },
  modalHeader: { padding: "20px 20px 14px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  modalTitle: { fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 },
  modalSubtitle: { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" },
  modalClose: { background: "none", border: "none", fontSize: "28px", color: "#94a3b8", cursor: "pointer", lineHeight: "1" },
  modalContent: { flex: 1, overflowY: "auto", padding: "0 20px 20px 20px" },
  
  modalSearchArea: { padding: "12px 20px", display: "flex", gap: "10px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", alignItems: "center" },
  modalSearchField: { flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13.5px", outline: "none" },
  modalClearBtn: { background: "#fee2e2", color: "#dc2626", border: "none", padding: "8px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" },

  receiptsList: { display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" },
  receiptCard: { border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.01)" },
  receiptHeader: { display: "flex", justifyContent: "space-between" },
  receiptNo: { fontSize: "14px", fontWeight: "700", color: "#6080E8", fontFamily: "monospace" },
  receiptDate: { fontSize: "12px", color: "#64748b", marginTop: "2px" },
  receiptAmount: { fontSize: "18px", fontWeight: "700", color: "#0f172a" },
  receiptItems: { display: "flex", justifyContent: "space-between" },
  itemsPreview: { display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" },
  itemTag: { background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", color: "#475569", fontWeight: "500" },
  moreTag: { background: "#e2e8f0", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", color: "#64748b", fontWeight: "500" },
  receiptActions: { display: "flex", gap: "8px", alignItems: "center" },
  viewReceiptDetailsBtn: { padding: "6px 12px", background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", boxSizing: "border-box" },
  printReceiptBtn: { padding: "6px 12px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", boxSizing: "border-box" },
  noReceipts: { textAlign: "center", padding: "40px 20px", color: "#64748b" },
  createFirstBtn: { marginTop: "16px", padding: "10px 20px", background: "#6080E8", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },

  drawerOverlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 999 },
  drawer: { position: "fixed", top: 0, right: 0, height: "100vh", backgroundColor: "#fff", boxShadow: "-4px 0 15px rgba(0,0,0,0.1)", zIndex: 1000, transition: "transform 0.3s ease-in-out", display: "flex", flexDirection: "column", boxSizing: "border-box" },
  drawerHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", borderBottom: "1px solid #e2e8f0" },
  drawerTitle: { margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" },
  closeButton: { background: "none", border: "none", fontSize: "24px", color: "#64748b", cursor: "pointer", lineHeight: "1" },
  drawerContent: { padding: "20px", overflowY: "auto", flexGrow: 1 }
};