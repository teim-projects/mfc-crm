import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../api";

import Sidebar from "../../components/Sidebar";

export default function Products() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts = async () => {

    try {

      const res = await API.get(
        "/inventory/products/"
      );

      setProducts(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(
        `/inventory/products/delete/${id}/`
      );

      alert("Product Deleted");

      fetchProducts();

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <Sidebar>

      {/* HEADER */}
      <div style={styles.header}>

        <div>

          <h2 style={styles.title}>
            Products
          </h2>

          <p style={styles.subtitle}>
            Manage inventory products
          </p>

        </div>

        <button
          style={styles.addButton}
          onClick={() =>
            navigate("/products/add")
          }
        >
          + Add Product
        </button>

      </div>

      {/* TABLE */}
      <div style={styles.card}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>
                Product
              </th>

              <th style={styles.th}>
                Code
              </th>

              <th style={styles.th}>
                Type
              </th>

              <th style={styles.th}>
                Course Type
              </th>

              <th style={styles.th}>
                Level
              </th>

              <th style={styles.th}>
                Price
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

            {products.length > 0 ? (

              products.map((product) => (

                <tr key={product.id}>

                  <td style={styles.td}>
                    {product.product_name}
                  </td>

                  <td style={styles.td}>
                    {product.product_code}
                  </td>

                  <td style={styles.td}>
                    {product.product_type}
                  </td>

                  <td style={styles.td}>
  {product.course_type_name}
</td>

<td style={styles.td}>
  {product.course_level}
</td>

                  <td style={styles.td}>
                    ₹ {product.unit_price}
                  </td>

                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          product.is_active
                            ? "#dcfce7"
                            : "#fee2e2",

                        color:
                          product.is_active
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {product.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td style={styles.td}>

                    <div style={styles.actionContainer}>

                      <button
                        style={styles.editButton}
                        onClick={() =>
                          navigate(
                            `/products/edit/${product.id}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteButton}
                        onClick={() =>
                          deleteProduct(product.id)
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
                  colSpan="8"
                  style={styles.empty}
                >
                  No products found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </Sidebar>
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
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "14px",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
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