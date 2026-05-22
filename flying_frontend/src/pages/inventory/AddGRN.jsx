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

export default function AddGRN() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [poList, setPoList] =
    useState([]);

  const [formData, setFormData] =
    useState({

      purchase_order: "",

      vendor: "",

      vendor_name: "",

      grn_number:
        `GRN-${Date.now()}`,

      grn_date: "",

      status: "completed",

      remarks: "",

      items: [],
    });

  // =====================================
  // FETCH PO LIST
  // =====================================

  const fetchPO = async () => {

    try {

      const res = await API.get(
        "/inventory/po/"
      );

      setPoList(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================
  // FETCH SINGLE GRN
  // =====================================

  const fetchGRN = async () => {

    try {

      const res = await API.get(
        `/inventory/grn/${id}/`
      );

      setFormData(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchPO();

    if (id) {

      fetchGRN();
    }

  }, [id]);

  // =====================================
  // SELECT PO
  // =====================================

  const handlePOChange = async (e) => {

    const poId = e.target.value;

    try {

      const res = await API.get(
        `/inventory/po/${poId}/`
      );

      setFormData({

        ...formData,

        purchase_order: poId,

        vendor: res.data.vendor,

        vendor_name:
          res.data.vendor_name,

        items: res.data.items.map(
          (item) => ({

            product:
              item.product,

            product_name:
              item.product_name,

            ordered_qty:
              item.quantity,

            received_qty:
              item.quantity,

            accepted_qty:
              item.quantity,

            damaged_qty: 0,

            unit:
              item.unit,

            rate:
              item.rate,

            gst_percent:
              item.gst_percent,

            amount:
              item.amount,

            remarks: "",
          })
        ),
      });

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================
  // HANDLE ITEM
  // =====================================

  const handleItemChange = (
    index,
    field,
    value
  ) => {

    const updatedItems =
      [...formData.items];

    updatedItems[index][field] =
      value;

    updatedItems[index]
      .accepted_qty =

      updatedItems[index]
        .received_qty -

      updatedItems[index]
        .damaged_qty;

    setFormData({

      ...formData,

      items: updatedItems,
    });
  };

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

        items:
          formData.items.map(
            (item) => ({

              product:
                Number(item.product),

              ordered_qty:
                Number(
                  item.ordered_qty
                ),

              received_qty:
                Number(
                  item.received_qty
                ),

              accepted_qty:
                Number(
                  item.accepted_qty
                ),

              damaged_qty:
                Number(
                  item.damaged_qty
                ),

              unit:
                item.unit,

              rate:
                Number(item.rate),

              gst_percent:
                Number(
                  item.gst_percent
                ),

              amount:
                Number(item.amount),

              remarks:
                item.remarks,
            })
          ),
      };

      if (id) {

        await API.put(
          `/inventory/grn/update/${id}/`,
          payload
        );

        alert(
          "GRN Updated Successfully"
        );

      } else {

        await API.post(
          "/inventory/grn/create/",
          payload
        );

        alert(
          "GRN Created Successfully"
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
            ? "Edit GRN"
            : "Create GRN"}

        </h2>

        <form
          onSubmit={handleSubmit}
        >

          <div style={styles.grid}>

            <select
              value={
                formData.purchase_order
              }
              onChange={
                handlePOChange
              }
              style={styles.input}
            >

              <option value="">
                Select PO
              </option>

              {poList.map((po) => (

                <option
                  key={po.id}
                  value={po.id}
                >
                  {po.po_number}
                </option>

              ))}

            </select>

            <input
              type="text"
              value={
                formData.grn_number
              }
              readOnly
              style={styles.input}
            />


            <input
  type="date"
  value={formData.grn_date}
  onChange={(e) =>
    setFormData({
      ...formData,
      grn_date: e.target.value,
    })
  }
  style={styles.input}
/>

          </div>

          {/* VENDOR */}

          <div style={styles.vendorBox}>

            <h3>
              Vendor:
              {" "}
              {formData.vendor_name || "-"}
            </h3>

          </div>

          {/* TABLE */}

          <table style={styles.table}>

            <thead>

              <tr>

                <th>Product</th>
                <th>Ordered</th>
                <th>Received</th>
                <th>Damaged</th>
                <th>Accepted</th>

              </tr>

            </thead>

            <tbody>

              {formData.items.map(
                (item, index) => (

                  <tr key={index}>

                    <td>
                      {
                        item.product_name
                      }
                    </td>

                    <td>
                      {
                        item.ordered_qty
                      }
                    </td>

                    <td>

                      <input
                        type="number"
                        value={
                          item.received_qty
                        }
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "received_qty",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        style={styles.smallInput}
                      />

                    </td>

                    <td>

                      <input
                        type="number"
                        value={
                          item.damaged_qty
                        }
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "damaged_qty",
                            Number(
                              e.target.value
                            )
                          )
                        }
                        style={styles.smallInput}
                      />

                    </td>

                    <td>
                      {
                        item.accepted_qty
                      }
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          <button
            type="submit"
            style={styles.button}
          >

            {id
              ? "Update GRN"
              : "Save GRN"}

          </button>

        </form>

      </div>

    </Sidebar>
  );
}

const styles = {

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
    marginBottom: "20px",
  },

  input: {
    padding: "12px",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
  },

  vendorBox: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  smallInput: {
    padding: "8px",
    width: "100px",
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