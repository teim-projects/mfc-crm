import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function AddSchool() {
  const navigate = useNavigate();
const { id } = useParams();

  const [formData, setFormData] = useState({
    school_name: "",
    owner_name: "",
    email: "",
    address: "",
    contact_person: "",
    mobile_number: "",
    contact_person_no: "",
    fees_taken_from: "parents",
    coordinator_name: "",
    coordinator_number: "",
    landline_number: "",
  });

  useEffect(() => {
  if (id) {
    fetchSchool();
  }
}, [id]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const fetchSchool = async () => {
  try {
    const res = await API.get(`/info/schools/${id}/`);
    setFormData(res.data);
  } catch (err) {
    console.log(err);
  }
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    if (id) {
      await API.put(`/info/schools/update/${id}/`, formData);

      alert("School Updated Successfully ✨");

    } else {
      await API.post("/info/schools/create/", formData);

      alert("School Added Successfully 🚀");
    }

    navigate("/schools");

  } catch (err) {
    console.log(err.response.data);
    alert("Something went wrong");
  }
};

  

  return (
    <Sidebar>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>
  {id ? "Edit School" : "Add School"}
</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
  type="text"
  name="school_name"
  value={formData.school_name}
  onChange={handleChange}
  placeholder="School Name"
  style={styles.input}
/>

<input
  type="text"
  name="owner_name"
  value={formData.owner_name}
  onChange={handleChange}
  placeholder="Owner Name"
  style={styles.input}
/>

<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Email"
  style={styles.input}
/>

<input
  type="text"
  name="address"
  value={formData.address}
  onChange={handleChange}
  placeholder="Address"
  style={styles.input}
/>

<input
  type="text"
  name="contact_person"
  value={formData.contact_person}
  onChange={handleChange}
  placeholder="Contact Person"
  style={styles.input}
/>




<input
  type="text"
  name="mobile_number"
  value={formData.mobile_number}
  onChange={handleChange}
  placeholder="Mobile Number"
  style={styles.input}
/>

<input
  type="text"
  name="contact_person_no"
  value={formData.contact_person_no}
  onChange={handleChange}
  placeholder="Contact Person Number"
  style={styles.input}
/>




<input
  type="text"
  name="coordinator_name"
  value={formData.coordinator_name}
  onChange={handleChange}
  placeholder="Coordinator Name"
  style={styles.input}
/>

<input
  type="text"
  name="coordinator_number"
  value={formData.coordinator_number}
  onChange={handleChange}
  placeholder="Coordinator Number"
  style={styles.input}
/>

<input
  type="text"
  name="landline_number"
  value={formData.landline_number}
  onChange={handleChange}
  placeholder="Landline Number"
  style={styles.input}
/>


<div style={styles.radioContainer}>

  <label style={styles.radioLabel}>

    <input
      type="radio"
      name="fees_taken_from"
      value="parents"
      checked={
        formData.fees_taken_from === "parents"
      }
      onChange={handleChange}
    />

    Tuition fees will be taken from Parents

  </label>

  <label style={styles.radioLabel}>

    <input
      type="radio"
      name="fees_taken_from"
      value="school"
      checked={
        formData.fees_taken_from === "school"
      }
      onChange={handleChange}
    />

    Tuition fees will be taken from School

  </label>

</div>

          <button type="submit" style={styles.button}>
          {id ? "Update School" : "Save School"}
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
  },

  radioContainer: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
},

radioLabel: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
  color: "#374151",
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