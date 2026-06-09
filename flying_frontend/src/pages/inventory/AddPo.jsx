import { useEffect, useState } from "react";
import API from "../../api";

export default function AddPO({ isOpen, id, onClose, onSuccess }) {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [replacementProducts, setReplacementProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );
  const [formData, setFormData] = useState({
    vendor: "",
    po_number: "",
    po_date: "",
    delivery_date: "",
    payment_terms: "",
    remarks: "",
    items: [],
  });

  const [currentItem, setCurrentItem] = useState({
    product: "",
    quantity: 1,
    replacement_qty: 0,
    billable_qty: 1,
    unit: "PCS",
    rate: 0,
    gst_percent: 18,
    amount: 0,
    remarks: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchVendors();
      fetchProducts();
      
      if (id) {
        fetchPO();
      } else {
        setFormData({
          vendor: "",
          po_number: `PO-${Date.now()}`,
          po_date: new Date().toISOString().split("T")[0],
          delivery_date: "",
          payment_terms: "",
          remarks: "",
          items: [],
        });
      }
    }
  }, [id, isOpen]);

  const fetchVendors = async () => {
    try {
      const res = await API.get("/inventory/vendors/");
      setVendors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/inventory/products/");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPO = async () => {
    try {
      const res = await API.get(`/inventory/po/${id}/`);
      await fetchVendorDamages(res.data.vendor);
      setFormData({
        vendor: res.data.vendor,
        po_number: res.data.po_number,
        po_date: res.data.po_date,
        delivery_date: res.data.delivery_date,
        payment_terms: res.data.payment_terms,
        remarks: res.data.remarks || "",
        items: res.data.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          replacement_qty: item.replacement_qty || 0,
          billable_qty: item.billable_qty ?? (item.quantity - (item.replacement_qty || 0)),
          unit: item.unit,
          rate: item.rate,
          gst_percent: item.gst_percent,
          amount: item.amount,
          remarks: item.remarks || "",
        })),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchVendorDamages = async (vendorId) => {
    if (!vendorId) {
      setReplacementProducts([]);
      return;
    }
    try {
      const res = await API.get(`/inventory/vendor-replacements/?vendor_id=${vendorId}`);
      setReplacementProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === "vendor") {
      setReplacementProducts([]);
      fetchVendorDamages(value);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    const pendingQty = replacementProducts.find(
      p => p.product_id == updatedItems[index].product
    )?.pending_qty || 0;

    const qty = Number(updatedItems[index].quantity) || 0;
    let replacement = Number(updatedItems[index].replacement_qty) || 0;

    if (replacement > pendingQty) {
      replacement = pendingQty;
      updatedItems[index].replacement_qty = pendingQty;
    }

    updatedItems[index].billable_qty = qty - replacement;
    const rate = Number(updatedItems[index].rate) || 0;
    updatedItems[index].amount = updatedItems[index].billable_qty * rate;

    setFormData({ ...formData, items: updatedItems });
  };

  const handleCurrentItemChange = (field, value) => {
    const updatedItem = { ...currentItem, [field]: value };
    const qty = Number(updatedItem.quantity) || 0;
    let replacement = Number(updatedItem.replacement_qty) || 0;

    const pendingQty = replacementProducts.find(
      p => p.product_id == updatedItem.product
    )?.pending_qty || 0;

    if (replacement > pendingQty) {
      alert(`Maximum replacement quantity is ${pendingQty}`);
      replacement = pendingQty;
      updatedItem.replacement_qty = pendingQty;
    }

    updatedItem.billable_qty = qty - replacement;
    const rate = Number(updatedItem.rate) || 0;
    updatedItem.amount = updatedItem.billable_qty * rate;

    setCurrentItem(updatedItem);
  };

  const addItemToTable = () => {
    if (!currentItem.product) {
      alert("Select Product");
      return;
    }
    setFormData({
      ...formData,
      items: [...formData.items, currentItem],
    });
    setCurrentItem({
      product: "",
      quantity: 1,
      replacement_qty: 0,
      billable_qty: 1,
      unit: "PCS",
      rate: 0,
      gst_percent: 18,
      amount: 0,
      remarks: "",
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const subtotal = formData.items.reduce(
    (acc, item) => acc + (Number(item.billable_qty || 0) * Number(item.rate || 0)), 
    0
  );
  const gstTotal = formData.items.reduce((acc, item) => acc + (item.amount * item.gst_percent) / 100, 0);
  const grandTotal = subtotal + gstTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendor || formData.items.length === 0) {
      alert("Please ensure vendor is selected and items are added.");
      return;
    }
    try {
      const payload = { ...formData, subtotal, gst_total: gstTotal, grand_total: grandTotal };
      if (id) {
        await API.put(`/inventory/po/update/${id}/`, payload);
        alert("PO Updated Successfully ✨");
      } else {
        await API.post("/inventory/po/create/", payload);
        alert("PO Created Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      alert("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>{id ? "Edit Purchase Order" : "Create Purchase Order"}</h2>
            <p style={styles.modalSubtitle}>Configure outbound procurement and item asset bookings.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* HEADER SECTION */}
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={styles.inputGroup(isMobile)}>
              <label style={styles.label}>Vendor Supplier *</label>
              <select name="vendor" value={formData.vendor} onChange={handleChange} style={styles.select} required>
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.vendor_name}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup(isMobile)}>
              <label style={styles.label}>PO Reference Code</label>
              <input type="text" name="po_number" value={formData.po_number} readOnly style={styles.readOnlyInput} />
            </div>

            <div style={styles.inputGroup(isMobile)}>
              <label style={styles.label}>Order Date *</label>
              <input type="date" name="po_date" value={formData.po_date} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.inputGroup(isMobile)}>
              <label style={styles.label}>Expected Delivery Date</label>
              <input type="date" name="delivery_date" value={formData.delivery_date} onChange={handleChange} style={styles.input} />
            </div>

            <div style={{ ...styles.inputGroup(isMobile), gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.label}>Commercial Payment Terms</label>
              <input type="text" name="payment_terms" value={formData.payment_terms} onChange={handleChange} placeholder="e.g. Net 30, 50% Advance" style={styles.input} />
            </div>
          </div>

          {/* DYNAMIC ITEM BUILDING BLOCK */}
          <div style={styles.itemBuilderSection}>
            <span style={styles.sectionHeading}>Line Item Builder</span>
            
            <div style={styles.builderVerticalLayout}>
              {/* Row 1: Product Selection */}
              <div style={styles.builderField}>
                <label style={styles.builderLabel}>Product Selection *</label>
                <select
                  value={currentItem.product}
                  onChange={(e) => handleCurrentItemChange("product", e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Product Item</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.product_name}</option>
                  ))}
                </select>
              </div>

              {/* Row 2: Quantities, Metrics, and Action Controls */}
              <div style={{
                ...styles.metricsGrid,
                gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr 1fr 1fr"
              }}>
                <div style={styles.builderField}>
                  <label style={styles.builderLabel}>Quantity</label>
                  <input type="number" placeholder="Qty" value={currentItem.quantity} onChange={(e) => handleCurrentItemChange("quantity", Number(e.target.value))} style={styles.input} />
                </div>

                <div style={styles.builderField}>
                  <label style={styles.builderLabel}>Replacement Qty</label>
                  <input type="number" value={currentItem.replacement_qty} onChange={(e) => handleCurrentItemChange("replacement_qty", Number(e.target.value))} style={styles.input} />
                </div>
                
                <div style={styles.builderField}>
                  <label style={styles.builderLabel}>Billable Qty</label>
                  <input type="number" value={currentItem.billable_qty} readOnly style={styles.readOnlyInput} />
                </div>

                <div style={styles.builderField}>
                  <label style={styles.builderLabel}>Unit</label>
                  <input type="text" placeholder="Unit" value={currentItem.unit} onChange={(e) => handleCurrentItemChange("unit", e.target.value)} style={styles.input} />
                </div>

                <div style={styles.builderField}>
                  <label style={styles.builderLabel}>Rate (₹)</label>
                  <input type="number" placeholder="Rate" value={currentItem.rate} onChange={(e) => handleCurrentItemChange("rate", Number(e.target.value))} style={styles.input} />
                </div>

                <div style={styles.builderField}>
                  <label style={styles.builderLabel}>GST %</label>
                  <input type="number" placeholder="GST %" value={currentItem.gst_percent} onChange={(e) => handleCurrentItemChange("gst_percent", Number(e.target.value))} style={styles.input} />
                </div>
              </div>

              {/* Conditional Damaged Quantity Warning Label */}
              {currentItem.product && (() => {
                const damagedProduct = replacementProducts.find(p => p.product_id == currentItem.product);
                if (!damagedProduct) return null;
                return (
                  <div style={styles.damagedWarning}>
                    ⚠️ Pending Damaged Qty: {damagedProduct.pending_qty}
                  </div>
                );
              })()}

              <button 
                type="button" 
                onClick={addItemToTable} 
                style={styles.addItemBtn}
              >
                + Add Item To Purchase Order
              </button>
            </div>
          </div>

          {/* OUTLINED ITEMS TABLE */}
          <div style={styles.tableWrapper}>
            <table style={styles.itemsTable}>
              <thead>
                <tr>
                  <th style={styles.tableTh}>Item Name</th>
                  <th style={{ ...styles.tableTh, width: "85px" }}>Qty</th>
                  <th style={{ ...styles.tableTh, width: "115px" }}>Replacement</th>
                  <th style={{ ...styles.tableTh, width: "100px" }}>Billable</th>
                  <th style={{ ...styles.tableTh, width: "75px" }}>Unit</th>
                  <th style={{ ...styles.tableTh, width: "110px" }}>Rate</th>
                  <th style={{ ...styles.tableTh, width: "80px" }}>GST %</th>
                  <th style={{ ...styles.tableTh, width: "110px" }}>Total</th>
                  <th style={{ ...styles.tableTh, width: "50px", textAlign: "center" }}>Act</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.length > 0 ? (
                  formData.items.map((item, idx) => {
                    const matchingProd = products.find((p) => p.id == item.product);
                    return (
                      <tr key={idx} style={styles.tableTr}>
                        <td style={{ ...styles.tableTd, color: "var(--text-main)" }}>{matchingProd?.product_name || "—"}</td>
                        <td style={styles.tableTd}>
                          <input type="number" value={item.quantity} onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))} style={styles.tableInlineInput} />
                        </td>
                        <td style={styles.tableTd}>
                          <input type="number" value={item.replacement_qty || 0} onChange={(e) => handleItemChange(idx, "replacement_qty", Number(e.target.value))} style={styles.tableInlineInput} />
                        </td>
                        <td style={styles.tableTd}>
                          <input type="number" value={item.billable_qty || 0} readOnly style={{ ...styles.tableInlineInput, background: "var(--bg-layout)" }} />
                        </td>
                        <td style={styles.tableTd}>
                          <input type="text" value={item.unit} onChange={(e) => handleItemChange(idx, "unit", e.target.value)} style={styles.tableInlineInput} />
                        </td>
                        <td style={styles.tableTd}>
                          <input type="number" value={item.rate} onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))} style={styles.tableInlineInput} />
                        </td>
                        <td style={styles.tableTd}>
                          <input type="number" value={item.gst_percent} onChange={(e) => handleItemChange(idx, "gst_percent", Number(e.target.value))} style={styles.tableInlineInput} />
                        </td>
                        <td style={{ ...styles.tableTd, fontWeight: "600", color: "var(--text-main)" }}>
                          ₹{Number(item.amount || 0).toFixed(2)}
                        </td>
                        <td style={{ ...styles.tableTd, textAlign: "center" }}>
                          <button type="button" onClick={() => removeItem(idx)} style={styles.removeLineX}>&times;</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" style={styles.tableEmptyState}>No line items added. Use the builder above.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TOTALS SUMMARY */}
          <div style={styles.billingSummaryBox}>
            <div style={styles.summaryLine}><span style={styles.summaryLabel}>Subtotal:</span><span style={styles.summaryVal}>₹{subtotal.toFixed(2)}</span></div>
            <div style={styles.summaryLine}><span style={styles.summaryLabel}>Tax (GST):</span><span style={styles.summaryVal}>₹{gstTotal.toFixed(2)}</span></div>
            <div style={{ ...styles.summaryLine, borderTop: "1px dashed var(--border-main)", paddingTop: "8px", marginTop: "4px" }}>
              <span style={{ ...styles.summaryLabel, color: "var(--text-main)", fontSize: "14px" }}>Grand Net Total:</span>
              <span style={{ ...styles.summaryVal, color: "#6080E8", fontSize: "16px", fontWeight: "700" }}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={{
            ...styles.footerActions,
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>{id ? "Update PO" : "Save PO"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: "rgba(0, 0, 0, 0.65)", 
    backdropFilter: "blur(5px)", 
    WebkitBackdropFilter: "blur(5px)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 2000, 
    padding: "12px", 
    boxSizing: "border-box" 
  },
  modalCard: { 
    background: "var(--bg-card)", 
    border: "1px solid var(--border-main)",
    padding: "24px", 
    borderRadius: "16px", 
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", 
    width: "100%", 
    maxWidth: "850px", 
    maxHeight: "90vh", 
    overflowY: "auto", 
    boxSizing: "border-box" 
  },
  modalHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "flex-start", 
    borderBottom: "1px solid var(--border-main)", 
    paddingBottom: "14px", 
    marginBottom: "18px" 
  },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "var(--text-main)", margin: 0 },
  modalSubtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0 },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "var(--text-muted)", cursor: "pointer", lineHeight: "1" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  formGrid: { display: "grid", gap: "14px" },
  inputGroup: (isMobile) => ({ display: "flex", flexDirection: "column", gap: "6px", gridColumn: isMobile ? "span 1" : "initial" }),
  label: { fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" },
  input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-surface)", fontSize: "14px", outline: "none", color: "var(--text-main)", width: "100%", boxSizing: "border-box" },
  select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)", fontSize: "14px", outline: "none", color: "var(--text-main)", width: "100%", boxSizing: "border-box", background: "var(--bg-surface)", cursor: "pointer" },
  readOnlyInput: { padding: "10px 12px", borderRadius: "6px", border: "1px solid var(--border-main)", background: "var(--bg-layout)", color: "var(--text-muted)", fontSize: "14px", outline: "none", fontFamily: "monospace", boxSizing: "border-box", width: "100%" },
  
  /* BUILDER SECTION RESTRUCTURED */
  itemBuilderSection: { background: "var(--bg-layout)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" },
  sectionHeading: { display: "block", fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px" },
  builderVerticalLayout: { display: "flex", flexDirection: "column", gap: "14px" },
  metricsGrid: { display: "grid", gap: "12px", width: "100%" },
  builderField: { display: "flex", flexDirection: "column", gap: "6px" },
  builderLabel: { fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" },
  addItemBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", width: "100%", boxSizing: "border-box", textAlign: "center", minHeight: "40px" },
  damagedWarning: { color: "#ef4444", fontWeight: "600", fontSize: "12px", background: "rgba(239, 68, 68, 0.1)", padding: "8px 12px", borderRadius: "6px", border: "1px dashed #ef4444" },
  
  /* TABLE DESIGN SYSTEM */
  tableWrapper: { width: "100%", overflowX: "auto", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border-main)", WebkitOverflowScrolling: "touch" },
  itemsTable: { 
    width: "100%", 
    borderCollapse: "collapse", 
    minWidth: "900px", 
    textAlign: "left" 
  },
  tableTh: { background: "var(--bg-table-th)", padding: "10px 14px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-main)", whiteSpace: "nowrap" },
  tableTr: { borderBottom: "1px solid var(--border-light)" },
  tableTd: { padding: "10px 14px", fontSize: "13.5px", color: "var(--text-td)", verticalAlign: "middle" },
  tableInlineInput: { 
    width: "100%", 
    padding: "6px 4px", 
    border: "1px solid var(--border-main)", 
    background: "var(--bg-surface)",
    color: "var(--text-main)",
    borderRadius: "4px", 
    fontSize: "13px", 
    boxSizing: "border-box", 
    outline: "none",
    textAlign: "center" 
  },
  tableEmptyState: { padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" },
  
  removeLineX: { background: "none", border: "none", color: "#ef4444", fontSize: "20px", cursor: "pointer", padding: "0 4px", lineHeight: "1" },
  billingSummaryBox: { marginLeft: "auto", width: "100%", maxWidth: "280px", display: "flex", flexDirection: "column", gap: "6px", background: "var(--bg-layout)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-main)", boxSizing: "border-box" },
  summaryLine: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" },
  summaryVal: { fontSize: "13px", color: "var(--text-main)", fontWeight: "600" },
  footerActions: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid var(--border-main)", paddingType: "14px", marginTop: "10px" },
  cancelBtn: { background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-main)", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" },
  submitBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "center" }
};