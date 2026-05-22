import {
  useEffect,
  useState
} from "react";

import { useNavigate }
from "react-router-dom";

import API from "../../api";

export default function GRN() {

  const navigate = useNavigate();

  const [grns, setGrns] =
    useState([]);

  useEffect(() => {

    fetchGRN();

  }, []);

  const fetchGRN = async () => {

    try {

      const res = await API.get(
        "/inventory/grn/"
      );

      setGrns(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this GRN?"
      );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/inventory/grn/delete/${id}/`
      );

      alert(
        "GRN Deleted Successfully"
      );

      fetchGRN();

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <div>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <h2 style={styles.title}>
            GRN
          </h2>

          <p style={styles.subtitle}>
            Goods Receive Notes
          </p>

        </div>

        <button
          style={styles.addButton}
          onClick={() =>
            navigate("/grn/add")
          }
        >
          + Create GRN
        </button>

      </div>

      {/* TABLE */}

      <div style={styles.card}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>
                GRN No
              </th>

              <th style={styles.th}>
                PO Number
              </th>

              <th style={styles.th}>
                Vendor
              </th>

              <th style={styles.th}>
                GRN Date
              </th>

              <th style={styles.th}>
                Status
              </th>

              <th style={styles.th}>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {grns.map((grn) => (

              <tr key={grn.id}>

                <td style={styles.td}>
                  {grn.grn_number}
                </td>

                <td style={styles.td}>
                  {grn.po_number}
                </td>

                <td style={styles.td}>
                  {grn.vendor_name}
                </td>

                <td style={styles.td}>
                  {grn.grn_date}
                </td>

                <td style={styles.td}>
                  {grn.status}
                </td>

                <td style={styles.td}>

                  <div style={styles.actionContainer}>

                    <button
                      style={styles.editButton}
                      onClick={() =>
                        navigate(
                          `/grn/edit/${grn.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        handleDelete(grn.id)
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