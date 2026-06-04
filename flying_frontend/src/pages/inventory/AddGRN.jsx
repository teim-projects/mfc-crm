import { useEffect, useState } from "react";
import API from "../../api";

export default function AddGRN({ isOpen, id, onClose, onSuccess }) {
  const [poList, setPoList] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [formData, setFormData] = useState({
    purchase_order: "",
    vendor: "",
    vendor_name: "",
    grn_number: "",
    grn_date: "",
    status: "completed",
    remarks: "",
    items: [],
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchPO();
      if (id) {
        fetchGRN();
      } else {
        setFormData({
          purchase_order: "",
          vendor: "",
          vendor_name: "",
          grn_number: `GRN-${Date.now()}`,
          grn_date: new Date().toISOString().split("T")[0],
          status: "completed",
          remarks: "",
          items: [],
        });
      }
    }
  }, [id, isOpen]);

  const fetchPO = async () => {
    try {
      const res = await API.get("/inventory/po/");
      setPoList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGRN = async () => {
    try {
      const res = await API.get(`/inventory/grn/${id}/`);
      setFormData({
        ...res.data,
        items: res.data.items.map((item) => ({
          ...item,
          replacement_qty: item.replacement_qty || 0,
         
        })),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePOChange = async (e) => {
    const poId = e.target.value;
    if (!poId) return;
    try {
      const res = await API.get(`/inventory/po/${poId}/`);
      setFormData({
        ...formData,
        purchase_order: poId,
        vendor: res.data.vendor,
        vendor_name: res.data.vendor_name,
        items: res.data.items.map((item) => ({
          product: item.product,
          product_name: item.product_name,
          ordered_qty: item.quantity,
          replacement_qty: item.replacement_qty || 0,
          
          received_qty: item.quantity,
          accepted_qty: item.quantity,
          damaged_qty: 0,
          unit: item.unit,
          rate: item.rate,
          gst_percent: item.gst_percent,
          amount: item.amount,
          remarks: "",
        }))
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    updatedItems[index].accepted_qty = updatedItems[index].received_qty - updatedItems[index].damaged_qty;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        items: formData.items.map((item) => ({
          product: Number(item.product),
          ordered_qty: Number(item.ordered_qty),
          replacement_qty: Number(item.replacement_qty || 0),
          
          received_qty: Number(item.received_qty),
          accepted_qty: Number(item.accepted_qty),
          damaged_qty: Number(item.damaged_qty),
          unit: item.unit,
          rate: Number(item.rate),
          gst_percent: Number(item.gst_percent),
          amount: Number(item.amount),
          remarks: item.remarks || "",
        })),
      };

      if (id) {
        await API.put(`/inventory/grn/update/${id}/`, payload);
        alert("GRN Updated Successfully ✨");
      } else {
        await API.post("/inventory/grn/create/", payload);
        alert("GRN Created Successfully 🚀");
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
            <h2 style={styles.modalTitle}>{id ? "Review GRN Slip" : "Generate GRN Voucher"}</h2>
            <p style={styles.modalSubtitle}>Verify incoming shipments against system records.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* HEADER FORM FIELDS GRID */}
          <div style={{
            ...styles.formGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr"
          }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Base Purchase Order *</label>
              <select value={formData.purchase_order} onChange={handlePOChange} style={styles.select} required disabled={!!id}>
                <option value="">Select PO</option>
                {poList.map((po) => (
                  <option key={po.id} value={po.id}>{po.po_number}</option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>GRN Registry Code</label>
              <input type="text" value={formData.grn_number} readOnly style={styles.readOnlyInput} />
            </div>

            <div style={{ ...styles.inputGroup, gridColumn: isMobile ? "span 1" : "span 2" }}>
              <label style={styles.label}>Receiving Gate Inward Date *</label>
              <input type="date" value={formData.grn_date} onChange={(e) => setFormData({ ...formData, grn_date: e.target.value })} style={styles.input} required />
            </div>
          </div>

          <div style={styles.vendorBox}>
            <span style={styles.vendorLabel}>Assigned Origin Vendor Partner</span>
            <div style={styles.vendorNameText}>{formData.vendor_name || "No Base Purchase Order Selected"}</div>
          </div>

          {/* AUDIT SYSTEM LINES DATA TABLE */}
          <span style={styles.sectionHeading}>Shipment Content Audit Lines</span>
          <div style={styles.tableWrapper}>
            <table style={styles.itemsTable}>
              <thead>
                <tr>
                  <th style={styles.tableTh}>Product Details</th>
                  <th style={{ ...styles.tableTh, width: "70px" }}>Ordered</th>
                  <th style={{ ...styles.tableTh, width: "95px" }}>Replacement</th>
                  <th style={{ ...styles.tableTh, width: "105px" }}>Received</th>
                  <th style={{ ...styles.tableTh, width: "105px" }}>Damaged</th>
                  <th style={{ ...styles.tableTh, width: "85px", textAlign: "center" }}>Accepted</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.length > 0 ? (
                  formData.items.map((item, index) => (
                    <tr key={index} style={styles.tableTr}>
                      <td style={{ ...styles.tableTd, fontWeight: "500", color: "#1e293b" }}>{item.product_name}</td>
                      <td style={{ ...styles.tableTd, fontWeight: "600", color: "#64748b" }}>{item.ordered_qty}</td>
                      <td style={{ ...styles.tableTd, color: "#dc2626", fontWeight: "600" }}>
                        {item.replacement_qty || 0}
                      </td>
                      <td style={styles.tableTd}>
                        <input type="number" value={item.received_qty} onChange={(e) => handleItemChange(index, "received_qty", Number(e.target.value))} style={styles.tableInlineInput} />
                      </td>
                      <td style={styles.tableTd}>
                        <input type="number" value={item.damaged_qty} onChange={(e) => handleItemChange(index, "damaged_qty", Number(e.target.value))} style={styles.tableInlineInput} />
                      </td>
                      <td style={{ ...styles.tableTd, fontWeight: "700", color: "#16a34a", textAlign: "center", fontSize: "14px" }}>
                        {item.accepted_qty}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={styles.tableEmptyState}>
                      No shipment items mapped yet. Select a Purchase Order above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={styles.footerActions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>{id ? "Update Voucher" : "Commit Inward Inventory"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "12px", boxSizing: "border-box" },
  modalCard: { background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px", marginBottom: "18px" },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 },
  modalSubtitle: { fontSize: "13px", color: "#64748b", margin: 0 },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "#94a3b8", cursor: "pointer", lineHeight: "1" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  formGrid: { display: "grid", gap: "14px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#475569" },
  input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#334155", width: "100%", boxSizing: "border-box" },
  select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", color: "#334155", width: "100%", boxSizing: "border-box", background: "#fff", cursor: "pointer" },
  readOnlyInput: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: "14px", outline: "none", fontFamily: "monospace", width: "100%", boxSizing: "border-box" },
  vendorBox: { background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" },
  vendorLabel: { display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" },
  vendorNameText: { fontSize: "15px", fontWeight: "600", color: "#1e293b" },
  sectionHeading: { display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px", marginBottom: "4px" },
  
  /* REFINED TABLE WRAPPERS */
  tableWrapper: { width: "100%", overflowX: "auto", background: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", WebkitOverflowScrolling: "touch" },
  itemsTable: { width: "100%", borderCollapse: "collapse", minWidth: "700px", textAlign: "left" },
  tableTh: { background: "#f8fafc", padding: "10px 14px", fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" },
  tableTr: { borderBottom: "1px solid #f1f5f9" },
  tableTd: { padding: "10px 14px", fontSize: "13.5px", color: "#475569", verticalAlign: "middle" },
  tableInlineInput: { width: "100%", padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box", outline: "none", background: "#fff" },
  tableEmptyState: { padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" },
  
  footerActions: { display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #f1f5f9", paddingTop: "14px", marginTop: "4px" },
  cancelBtn: { background: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  submitBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(22, 163, 74, 0.15)" }
};