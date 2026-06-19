import { useState, useEffect } from "react";
import API from "../../api";

export default function AddInvoiceDocument({ isOpen, id, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );

  const [formData, setFormData] = useState({
    document_type: "PROFORMA",
    school: "",
    invoice_date: new Date().toISOString().split("T")[0],
    challan_no: "",
    challan_date: "",
    remarks: "",
    items: [],
    gst_no: "",
  pan_no: "",
  state: "",
  state_code: "",
  city: "",
  });

  const [currentItem, setCurrentItem] = useState({
    description: "",
    qty: 1,
    rate: 0,
    gst_percent: 18,
  });

  // Track resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync Form State based on create vs edit context paths
  useEffect(() => {
    if (isOpen) {
      fetchSchools();
      if (id) {
        fetchInvoiceDetail(); // 🌟 Fetch existing data automatically on edit click
      } else {
        setFormData({
          document_type: "PROFORMA",
          school: "",
          invoice_date: new Date().toISOString().split("T")[0],
          challan_no: "",
          challan_date: "",
          remarks: "",
          items: [],
        });
        setStudentCount(0);
        setCurrentItem({ description: "", qty: 1, rate: 0, gst_percent: 18 });
      }
    }
  }, [isOpen, id]);

  // Fetch student count when school changes
  useEffect(() => {
    if (formData.school && !id) { // Only auto-set defaults when creating a brand new record
      fetchStudentCount(formData.school);
    }
  }, [formData.school, id]);

  const fetchSchools = async () => {
    try {
      const res = await API.get("/info/schools/");
      const filteredSchools = res.data.filter(
        (school) => school.fees_taken_from === "school"
      );
      setSchools(filteredSchools);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const fetchInvoiceDetail = async () => {
    try {
      const res = await API.get(`/billing/invoice-documents/${id}/`);
      
      // Parse description labels to extract original text and match input states
      const parsedItems = res.data.items.map((item, index) => {
        let cleanDescription = item.description || "";
        let extractedGst = 18; // fallback base default
        
        const gstMatch = cleanDescription.match(/\(GST:\s*([\d.]+)%\)/i);
        if (gstMatch) {
          extractedGst = parseFloat(gstMatch[1]);
          cleanDescription = cleanDescription.replace(/\s*\(GST:\s*[\d.]+%\)/i, "");
        }

        const qty = parseInt(item.qty) || 0;
        const rate = parseFloat(item.rate) || 0;
        const baseAmount = qty * rate;
        const gstAmount = baseAmount * (extractedGst / 100);

        return {
          id: index,
          description: cleanDescription,
          qty: qty,
          rate: rate,
          gst_percent: extractedGst,
          amount: baseAmount,
          gst_amount: gstAmount,
          total_amount: baseAmount + gstAmount
        };
      });

      setFormData({
        document_type: res.data.document_type || "INVOICE",
        school: res.data.school || "",
        invoice_date: res.data.invoice_date || new Date().toISOString().split("T")[0],
        challan_no: res.data.challan_no || "",
        challan_date: res.data.challan_date || "",
        remarks: res.data.remarks || "",
        items: parsedItems,

      gst_no: res.data.gst_no || "",
      pan_no: res.data.pan_no || "",
      state: res.data.state || "",
      state_code: res.data.state_code || "",
      city: res.data.city || "",
      });

      if (res.data.school) {
        const studentRes = await API.get(`/info/students/?school=${res.data.school}`);
        setStudentCount(studentRes.data.length);
      }
    } catch (err) {
      console.error("Error loading original invoice data:", err);
      alert("Failed to load invoice information.");
    }
  };

  const fetchStudentCount = async (schoolId) => {
    try {
      const res = await API.get(`/info/students/?school=${schoolId}`);
      const count = res.data.length;
      setStudentCount(count);
      setCurrentItem(prev => ({ ...prev, qty: count }));
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setFormData(prev => ({ ...prev, school: schoolId, items: [] }));
    setCurrentItem({ description: "", qty: 0, rate: 0, gst_percent: 18 });
  };

  const handleAddItem = () => {
    if (!currentItem.description.trim()) {
      alert("Please enter item description");
      return;
    }
    if (currentItem.qty <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }
    if (currentItem.rate <= 0) {
      alert("Rate must be greater than 0");
      return;
    }

    const amount = currentItem.qty * currentItem.rate;
    const gstAmount = amount * (currentItem.gst_percent / 100);
    const totalWithGst = amount + gstAmount;

    const newItem = {
      id: Date.now(),
      description: currentItem.description,
      qty: currentItem.qty,
      rate: currentItem.rate,
      gst_percent: currentItem.gst_percent,
      amount: amount,
      gst_amount: gstAmount,
      total_amount: totalWithGst,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setCurrentItem({
      description: "",
      qty: studentCount,
      rate: 0,
      gst_percent: 18,
    });
  };

  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleUpdateItem = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'qty' || field === 'rate' || field === 'gst_percent') {
            const newAmount = (field === 'qty' ? value : updatedItem.qty) * (field === 'rate' ? value : updatedItem.rate);
            const newGstAmount = newAmount * ((field === 'gst_percent' ? value : updatedItem.gst_percent) / 100);
            updatedItem.amount = newAmount;
            updatedItem.gst_amount = newGstAmount;
            updatedItem.total_amount = newAmount + newGstAmount;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const totalGst = formData.items.reduce((sum, item) => sum + item.gst_amount, 0);
  const grandTotal = formData.items.reduce((sum, item) => sum + item.total_amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.school) {
      alert("Please select a school");
      return;
    }
    if (formData.items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const payload = {
      document_type: formData.document_type,
      school: parseInt(formData.school),
      invoice_date: formData.invoice_date,
      challan_no: formData.challan_no || "",
      challan_date: formData.challan_date || null,
      gst_percent: 0,
      remarks: formData.remarks || "",
      gst_no: formData.gst_no || "",
    pan_no: formData.pan_no || "",
    state: formData.state || "",
    state_code: formData.state_code || "",
    city: formData.city || "",
      items: formData.items.map((item) => ({
        description: `${item.description} (GST: ${item.gst_percent}%)`,
        qty: item.qty,
        rate: item.rate,
        amount: item.amount,
      })),
    };

    setLoading(true);
    try {
      if (id) {
        // 🌟 Calls update routing automatically if an ID parameter is active
        await API.put(`/billing/invoice-documents/update/${id}/`, payload);
        alert("Document Updated Successfully! ✨");
      } else {
        const response = await API.post("/billing/invoice-documents/create/", payload);
        alert(`Document Created Successfully! Document No: ${response.data.document_no}`);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving document changes:", err);
      alert(err.response?.data?.message || "Failed to save data mutations.");
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeName = () => {
    return formData.document_type === "PROFORMA" ? "Proforma Invoice" : "Invoice";
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>{id ? `Edit ${getDocumentTypeName()}` : `Create ${getDocumentTypeName()}`}</h2>
            </div>
            <p style={styles.subtitle}>Configure invoice items, ledger records, and metadata tracks.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Document Type *</label>
            <select
              style={styles.select}
              value={formData.document_type}
              onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
              disabled={!!id} // Safe-guard configuration locks type adjustments on edit
            >
              <option value="PROFORMA">Proforma Invoice</option>
              <option value="INVOICE">Invoice</option>
            </select>
          </div>

          <div style={{ ...styles.row, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>School Origin Target *</label>
              <select
                style={styles.select}
                value={formData.school}
                onChange={handleSchoolChange}
                disabled={!!id} // Safe-guard locks school shifts during active edits
                required
              >
                <option value="">Select School</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Document Date *</label>
              <input
                type="date"
                style={styles.input}
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ ...styles.row, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Challan Number</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Optional record tracking no."
                value={formData.challan_no}
                onChange={(e) => setFormData({ ...formData, challan_no: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Challan Date</label>
              <input
                type="date"
                style={styles.input}
                value={formData.challan_date || ""}
                onChange={(e) => setFormData({ ...formData, challan_date: e.target.value })}
              />
            </div>
          </div>
{/* Add after the Challan Date fields */}
<div style={styles.sectionTitle}>Tax & Business Information</div>

<div style={{ ...styles.row, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
  <div style={styles.formGroup}>
    <label style={styles.label}>GST Number</label>
    <input
      type="text"
      style={styles.input}
      placeholder="e.g., 27AAHFH9767Q1Z9"
      value={formData.gst_no}
      onChange={(e) => setFormData({ ...formData, gst_no: e.target.value })}
    />
  </div>

  <div style={styles.formGroup}>
    <label style={styles.label}>PAN Number</label>
    <input
      type="text"
      style={styles.input}
      placeholder="e.g., AAHFH9767Q"
      value={formData.pan_no}
      onChange={(e) => setFormData({ ...formData, pan_no: e.target.value })}
    />
  </div>
</div>

<div style={{ ...styles.row, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr" }}>
  <div style={styles.formGroup}>
    <label style={styles.label}>State</label>
    <input
      type="text"
      style={styles.input}
      placeholder="State"
      value={formData.state}
      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
    />
  </div>

  <div style={styles.formGroup}>
    <label style={styles.label}>State Code</label>
    <input
      type="text"
      style={styles.input}
      placeholder="e.g., 27"
      value={formData.state_code}
      onChange={(e) => setFormData({ ...formData, state_code: e.target.value })}
    />
  </div>

  <div style={styles.formGroup}>
    <label style={styles.label}>City</label>
    <input
      type="text"
      style={styles.input}
      placeholder="City"
      value={formData.city}
      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
    />
  </div>
</div>
          <hr style={styles.divider} />

          {/* Add Items Builder Section */}
          <div style={styles.itemsSection}>
            <h3 style={styles.sectionTitle}>Add Item Specifications</h3>
            
            {formData.school && (
              <div style={styles.infoBox}>
                <div style={styles.infoIcon}>👨‍🎓</div>
                <div>
                  <div style={styles.infoTitle}>Total Registered Students in School</div>
                  <div style={styles.infoValue}>{studentCount} Students</div>
                </div>
              </div>
            )}
            
            <div style={styles.itemForm}>
              <div style={styles.itemDescription}>
                <label style={styles.label}>Description Specification *</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="e.g., Term Tuition Fees, Exam Materials, Course Kits"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                />
              </div>

              <div style={{
                ...styles.itemRow,
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr",
                gap: isMobile ? "14px" : "12px"
              }}>
                <div style={styles.itemField}>
                  <label style={styles.label}>Quantity (Students) *</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={currentItem.qty}
                    onChange={(e) => setCurrentItem({ ...currentItem, qty: Number(e.target.value) })}
                    min="1"
                  />
                </div>

                <div style={styles.itemField}>
                  <label style={styles.label}>Rate per Student (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    placeholder="0.00"
                    value={currentItem.rate}
                    onChange={(e) => setCurrentItem({ ...currentItem, rate: Number(e.target.value) })}
                    min="0"
                  />
                </div>

                <div style={styles.itemField}>
                  <label style={styles.label}>GST Percentage (%) *</label>
                  <input
                    type="number"
                    step="0.01"
                    style={styles.input}
                    value={currentItem.gst_percent}
                    onChange={(e) => setCurrentItem({ ...currentItem, gst_percent: Number(e.target.value) })}
                    min="0"
                  />
                </div>

                <div style={styles.itemField}>
                  <label style={styles.label}>Net Subtotal (₹)</label>
                  <input
                    type="text"
                    style={{ ...styles.input, backgroundColor: "var(--bg-layout)", fontWeight: "600" }}
                    value={`₹${(currentItem.qty * currentItem.rate).toFixed(2)}`}
                    readOnly
                  />
                </div>
              </div>
              <button
                type="button"
                style={styles.addItemButton}
                onClick={handleAddItem}
              >
                + Append Item Line
              </button>
            </div>
          </div>

          {/* Invoice Items Data Sheet Grid */}
          {formData.items.length > 0 && (
            <div style={styles.itemsTableWrapper}>
              <table style={styles.itemsTable}>
                <thead>
                  <tr>
                    <th style={styles.tableTh}>#</th>
                    <th style={styles.tableTh}>Description</th>
                    <th style={styles.tableTh}>Qty</th>
                    <th style={styles.tableTh}>Rate (₹)</th>
                    <th style={styles.tableTh}>GST%</th>
                    <th style={styles.tableTh}>Amount (₹)</th>
                    <th style={styles.tableTh}>GST Amt (₹)</th>
                    <th style={styles.tableTh}>Total (₹)</th>
                    <th style={{ ...styles.tableTh, textAlign: "center" }}>Act</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={item.id} style={styles.tableTr}>
                      <td style={styles.tableTd}>{index + 1}</td>
                      <td style={styles.tableTd}>
                        <input
                          type="text"
                          style={styles.descriptionInput}
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        />
                      </td>
                      <td style={styles.tableTd}>
                        <input
                          type="number"
                          style={styles.qtyInput}
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td style={styles.tableTd}>
                        <input
                          type="number"
                          step="0.01"
                          style={styles.rateInput}
                          value={item.rate}
                          onChange={(e) => handleUpdateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td style={styles.tableTd}>
                        <input
                          type="number"
                          step="0.01"
                          style={styles.gstInput}
                          value={item.gst_percent}
                          onChange={(e) => handleUpdateItem(item.id, 'gst_percent', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td style={styles.tableTd}>₹{item.amount.toFixed(2)}</td>
                      <td style={styles.tableTd}>₹{item.gst_amount.toFixed(2)}</td>
                      <td style={{ ...styles.tableTd, fontWeight: "600", color: "#6080E8" }}>₹{item.total_amount.toFixed(2)}</td>
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
                <tfoot>
                  <tr style={styles.footerRow}>
                    <td colSpan="5" style={styles.footerLabel}>Calculated Gross Accumulations:</td>
                    <td style={styles.footerValue}>₹{subtotal.toFixed(2)}</td>
                    <td style={styles.footerValue}>₹{totalGst.toFixed(2)}</td>
                    <td style={styles.footerGrandTotal}>₹{grandTotal.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Remarks */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Documentation / Internal Remarks</label>
            <textarea
              rows={2}
              style={styles.textarea}
              value={formData.remarks || ""}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Enter additional dynamic tracking information notes..."
            />
          </div>

          {/* Footer Execution Flow Controls */}
          <div style={{
            ...styles.buttonRow,
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              style={styles.saveBtn}
              disabled={loading || !formData.school || formData.items.length === 0}
            >
              {loading ? "Saving Changes..." : id ? "Update Document Data" : "Publish Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "12px", boxSizing: "border-box"
  },
  modalCard: {
    background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", width: "100%", maxWidth: "780px",
    maxHeight: "92vh", overflowY: "auto", boxSizing: "border-box"
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "24px 24px 0 24px", borderBottom: "1px solid var(--border-main)", paddingBottom: "16px", marginBottom: "12px"
  },
  titleSection: { display: "flex", flexDirection: "column", gap: "4px" },
  headingWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  verticalLine: { width: "4px", height: "24px", backgroundColor: "#6080E8", borderRadius: "2px", flexShrink: 0 },
  title: { fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: 0 },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0 },
  closeX: { background: "none", border: "none", fontSize: "26px", color: "var(--text-muted)", cursor: "pointer", lineHeight: "1", padding: "0" },
  form: { padding: "24px", display: "flex", flexDirection: "column", gap: "18px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  row: { display: "grid", gap: "16px" },
  label: { fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" },
  input: {
    padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)",
    background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", width: "100%", boxSizing: "border-box"
  },
  select: {
    padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)",
    background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", width: "100%", boxSizing: "border-box", cursor: "pointer"
  },
  textarea: {
    padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)",
    background: "var(--bg-surface)", fontSize: "14px", outline: "none", resize: "vertical", width: "100%", boxSizing: "border-box", color: "var(--text-main)", fontFamily: "inherit"
  },
  warningText: { fontSize: "12px", color: "#f59e0b", margin: "2px 0 0 0" },
  hintText: { fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0" },
  infoBox: {
    background: "rgba(96, 128, 232, 0.12)", padding: "12px 16px", borderRadius: "8px",
    border: "1px solid var(--border-main)", display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px"
  },
  infoIcon: { fontSize: "22px" },
  infoTitle: { fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" },
  infoValue: { fontSize: "15px", fontWeight: "700", color: "#6080E8" },
  divider: { margin: "8px 0", border: "none", borderTop: "1px solid var(--border-main)" },
  itemsSection: { marginBottom: "4px" },
  sectionTitle: { fontSize: "14px", fontWeight: "700", color: "var(--text-main)", marginBottom: "12px" },
  itemForm: {
    background: "var(--bg-layout)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)", display: "flex", flexDirection: "column", gap: "12px"
  },
  itemDescription: { display: "flex", flexDirection: "column", gap: "6px" },
  itemRow: { display: "grid", alignItems: "end" },
  itemField: { display: "flex", flexDirection: "column", gap: "6px" },
  addItemButton: {
    background: "transparent", color: "#6080E8", border: "1px solid #6080E8", padding: "10px 16px",
    borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", width: "100%", textAlign: "center", boxSizing: "border-box", marginTop: "4px"
  },
  itemsTableWrapper: { overflowX: "auto", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-main)", WebkitOverflowScrolling: "touch", marginBottom: "4px" },
  itemsTable: { width: "100%", borderCollapse: "collapse", fontSize: "13px", minWidth: "900px" },
  tableTh: {
    background: "var(--bg-table-th)", padding: "12px", textAlign: "left", borderBottom: "1px solid var(--border-main)",
    fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em"
  },
  tableTr: { borderBottom: "1px solid var(--border-main)" },
  tableTd: { padding: "12px", color: "var(--text-td)", verticalAlign: "middle" },
  descriptionInput: { width: "180px", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", color: "var(--text-main)", fontSize: "12px" },
  qtyInput: { width: "70px", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", color: "var(--text-main)", fontSize: "12px", textAlign: "center" },
  rateInput: { width: "90px", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", color: "var(--text-main)", fontSize: "12px", textAlign: "right" },
  gstInput: { width: "70px", padding: "6px 8px", borderRadius: "4px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", color: "var(--text-main)", fontSize: "12px", textAlign: "right" },
  removeButton: { background: "none", border: "none", color: "#ef4444", fontSize: "20px", cursor: "pointer", padding: "0 4px", lineHeight: "1" },
  footerRow: { background: "var(--bg-table-th)", fontWeight: "600" },
  footerLabel: { textAlign: "right", padding: "12px", fontWeight: "600", color: "var(--text-muted)" },
  footerValue: { padding: "12px", fontWeight: "600", color: "var(--text-main)" },
  footerGrandTotal: { padding: "12px", fontWeight: "700", color: "#6080E8", fontSize: "14px" },
  buttonRow: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "4px", paddingTop: "16px", borderTop: "1px solid var(--border-main)" },
  cancelBtn: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  saveBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
};