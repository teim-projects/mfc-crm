import { useEffect, useState } from "react";
import API from "../../api";

export default function AddPO({ isOpen, id, onClose, onSuccess }) {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    const qty = parseFloat(updatedItems[index].quantity) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    updatedItems[index].amount = qty * rate;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleCurrentItemChange = (field, value) => {
    const updatedItem = { ...currentItem, [field]: value };
    const qty = parseFloat(updatedItem.quantity) || 0;
    const rate = parseFloat(updatedItem.rate) || 0;
    updatedItem.amount = qty * rate;
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

  const subtotal = formData.items.reduce((acc, item) => acc + Number(item.amount), 0);
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
        alert("PO Updated Successfully");
      } else {
        await API.post("/inventory/po/create/", payload);
        alert("PO Created Successfully");
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
            <p style={styles.modalSubtitle}>Inbound material asset booking configurations.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Vendor Supplier *</label>
              <select name="vendor" value={formData.vendor} onChange={handleChange} style={styles.select} required>
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.vendor_name}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>PO Reference Code</label>
              <input type="text" name="po_number" value={formData.po_number} readOnly style={styles.readOnlyInput} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Order Date *</label>
              <input type="date" name="po_date" value={formData.po_date} onChange={handleChange} style={styles.input} required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Expected Delivery Date</label>
              <input type="date" name="delivery_date" value={formData.delivery_date} onChange={handleChange} style={styles.input} />
            </div>

            <div style={{ ...styles.inputGroup, gridColumn: "span 2" }}>
              <label style={styles.label}>Commercial Payment Terms</label>
              <input type="text" name="payment_terms" value={formData.payment_terms} onChange={handleChange} placeholder="e.g. Net 30, 50% Advance" style={styles.input} />
            </div>
          </div>

          {/* DYNAMIC ITEM BUILDING BLOCK */}
          <div style={styles.itemBuilderSection}>
            <span style={styles.sectionHeading}>Line Item Builder</span>
            <div style={{
              ...styles.builderGrid,
              gridTemplateColumns: isMobile ? "1fr" : "2.5fr 1fr 1fr 1fr 1fr auto"
            }}>
              <div>
                <select
                  value={currentItem.product}
                  onChange={(e) => handleCurrentItemChange("product", e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.product_name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.mobileBuilderRow}>
                <input type="number" placeholder="Qty" value={currentItem.quantity} onChange={(e) => handleCurrentItemChange("quantity", Number(e.target.value))} style={styles.input} />
                <input type="text" placeholder="Unit" value={currentItem.unit} onChange={(e) => handleCurrentItemChange("unit", e.target.value)} style={styles.input} />
              </div>
              <div style={styles.mobileBuilderRow}>
                <input type="number" placeholder="Rate" value={currentItem.rate} onChange={(e) => handleCurrentItemChange("rate", Number(e.target.value))} style={styles.input} />
                <input type="number" placeholder="GST %" value={currentItem.gst_percent} onChange={(e) => handleCurrentItemChange("gst_percent", Number(e.target.value))} style={styles.input} />
              </div>
              <button type="button" onClick={addItemToTable} style={styles.addItemBtn}>+ Add Item</button>
            </div>
          </div>

          {/* TABLE SCROLLER OVERFLOW */}
          <div style={styles.tableWrapper}>
            <table style={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th style={{ width: "75px" }}>Qty</th>
                  <th style={{ width: "70px" }}>Unit</th>
                  <th style={{ width: "95px" }}>Rate</th>
                  <th style={{ width: "75px" }}>GST %</th>
                  <th>Total</th>
                  <th style={{ textAlign: "center" }}>Act</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, idx) => {
                  const matchingProd = products.find((p) => p.id == item.product);
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: "500" }}>{matchingProd?.product_name || "—"}</td>
                      <td><input type="number" value={item.quantity} onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))} style={styles.tableInlineInput} /></td>
                      <td><input type="text" value={item.unit} onChange={(e) => handleItemChange(idx, "unit", e.target.value)} style={styles.tableInlineInput} /></td>
                      <td><input type="number" value={item.rate} onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))} style={styles.tableInlineInput} /></td>
                      <td><input type="number" value={item.gst_percent} onChange={(e) => handleItemChange(idx, "gst_percent", Number(e.target.value))} style={styles.tableInlineInput} /></td>
                      <td style={{ fontWeight: "600" }}>₹{Number(item.amount || 0).toFixed(2)}</td>
                      <td style={{ textAlign: "center" }}><button type="button" onClick={() => removeItem(idx)} style={styles.removeLineX}>&times;</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TOTALS SUMMARY CONTAINER */}
          <div style={styles.billingSummaryBox}>
            <div style={styles.summaryLine}><span style={styles.summaryLabel}>Subtotal:</span><span style={styles.summaryVal}>₹{subtotal.toFixed(2)}</span></div>
            <div style={styles.summaryLine}><span style={styles.summaryLabel}>Calculated GST:</span><span style={styles.summaryVal}>₹{gstTotal.toFixed(2)}</span></div>
            <div style={{ ...styles.summaryLine, borderTop: "1px dashed #cbd5e1", paddingTop: "8px", marginTop: "4px" }}>
              <span style={{ ...styles.summaryLabel, color: "#0f172a", fontSize: "14px" }}>Grand Total:</span>
              <span style={{ ...styles.summaryVal, color: "#6080E8", fontSize: "16px", fontWeight: "700" }}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div style={styles.footerActions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>{id ? "Update PO" : "Save PO"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", boxSizing: "border-box" },
  modalCard: { background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "640px", maxHeight: "85vh", overflowY: "auto", boxSizing: "border-box" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px", marginBottom: "18px" },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 },
  modalSubtitle: { fontSize: "13px", color: "#64748b", margin: 0 },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "#94a3b8", cursor: "pointer", lineHeight: "1" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  formGrid: { display: "grid", gridTemplateColumns: window.innerWidth <= 600 ? "1fr" : "1fr 1fr", gap: "14px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px", gridColumn: window.innerWidth <= 600 ? "span 2" : "initial" },
  label: { fontSize: "12px", fontWeight: "600", color: "#475569" },
  input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#334155", width: "100%", boxSizing: "border-box" },
  select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#334155", width: "100%", boxSizing: "border-box", background: "#fff", cursor: "pointer" },
  readOnlyInput: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: "14px", outline: "none", fontFamily: "monospace" },
  itemBuilderSection: { background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" },
  sectionHeading: { display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" },
  builderGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  mobileBuilderRow: { display: "flex", gap: "10px", width: "100%" },
  addItemBtn: { background: "#6080E8", color: "#fff", border: "none", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", width: "100%", boxSizing: "border-box", textAlign: "center" },
  tableWrapper: { width: "100%", overflowX: "auto", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", WebkitOverflowScrolling: "touch" },
  itemsTable: { width: "100%", borderCollapse: "collapse", minWidth: "600px", textAlign: "left" },
  tableInlineInput: { width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" },
  removeLineX: { background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer", padding: "0 4px" },
  billingSummaryBox: { marginLeft: "auto", width: "100%", maxWidth: "260px", display: "flex", flexDirection: "column", gap: "6px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #edf2f7" },
  summaryLine: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: "13px", color: "#64748b", fontWeight: "500" },
  summaryVal: { fontSize: "13px", color: "#1e293b", fontWeight: "600" },
  footerActions: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "14px" },
  cancelBtn: { background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  submitBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }
};