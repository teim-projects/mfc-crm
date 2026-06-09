import { useEffect, useState, useRef } from "react";
import API from "../../api";

export default function CreateReceipt({ isOpen, schoolId, studentId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );
  const [isNewStudent, setIsNewStudent] = useState(false);
  
  // Custom course sub-category filtering tab state
  const [productCourseType, setProductCourseType] = useState("all"); 

  // Secure DOM node reference to isolate search bounds and prevent modal click-leaks
  const searchContainerRef = useRef(null);

  const [formData, setFormData] = useState({
    school: "",
    student: "",
    student_name_input: "",
    parent_name: "",
    parent_contact_input: "",
    receipt_date: new Date().toISOString().split("T")[0],
    discount: 0,
    remarks: "",
    items: [],
  });

  const [currentItem, setCurrentItem] = useState({
    product: "",
    product_id: "",
    quantity: 1,
    rate: 0,
    available_stock: 0,
    unit: "PCS",
  });

  // Track viewport resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click-Away Listener to close search menu without affecting layout bubbling
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Reset form states cleanly when modal context updates
  useEffect(() => {
    if (isOpen) {
      fetchSchools();
      fetchProducts();
      
      setFormData({
        school: schoolId || "",
        student: studentId || "",
        student_name_input: "",
        parent_name: "",
        parent_contact_input: "",
        receipt_date: new Date().toISOString().split("T")[0],
        discount: 0,
        remarks: "",
        items: [],
      });
      setIsNewStudent(false);
      setSearchProduct("");
      setProductCourseType("all");
      setCurrentItem({
        product: "",
        product_id: "",
        quantity: 1,
        rate: 0,
        available_stock: 0,
        unit: "PCS",
      });
    }
  }, [isOpen, schoolId, studentId]);

  useEffect(() => {
    if (formData.school && !isNewStudent) {
      fetchStudentsBySchool(formData.school);
    } else {
      setStudents([]);
    }
  }, [formData.school, isNewStudent]);

  // Unified Product Filter Logic (handles both typing queries and course tab selection)
  useEffect(() => {
    let result = [...products];

    // 1. Filter by Course Category Tab if selected
    if (productCourseType !== "all") {
      result = result.filter(p => p.course_type === productCourseType);
    }

    // 2. Filter by typing search query input
    if (searchProduct) {
      result = result.filter(product =>
        product.product_name.toLowerCase().includes(searchProduct.toLowerCase()) ||
        product.product_code?.toLowerCase().includes(searchProduct.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [searchProduct, productCourseType, products]);

  const fetchSchools = async () => {
    try {
      const res = await API.get("/info/schools/");
      setSchools(res.data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const fetchStudentsBySchool = async (sId) => {
    try {
      const res = await API.get(`/billing/students-by-school/${sId}/`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/inventory/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchProductStock = async (productId) => {
    try {
      const res = await API.get("/inventory/stock/");
      const stockData = res.data.find(stock => stock.product === productId);
      return stockData ? stockData.current_stock : 0;
    } catch (err) {
      console.error("Error fetching stock:", err);
      return 0;
    }
  };

  const handleSchoolChange = (e) => {
    const sId = e.target.value ? parseInt(e.target.value) : "";
    setFormData(prev => ({ ...prev, school: sId, student: "", student_name_input: "", parent_name: "", parent_contact_input: "" }));
    setIsNewStudent(false);
  };

  const handleStudentTypeChange = (e) => {
    const value = e.target.value;
    setIsNewStudent(value === "new");
    if (value === "existing") {
      setFormData(prev => ({ ...prev, student_name_input: "", parent_name: "", parent_contact_input: "" }));
    }
  };

  const handleAddItem = async () => {
    if (!currentItem.product_id) {
      alert("Please select a product");
      return;
    }
    if (currentItem.quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }
    if (currentItem.quantity > currentItem.available_stock) {
      alert(`Only ${currentItem.available_stock} items available in stock`);
      return;
    }

    const selectedProduct = products.find(p => p.id === currentItem.product_id);
    const amount = currentItem.quantity * currentItem.rate;

    const newItem = {
      id: Date.now(),
      product: currentItem.product_id,
      product_name: selectedProduct.product_name,
      quantity: currentItem.quantity,
      rate: currentItem.rate,
      amount: amount,
      unit: currentItem.unit,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setCurrentItem({
      product: "",
      product_id: "",
      quantity: 1,
      rate: 0,
      available_stock: 0,
      unit: "PCS",
    });
    setSearchProduct("");
  };

  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const handleProductSelect = async (product) => {
    const stock = await fetchProductStock(product.id);
    setCurrentItem({
      product: product.product_name,
      product_id: product.id,
      quantity: 1,
      rate: parseFloat(product.unit_price),
      available_stock: stock,
      unit: "PCS",
    });
    setSearchProduct(product.product_name);
    setShowProductDropdown(false);
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = subtotal - parseFloat(formData.discount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.school) {
      alert("Please select a school");
      return;
    }
    if (!isNewStudent && !formData.student) {
      alert("Please select a student");
      return;
    }
    if (isNewStudent && !formData.student_name_input) {
      alert("Please enter student name");
      return;
    }
    if (formData.items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    let payload = {
      school: formData.school,
      receipt_date: formData.receipt_date,
      discount: parseFloat(formData.discount) || 0,
      remarks: formData.remarks,
      items: formData.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        rate: item.rate,
        unit: item.unit,
        remarks: "",
      })),
    };

    if (isNewStudent) {
      payload = {
        ...payload,
        student_name_input: formData.student_name_input,
        parent_name: formData.parent_name || "",
        parent_contact_input: formData.parent_contact_input || "",
      };
    } else {
      payload = {
        ...payload,
        student: formData.student,
      };
    }

    setLoading(true);
    try {
      await API.post("/billing/receipts/create/", payload);
      alert("Receipt created successfully! ✨");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating receipt:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Error creating receipt";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>Create Student Receipt</h2>
            <p style={styles.modalSubtitle}>Generate new receipt vouchers for student purchases.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* RECEIPT METRICS */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Receipt Information</h3>
            <div style={{
              ...styles.formGrid,
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
            }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>School *</label>
                <select style={styles.select} value={formData.school} onChange={handleSchoolChange} required>
                  <option value="">Select School</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.school_name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Student Type *</label>
                <select style={styles.select} value={isNewStudent ? "new" : "existing"} onChange={handleStudentTypeChange} disabled={!formData.school} required>
                  <option value="existing">Select Existing Student</option>
                  <option value="new">Create New Student</option>
                </select>
              </div>

              {!isNewStudent ? (
                <div style={{ ...styles.formGroup, gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label style={styles.label}>Select Student *</label>
                  <select
                    style={styles.select}
                    value={formData.student}
                    onChange={(e) => setFormData(prev => ({ ...prev, student: parseInt(e.target.value) }))}
                    disabled={!formData.school}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.student_name} - {student.parent_name} ({student.parent_contact})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>New Student Name *</label>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="Enter student name"
                      value={formData.student_name_input}
                      onChange={(e) => setFormData(prev => ({ ...prev, student_name_input: e.target.value }))}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Parent Name</label>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="Parent/Guardian name"
                      value={formData.parent_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, parent_name: e.target.value }))}
                    />
                  </div>

                  <div style={{ ...styles.formGroup, gridColumn: isMobile ? "span 1" : "span 2" }}>
                    <label style={styles.label}>Parent Contact</label>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="Parent contact number"
                      value={formData.parent_contact_input}
                      onChange={(e) => setFormData(prev => ({ ...prev, parent_contact_input: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Receipt Date *</label>
                <input type="date" style={styles.input} value={formData.receipt_date} onChange={(e) => setFormData(prev => ({ ...prev, receipt_date: e.target.value }))} required />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Discount (₹)</label>
                <input type="number" step="0.01" style={styles.input} value={formData.discount} onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* ADVANCED SMART SELECTION BUILDER BLOCK */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add Items</h3>
            <div style={styles.itemAddSection}>
              
              {/* Attached searchContainerRef to safely contain search focus clicks */}
              <div ref={searchContainerRef} style={styles.productSearchWrapper}>
                <div style={styles.searchBarLabelRow}>
                  <label style={styles.label}>Search Product Inventory *</label>
                  
                  {/* Category Fast Switcher Segments */}
                  <div style={styles.tabContainer}>
                    <button type="button" onClick={() => setProductCourseType("all")} style={productCourseType === "all" ? styles.activeTab : styles.tab}>All</button>
                    <button type="button" onClick={() => setProductCourseType("abacus")} style={productCourseType === "abacus" ? styles.activeTab : styles.tab}>Abacus</button>
                    <button type="button" onClick={() => setProductCourseType("vedic_maths")} style={productCourseType === "vedic_maths" ? styles.activeTab : styles.tab}>Vedic Maths</button>
                  </div>
                </div>

                <input
                  type="text"
                  style={styles.input}
                  placeholder={productCourseType === "all" ? "Search anything (e.g. bag, abacus kit, book...)" : `Search within ${productCourseType === "abacus" ? "Abacus" : "Vedic Maths"} inventory...`}
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  onFocus={() => setShowProductDropdown(true)}
                />
                
                {/* Search Dropdown Context List Overlay */}
                {showProductDropdown && (
                  <div style={styles.productDropdown}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <div
                          key={product.id}
                          style={styles.productDropdownItem}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div style={styles.productMetaLeft}>
                            <div style={styles.productName}>{product.product_name}</div>
                            <div style={styles.productSubtitleRow}>
                              <span style={styles.productCode}>{product.product_code || "No-Code"}</span>
                              <span style={styles.dropdownBadge}>
                                {product.course_type === "vedic_maths" ? "Vedic" : product.course_type === "abacus" ? "Abacus" : "General"}
                              </span>
                              {product.course_level && <span style={{...styles.dropdownBadge, background: "var(--bg-layout)", color: "var(--text-muted)"}}>Lvl {product.course_level}</span>}
                            </div>
                          </div>
                          <div style={styles.productPrice}>₹{Number(product.unit_price || 0).toFixed(2)}</div>
                        </div>
                      ))
                    ) : (
                      <div style={styles.dropdownEmptyState}>
                        No inventory matches found under the "{productCourseType.toUpperCase()}" tab.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sizing Quantities & Pricing Metrics */}
              <div style={{
                ...styles.itemRow,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr"
              }}>
                <div style={styles.itemField}>
                  <label style={styles.label}>Quantity</label>
                  <input type="number" style={styles.input} value={currentItem.quantity} onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))} min="1" />
                </div>

                <div style={styles.itemField}>
                  <label style={styles.label}>Rate (₹)</label>
                  <input type="number" step="0.01" style={styles.input} value={currentItem.rate} onChange={(e) => setCurrentItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))} />
                </div>

                <div style={styles.itemField}>
                  <label style={styles.label}>Available Stock</label>
                  <input type="text" style={{ ...styles.input, backgroundColor: "var(--bg-layout)", fontFamily: "monospace", fontWeight: "600" }} value={currentItem.product_id ? `${currentItem.available_stock} Units` : "—"} readOnly />
                </div>
              </div>

              <button type="button" style={{ ...styles.addButton, marginTop: "4px" }} onClick={handleAddItem}>
                + Add Selected Item
              </button>
            </div>

            {/* OUTLINED GRID SHEET */}
            {formData.items.length > 0 && (
              <div style={styles.itemsTableWrapper}>
                <table style={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>Product Specifications</th>
                      <th style={{ ...styles.tableTh, width: "75px", textAlign: "center" }}>Qty</th>
                      <th style={{ ...styles.tableTh, width: "100px" }}>Unit Rate</th>
                      <th style={{ ...styles.tableTh, width: "110px" }}>Net Total</th>
                      <th style={{ ...styles.tableTh, width: "55px", textAlign: "center" }}>Act</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map(item => (
                      <tr key={item.id} style={styles.tableTr}>
                        <td style={{ ...styles.tableTd, fontWeight: "600", color: "var(--text-main)" }}>{item.product_name}</td>
                        <td style={{ ...styles.tableTd, textAlign: "center", fontWeight: "700", color: "var(--text-muted)" }}>{item.quantity}</td>
                        <td style={styles.tableTd}>₹{item.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td style={{ ...styles.tableTd, fontWeight: "700", color: "var(--text-main)" }}>₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td style={{ ...styles.tableTd, textAlign: "center" }}>
                          <button type="button" style={styles.removeButton} onClick={() => handleRemoveItem(item.id)}>&times;</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* NET CALCULATIONS DISPLAY BLOCK */}
          <div style={styles.summaryBox}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal Gross:</span>
              <span style={styles.summaryVal}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Deducted Discount:</span>
              <span style={{ ...styles.summaryVal, color: "#ef4444" }}>- ₹{parseFloat(formData.discount || 0).toFixed(2)}</span>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: "1px dashed var(--border-main)", paddingTop: "8px", marginTop: "4px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)" }}>Grand Net Total:</span>
              <span style={{ fontSize: "16px", color: "#6080E8", fontWeight: "700" }}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* REMARKS EXTRAS */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Remarks / Documentation Notes</label>
            <textarea style={styles.textarea} rows="2" value={formData.remarks} onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))} placeholder="Additional notes..." />
          </div>

          {/* ACTION BUTTON RUNNERS */}
          <div style={{
            ...styles.footerActions,
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <button type="button" style={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? "Creating..." : "Create Receipt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "12px", boxSizing: "border-box" },
  modalCard: { background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", width: "100%", maxWidth: "740px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "24px 24px 0 24px", borderBottom: "1px solid var(--border-main)", paddingBottom: "16px", marginBottom: "8px" },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: 0 },
  modalSubtitle: { fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0" },
  closeX: { background: "none", border: "none", fontSize: "28px", color: "var(--text-muted)", cursor: "pointer", lineHeight: "1", padding: "0" },
  form: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" },
  section: { marginBottom: "4px" },
  sectionTitle: { fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px", paddingBottom: "6px", borderBottom: "1px solid var(--border-main)" },
  formGrid: { display: "grid", gap: "14px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" },
  input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", width: "100%", boxSizing: "border-box" },
  select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", width: "100%", boxSizing: "border-box", cursor: "pointer" },
  textarea: { padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", resize: "none", width: "100%", boxSizing: "border-box", color: "var(--text-main)", fontFamily: "inherit" },
  itemAddSection: { display: "flex", flexDirection: "column", gap: "14px", background: "var(--bg-layout)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" },
  productSearchWrapper: { position: "relative" },
  searchBarLabelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "10px", flexWrap: "wrap" },
  
  tabContainer: { display: "flex", gap: "4px", background: "var(--bg-surface)", padding: "3px", borderRadius: "6px", border: "1px solid var(--border-main)" },
  tab: { background: "transparent", border: "none", color: "var(--text-muted)", padding: "4px 10px", fontSize: "11px", fontWeight: "600", borderRadius: "4px", cursor: "pointer" },
  activeTab: { background: "var(--bg-card)", border: "none", color: "#6080E8", padding: "4px 10px", fontSize: "11px", fontWeight: "700", borderRadius: "4px", boxShadow: "0 1px 2px var(--shadow-light)", cursor: "default" },

  productDropdown: { position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: "8px", maxHeight: "180px", overflowY: "auto", zIndex: 2015, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)" },
  productDropdownItem: { padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" },
  productMetaLeft: { display: "flex", flexDirection: "column", gap: "2px" },
  productName: { fontWeight: "600", fontSize: "13.5px", color: "var(--text-main)" },
  productSubtitleRow: { display: "flex", gap: "6px", alignItems: "center" },
  productCode: { fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" },
  dropdownBadge: { fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", background: "rgba(96, 128, 232, 0.15)", color: "#7C94F2", textTransform: "uppercase" },
  productPrice: { fontSize: "13.5px", color: "#6080E8", fontWeight: "700" },
  dropdownEmptyState: { padding: "20px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center", background: "var(--bg-card)" },

  itemRow: { display: "grid", gap: "12px", alignItems: "end" },
  itemField: { display: "flex", flexDirection: "column", gap: "6px" },
  addButton: { background: "transparent", color: "#6080E8", border: "1px solid #6080E8", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", width: "100%", textAlign: "center", boxSizing: "border-box" },
  
  /* GRID LAYOUT DATA SHEET HEADERS AND LINES REINFORCEMENTS */
  itemsTableWrapper: { width: "100%", overflowX: "auto", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-main)", WebkitOverflowScrolling: "touch", marginTop: "4px" },
  itemsTable: { width: "100%", borderCollapse: "collapse", minWidth: "560px", textAlign: "left" },
  tableTh: { background: "var(--bg-table-th)", padding: "10px 14px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-main)", borderRight: "1px solid var(--border-main)" },
  tableTr: { borderBottom: "1px solid var(--border-main)" },
  tableTd: { padding: "10px 14px", fontSize: "13.5px", color: "var(--text-td)", verticalAlign: "middle", borderRight: "1px solid var(--border-light)" },
  removeButton: { background: "none", border: "none", color: "#ef4444", fontSize: "22px", cursor: "pointer", padding: "0 4px", lineHeight: "1" },
  
  summaryBox: { marginLeft: "auto", width: "100%", maxWidth: "260px", display: "flex", flexDirection: "column", gap: "6px", background: "var(--bg-layout)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-main)", boxSizing: "border-box" },
  summaryLabel: { fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" },
  summaryVal: { fontSize: "13px", color: "var(--text-main)", fontWeight: "600" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  footerActions: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingTop: "14px" },
  cancelButton: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  submitButton: { background: "#6080E8", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
};