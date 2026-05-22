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

export default function AddVendor() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [formData, setFormData] = useState({

    vendor_name: "",
    email: "",
    phone: "",
    state: "",
    gst_number: "",
    category: "",
    office_poc: "",
    address: "",

  });

  // =====================================
  // FETCH VENDOR
  // =====================================

  useEffect(() => {

    if (id) {

      fetchVendor();
    }

  }, [id]);

  const fetchVendor = async () => {

    try {

      const res = await API.get(
        `/inventory/vendors/${id}/`
      );

      setFormData({

        vendor_name:
          res.data.vendor_name || "",

        email:
          res.data.email || "",

        phone:
          res.data.phone || "",

        state:
          res.data.state || "",

        gst_number:
          res.data.gst_number || "",

        category:
          res.data.category || "",

        office_poc:
          res.data.office_poc || "",

        address:
          res.data.address || "",
      });

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (id) {

        await API.put(
          `/inventory/vendors/update/${id}/`,
          formData
        );

        alert(
          "Vendor Updated Successfully ✨"
        );

      } else {

        await API.post(
          "/inventory/vendors/create/",
          formData
        );

        alert(
          "Vendor Added Successfully 🚀"
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
            ? "Edit Vendor"
            : "Add Vendor"}

        </h2>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          <input
            type="text"
            name="vendor_name"
            placeholder="Vendor Name"
            value={formData.vendor_name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="gst_number"
            placeholder="GST Number"
            value={formData.gst_number}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="office_poc"
            placeholder="Office POC"
            value={formData.office_poc}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={styles.textarea}
          />

          <button
            type="submit"
            style={styles.button}
          >

            {id
              ? "Update Vendor"
              : "Save Vendor"}

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
    maxWidth: "700px",
  },

  title: {
    marginBottom: "20px",
    fontSize: "28px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
  },

  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    minHeight: "120px",
    outline: "none",
  },

  button: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};