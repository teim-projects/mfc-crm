import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../api";

export default function PurchaseOrders() {

  const navigate = useNavigate();

  const [purchaseOrders, setPurchaseOrders] =
    useState([]);

  useEffect(() => {

    fetchPOs();

  }, []);

  const fetchPOs = async () => {

    try {

      const res = await API.get(
        "/inventory/po/"
      );

      setPurchaseOrders(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  const deletePO = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PO?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/inventory/po/delete/${id}/`
      );

      alert("PO Deleted");

      fetchPOs();

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <div>

      {/* HEADER */}
      <div
        style={styles.header}
      >

        <div>

          <h2 style={styles.title}>
            Purchase Orders
          </h2>

          <p style={styles.subtitle}>
            Manage all purchase orders
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/po/add")
          }
          style={styles.addButton}
        >
          + Add PO
        </button>

      </div>

      {/* TABLE */}
      <div style={styles.card}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>
                PO Number
              </th>

              <th style={styles.th}>
                Vendor
              </th>

              <th style={styles.th}>
                PO Date
              </th>

              <th style={styles.th}>
                Delivery Date
              </th>

              <th style={styles.th}>
                Grand Total
              </th>

              <th style={styles.th}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {purchaseOrders.length > 0 ? (

              purchaseOrders.map((po) => (

                <tr key={po.id}>

                  <td style={styles.td}>
                    {po.po_number}
                  </td>

                  <td style={styles.td}>
                    {po.vendor_name}
                  </td>

                  <td style={styles.td}>
                    {po.po_date}
                  </td>

                  <td style={styles.td}>
                    {po.delivery_date}
                  </td>

                  <td style={styles.td}>
                    ₹ {po.grand_total}
                  </td>

                  <td style={styles.td}>

                    <div
                      style={styles.actionContainer}
                    >

                      <button
                        style={styles.editButton}
                        onClick={() =>
                          navigate(
                            `/po/edit/${po.id}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() =>
                          deletePO(po.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={styles.empty}
                >
                  No Purchase Orders Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

const styles = {

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "5px",
    color: "#6b7280",
  },

  addButton: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom:
      "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "14px",
  },

  td: {
    padding: "14px",
    borderBottom:
      "1px solid #f3f4f6",
    fontSize: "14px",
  },

  actionContainer: {
    display: "flex",
    gap: "10px",
  },

  editButton: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },

  deleteButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#9ca3af",
  },
};