import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import API from "../../api";

import Sidebar from "../../components/Sidebar";

export default function AddPO() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [vendors, setVendors] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [formData, setFormData] =
    useState({

      vendor: "",

      po_number:
        `PO-${Date.now()}`,

      po_date: "",

      delivery_date: "",

      payment_terms: "",

      remarks: "",

     items: [],
    });


    const [currentItem, setCurrentItem] =
  useState({

    product: "",
    quantity: 1,
    unit: "PCS",
    rate: 0,
    gst_percent: 18,
    amount: 0,
    remarks: "",
  });

  // =====================================
  // FETCH VENDORS
  // =====================================

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
  // FETCH PRODUCTS
  // =====================================

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

  // =====================================
  // FETCH PO
  // =====================================

  const fetchPO = async () => {

    try {

      const res = await API.get(
        `/inventory/po/${id}/`
      );

      setFormData({

        vendor: res.data.vendor,

        po_number:
          res.data.po_number,

        po_date:
          res.data.po_date,

        delivery_date:
          res.data.delivery_date,

        payment_terms:
          res.data.payment_terms,

        remarks:
          res.data.remarks || "",

        items: res.data.items.map(
          (item) => ({

            product:
              item.product,

            quantity:
              item.quantity,

            unit:
              item.unit,

            rate:
              item.rate,

            gst_percent:
              item.gst_percent,

            amount:
              item.amount,

            remarks:
              item.remarks || "",
          })
        ),
      });

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchVendors();

    fetchProducts();

    if (id) {

      fetchPO();
    }

  }, [id]);

  // =====================================
  // HANDLE HEADER
  // =====================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // =====================================
  // HANDLE ITEMS
  // =====================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {

    const updatedItems = [
      ...formData.items,
    ];

    updatedItems[index][field] =
      value;

    const qty = parseFloat(
      updatedItems[index].quantity
    ) || 0;

    const rate = parseFloat(
      updatedItems[index].rate
    ) || 0;

    updatedItems[index].amount =
      qty * rate;

    setFormData({

      ...formData,

      items: updatedItems,
    });
  };

  // =====================================
  // ADD ROW
  // =====================================

const handleCurrentItemChange = (
  field,
  value
) => {

  const updatedItem = {

    ...currentItem,

    [field]: value,
  };

  const qty =
    parseFloat(
      updatedItem.quantity
    ) || 0;

  const rate =
    parseFloat(
      updatedItem.rate
    ) || 0;

  updatedItem.amount =
    qty * rate;

  setCurrentItem(updatedItem);
};

// =====================================
// ADD ITEM TO TABLE
// =====================================

