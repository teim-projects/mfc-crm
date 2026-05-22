import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function AddCourse() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    course_type: "",
    level: "",
    tuition_fees: "",
    duration: "",
    description: "",
  });

  useEffect(() => {

    if (id) {
      fetchCourse();
    }

  }, [id]);

  const fetchCourse = async () => {

    try {

      const res = await API.get(`/info/courses/${id}/`);

      setFormData(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (id) {

        await API.put(`/info/courses/update/${id}/`, formData);

        alert("Course Updated Successfully ✨");

      } else {

        await API.post("/info/courses/create/", formData);

        alert("Course Added Successfully 🚀");
      }

      navigate("/courses");

    } catch (err) {
      console.log(err.response?.data);
      alert("Something went wrong");
    }
  };

  const getLevels = () => {

  if (formData.course_type === "vedic_maths") {

    return [
      "Level 1",
      "Level 2",
      "Level 3"
    ];
  }

  if (formData.course_type === "abacus") {

    return Array.from(
      { length: 12 },
      (_, i) => `Level ${i + 1}`
    );
  }

  return [];
};

  return (
    <Sidebar>

      <div style={styles.wrapper}>

        <h2 style={styles.title}>
          {id ? "Edit Course" : "Add Course"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          <select
            name="course_type"
            value={formData.course_type}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Course Type</option>
            <option value="vedic_maths">Vedic Maths</option>
            <option value="abacus">Abacus</option>
          </select>

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Level</option>

            {getLevels().map((level, i) => (
              <option
                key={i}
                value={level}
              >
                {level}
              </option>
            ))}

          </select>

          <input
  type="number"
  name="tuition_fees"
  value={formData.tuition_fees}
  onChange={handleChange}
  placeholder="Tuition Fees"
  style={styles.input}
/>

          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration"
            style={styles.input}
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            style={styles.textarea}
          />

          <button type="submit" style={styles.button}>
            {id ? "Update Course" : "Save Course"}
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
    outline: "none",
    minHeight: "120px",
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