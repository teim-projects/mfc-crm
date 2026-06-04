import { useEffect, useState } from "react";
import API from "../../api";

export default function CreateReceipt({ isOpen, schoolId, studentId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [isNewStudent, setIsNewStudent] = useState(false);

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

  useEffect(() => {
    if (searchProduct) {
      const filtered = products.filter(product =>
        product.product_name.toLowerCase().includes(searchProduct.toLowerCase()) ||
        product.product_code?.toLowerCase().includes(searchProduct.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowProductDropdown(true);
    } else {
      setFilteredProducts([]);
      setShowProductDropdown(false);
    }
  }, [searchProduct, products]);

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

    let payload;
    if (isNewStudent) {
      payload = {
        school: formData.school,
        student_name_input: formData.student_name_input,
        parent_name: formData.parent_name || "",
        parent_contact_input: formData.parent_contact_input || "",
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
    } else {
      payload = {
        school: formData.school,
        student: formData.student,
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
                <select
                  style={styles.select}
                  value={formData.school}
                  onChange={handleSchoolChange}
                  required
                >
                  <option value="">Select School</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.school_name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Student Type *</label>
                <select
                  style={styles.select}
                  value={isNewStudent ? "new" : "existing"}
                  onChange={handleStudentTypeChange}
                  disabled={!formData.school}
                  required
                >
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
                <input
                  type="date"
                  style={styles.input}
                  value={formData.receipt_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, receipt_date: e.target.value }))}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Discount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.input}
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* ADD STOCK ITEMS */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Add Items</h3>
            <div style={styles.itemAddSection}>
              <div style={styles.productSearchWrapper}>
                <label style={styles.label}>Product Search *</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Search product by name or code..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  onFocus={() => searchProduct && setShowProductDropdown(true)}
                />
                {showProductDropdown && filteredProducts.length > 0 && (
                  <div style={styles.productDropdown}>
                    {filteredProducts.map(product => (
                      <div
                        key={product.id}
                        style={styles.productDropdownItem}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div>
                          <div style={styles.productName}>{product.product_name}</div>
                          <div style={styles.productCode}>{product.product_code}</div>
                        </div>
                        <div style={styles.productPrice}>₹{product.unit_price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                ...styles.itemRow,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr"
              }}>
                <div style={styles.itemField}>
                  <label style={styles.label}>Quantity</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>

                <div style={styles.itemField}>
                  <label style={styles.label}>Rate (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={currentItem.rate}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div style={styles.itemField}>
                  <label style={styles.label}>Available Stock</label>
                  <input
                    type="text"
                    style={{ ...styles.input, backgroundColor: "#f8fafc", fontFamily: "monospace" }}
                    value={currentItem.available_stock}
                    readOnly
                  />
                </div>
              </div>

              <button
                type="button"
                style={{ ...styles.addButton, marginTop: "12px" }}
                onClick={handleAddItem}
              >
                + Add Item Rule
              </button>
            </div>

            {/* Items Table */}
            {formData.items.length > 0 && (
              <div style={styles.itemsTableWrapper}>
                <table style={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>Product</th>
                      <th style={{ ...styles.tableTh, width: "70px", textAlign: "center" }}>Qty</th>
                      <th style={{ ...styles.tableTh, width: "100px" }}>Rate</th>
                      <th style={{ ...styles.tableTh, width: "110px" }}>Amount</th>
                      <th style={{ ...styles.tableTh, width: "50px", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map(item => (
                      <tr key={item.id} style={styles.tableTr}>
                        <td style={styles.tableTd}>{item.product_name}</td>
                        <td style={{ ...styles.tableTd, textAlign: "center", fontWeight: "600" }}>{item.quantity}</td>
                        <td style={styles.tableTd}>₹{item.rate.toFixed(2)}</td>
                        <td style={{ ...styles.tableTd, fontWeight: "600" }}>₹{item.amount.toFixed(2)}</td>
                        <td style={{ ...styles.tableTd, textAlign: "center" }}>
                          <button
                            type="button"
                            style={styles.removeButton}
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SUMMARY */}
          <div style={styles.summaryBox}>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>
            <div style={styles.summaryRow}>
              <span>Discount:</span>
              <strong style={{ color: "#ef4444" }}>- ₹{parseFloat(formData.discount || 0).toFixed(2)}</strong>
            </div>
            <div style={{ ...styles.summaryRow, borderTop: "1px dashed #e2e8f0", paddingTop: "8px", marginTop: "4px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Grand Total:</span>
              <strong style={{ fontSize: "16px", color: "#6080E8" }}>₹{grandTotal.toFixed(2)}</strong>
            </div>
          </div>

          {/* REMARKS */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Remarks</label>
            <textarea
              style={styles.textarea}
              rows="2"
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Additional notes..."
            />
          </div>

          {/* FOOTER ACTIONS */}
          <div style={styles.footerActions}>
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
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "12px", boxSizing: "border-box" },
  modalCard: { background: "#fff", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "24px 24px 0 24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "8px" },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 },
  modalSubtitle: { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" },
  closeX: { background: "none", border: "none", fontSize: "28px", color: "#94a3b8", cursor: "pointer", lineHeight: "1", padding: "0" },
  form: { padding: "24px", display: "flex", flexDirection: "column", gap: "20px" },
  section: { marginBottom: "10px" },
  sectionTitle: { fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px", paddingBottom: "6px", borderBottom: "1px solid #f1f5f9" },
  formGrid: { display: "grid", gap: "14px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#475569" },
  input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#334155", width: "100%", boxSizing: "border-box" },
  select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#334155", width: "100%", boxSizing: "border-box", background: "#fff", cursor: "pointer" },
  textarea: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", resize: "none", width: "100%", boxSizing: "border-box", color: "#334155", fontFamily: "inherit" },
  itemAddSection: { display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" },
  productSearchWrapper: { position: "relative" },
  productDropdown: { position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #cbd5e1", borderRadius: "8px", maxHeight: "200px", overflowY: "auto", zIndex: 2010, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" },
  productDropdownItem: { padding: "10px 12px", cursor: "pointer", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
  productName: { fontWeight: "600", fontSize: "13.5px", color: "#1e293b" },
  productCode: { fontSize: "11px", color: "#64748b", fontFamily: "monospace" },
  productPrice: { fontSize: "13px", color: "#6080E8", fontWeight: "600" },
  itemRow: { display: "grid", gap: "12px", alignItems: "end" },
  itemField: { display: "flex", flexDirection: "column", gap: "6px" },
  addButton: { background: "#f0f4ff", color: "#6080E8", border: "1px dashed #6080E8", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", width: "100%", textAlign: "center", boxSizing: "border-box" },
  itemsTableWrapper: { width: "100%", overflowX: "auto", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", WebkitOverflowScrolling: "touch", marginTop: "14px" },
  itemsTable: { width: "100%", borderCollapse: "collapse", minWidth: "500px", textAlign: "left" },
  tableTh: { background: "#f8fafc", padding: "10px 14px", fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" },
  tableTr: { borderBottom: "1px solid #f1f5f9" },
  tableTd: { padding: "10px 14px", fontSize: "13.5px", color: "#475569", verticalAlign: "middle" },
  removeButton: { background: "none", border: "none", color: "#ef4444", fontSize: "20px", cursor: "pointer", padding: "0 4px", lineHeight: "1" },
  summaryBox: { marginLeft: "auto", width: "100%", maxWidth: "280px", display: "flex", flexDirection: "column", gap: "6px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #edf2f7", boxSizing: "border-box" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  footerActions: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "14px" },
  cancelButton: { background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  submitButton: { background: "#6080E8", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)" },
};