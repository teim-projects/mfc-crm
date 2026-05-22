import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../api";

export default function Vendors() {

  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);

  useEffect(() => {

    fetchVendors();

  }, []);

  const fetchVendors = async () => {

    try {

      const res = await API.get(
        "/inventory/vendors/"
      );

      setVendors(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================
  // DELETE VENDOR
  // =====================================

  const deleteVendor = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/inventory/vendors/delete/${id}/`
      );

      alert("Vendor Deleted");

      fetchVendors();

    } catch (err) {

      console.log(err);

      alert("Delete failed");
    }
  };

  return (

    <div>

      {/* HEADER */}
      <div style={styles.header}>

        <div>

          <h2 style={styles.title}>
            Vendors
          </h2>

          <p style={styles.subtitle}>
            Manage vendors
          </p>

        </div>

        <button
          style={styles.addButton}
          onClick={() =>
            navigate("/vendors/add")
          }
        >
          + Add Vendor
        </button>

      </div>

      {/* TABLE */}
      <div style={styles.card}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>
                Vendor
              </th>

              <th style={styles.th}>
                Mobile
              </th>

              <th style={styles.th}>
                Email
              </th>

              <th style={styles.th}>
                GST
              </th>

              <th style={styles.th}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {vendors.map((vendor) => (

              <tr key={vendor.id}>

                <td style={styles.td}>
                  {vendor.vendor_name}
                </td>

                <td style={styles.td}>
                  {vendor.phone}
                </td>

                <td style={styles.td}>
                  {vendor.email}
                </td>

                <td style={styles.td}>
                  {vendor.gst_number}
                </td>

                <td style={styles.td}>

                  <div style={styles.actionContainer}>

                    {/* EDIT */}
                    <button
                      style={styles.editButton}
                      onClick={() =>
                        navigate(
                          `/vendors/edit/${vendor.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        deleteVendor(vendor.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

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
  },

  subtitle: {
    marginTop: "5px",
    color: "#6b7280",
  },

  addButton: {
    background: "#3b82f6",
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
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f3f4f6",
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
  },

  deleteButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};