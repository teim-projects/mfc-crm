import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function Courses() {

  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {

      const res = await API.get("/info/courses/");
      setCourses(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/info/courses/delete/${id}/`);

      alert("Course Deleted");

      fetchCourses();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sidebar>

      {/* HEADER */}
      <div style={styles.header}>

        <div>
          <h2 style={styles.title}>Courses</h2>
          <p style={styles.subtitle}>
            Manage all Vedic Maths & Abacus courses
          </p>
        </div>

        <button
          style={styles.button}
          onClick={() => navigate("/courses/add")}
        >
          + Add Course
        </button>

      </div>

      {/* TABLE */}
      <div style={styles.card}>

        <table style={styles.table}>

          <thead>
            <tr>
              <th style={styles.th}>Course Type</th>
              <th style={styles.th}>Level</th>
              <th style={styles.th}>tuition_Fees</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>

            {courses.map((course) => (

              <tr key={course.id}>

                <td style={styles.td}>
                  {course.course_type === "vedic_maths"
                    ? "Vedic Maths"
                    : "Abacus"}
                </td>

                <td style={styles.td}>{course.level}</td>

                <td style={styles.td}>
                  ₹ {course.tuition_fees}
                </td>

                <td style={styles.td}>
                  {course.duration}
                </td>

                <td style={styles.td}>

                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      navigate(`/courses/edit/${course.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

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

  button: {
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
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f3f4f6",
  },

  editBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    marginRight: "10px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};