const addItemToTable = () => {

  if (!currentItem.product) {

    alert("Select Product");

    return;
  }

  setFormData({

    ...formData,

    items: [
      ...formData.items,
      currentItem,
    ],
  });

  // RESET ROW
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

// =====================================
// REMOVE ITEM
// =====================================

const removeItem = (index) => {

  const updatedItems =
    formData.items.filter(
      (_, i) => i !== index
    );

  setFormData({

    ...formData,

    items: updatedItems,
  });
};

  // =====================================
  // TOTALS
  // =====================================

  const subtotal =
    formData.items.reduce(
      (acc, item) =>
        acc +
        Number(item.amount),
      0
    );

  const gstTotal =
    formData.items.reduce(
      (acc, item) =>
        acc +
        (
          item.amount *
          item.gst_percent
        ) / 100,
      0
    );

  const grandTotal =
    subtotal + gstTotal;

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      const payload = {

        ...formData,

        subtotal,

        gst_total:
          gstTotal,

        grand_total:
          grandTotal,
      };

      if (id) {

        await API.put(
          `/inventory/po/update/${id}/`,
          payload
        );

        alert(
          "PO Updated Successfully"
        );

      } else {

        await API.post(
          "/inventory/po/create/",
          payload
        );

        alert(
          "PO Created Successfully"
        );
      }

      navigate("/inventory");

    } catch (err) {

      console.log(
        err.response?.data
      );

      alert(
        "Something went wrong"
      );
    }
  };

  return (

    <Sidebar>

      <div style={styles.wrapper}>

        <h2 style={styles.title}>

          {id
            ? "Edit Purchase Order"
            : "Create Purchase Order"}

        </h2>

        <form
          onSubmit={handleSubmit}
        >

          {/* HEADER */}

          <div style={styles.grid}>

            <select
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              style={styles.input}
            >

              <option value="">
                Select Vendor
              </option>

              {vendors.map(
                (vendor) => (

                  <option
                    key={vendor.id}
                    value={vendor.id}
                  >
                    {vendor.vendor_name}
                  </option>
                )
              )}

            </select>

            <input
              type="text"
              name="po_number"
              value={formData.po_number}
              readOnly
              style={styles.input}
            />

            <input
              type="date"
              name="po_date"
              value={formData.po_date}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="date"
              name="delivery_date"
              value={
                formData.delivery_date
              }
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="text"
              name="payment_terms"
              value={
                formData.payment_terms
              }
              onChange={handleChange}
              placeholder="Payment Terms"
              style={styles.input}
            />

          </div>
{/* ITEMS */}

<div style={{ marginTop: "30px" }}>

  {/* SINGLE ENTRY ROW */}

  <div style={styles.itemRow}>

    <select
      value={currentItem.product}
      onChange={(e) =>
        handleCurrentItemChange(
          "product",
          e.target.value
        )
      }
      style={styles.input}
    >

      <option value="">
        Select Product
      </option>

      {products.map((product) => (

        <option
          key={product.id}
          value={product.id}
        >
          {product.product_name}
        </option>
      ))}

    </select>

    <input
      type="number"
      value={currentItem.quantity}
      onChange={(e) =>
        handleCurrentItemChange(
          "quantity",
          e.target.value
        )
      }
      style={styles.input}
    />

    <input
      type="text"
      value={currentItem.unit}
      onChange={(e) =>
        handleCurrentItemChange(
          "unit",
          e.target.value
        )
      }
      style={styles.input}
    />

    <input
      type="number"
      value={currentItem.rate}
      onChange={(e) =>
        handleCurrentItemChange(
          "rate",
          e.target.value
        )
      }
      style={styles.input}
    />

    <input
      type="number"
      value={currentItem.gst_percent}
      onChange={(e) =>
        handleCurrentItemChange(
          "gst_percent",
          e.target.value
        )
      }
      style={styles.input}
    />

    <button
      type="button"
      onClick={addItemToTable}
      style={styles.addButton}
    >
      Add
    </button>

  </div>

  {/* TABLE */}

  <table style={styles.table}>

    <thead>

      <tr>

        <th style={styles.th}>
          Product
        </th>

        <th style={styles.th}>
          Qty
        </th>

        <th style={styles.th}>
          Unit
        </th>

        <th style={styles.th}>
          Rate
        </th>

        <th style={styles.th}>
          GST %
        </th>

        <th style={styles.th}>
          Amount
        </th>

        <th style={styles.th}>
          Action
        </th>

      </tr>

    </thead>

    <tbody>

      {formData.items.map(
        (item, index) => {

          const product =
            products.find(
              (p) =>
                p.id ==
                item.product
            );

          return (

            <tr key={index}>

              <td style={styles.td}>
                {product?.product_name}
              </td>

              <td style={styles.td}>

                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                  style={styles.tableInput}
                />

              </td>

              <td style={styles.td}>

                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "unit",
                      e.target.value
                    )
                  }
                  style={styles.tableInput}
                />

              </td>

              <td style={styles.td}>

                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "rate",
                      e.target.value
                    )
                  }
                  style={styles.tableInput}
                />

              </td>

              <td style={styles.td}>

                <input
                  type="number"
                  value={
                    item.gst_percent
                  }
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "gst_percent",
                      e.target.value
                    )
                  }
                  style={styles.tableInput}
                />

              </td>

              <td style={styles.td}>
                ₹ {item.amount}
              </td>

              <td style={styles.td}>

                <button
                  type="button"
                  onClick={() =>
                    removeItem(index)
                  }
                  style={
                    styles.deleteButton
                  }
                >
                  ✕
                </button>

              </td>

            </tr>
          );
        }
      )}

    </tbody>

  </table>

</div>

          {/* TOTALS */}

          <div style={styles.totalBox}>

            <h3>
              Subtotal:
              ₹ {subtotal.toFixed(2)}
            </h3>

            <h3>
              GST:
              ₹ {gstTotal.toFixed(2)}
            </h3>

            <h2>
              Grand Total:
              ₹ {grandTotal.toFixed(2)}
            </h2>

          </div>

          <button
            type="submit"
            style={styles.button}
          >

            {id
              ? "Update PO"
              : "Save PO"}

          </button>

        </form>

      </div>

    </Sidebar>
  );
}

const styles = {



  table: {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "25px",
},

th: {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #d1d5db",
  background: "#f8fafc",
},

td: {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
},

tableInput: {
  width: "100%",
  padding: "8px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
},

deleteButton: {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
},

  wrapper: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
  },

  title: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  input: {
    padding: "12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
  },

  itemRow: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "15px",
  },

  addButton: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  totalBox: {
    marginTop: "30px",
    textAlign: "right",
  },

  button: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer",
  },
};