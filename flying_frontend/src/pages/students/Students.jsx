import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function Students() {

  const { schoolId } = useParams();

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [school, setSchool] = useState(null);

  useEffect(() => {

    fetchSchool();
    fetchStudents();

  }, []);

  const fetchSchool = async () => {

    try {

      const res = await API.get(
        `/info/schools/${schoolId}/`
      );

      setSchool(res.data);

    } catch (err) {

      console.log(err);
    }
  };


  const deleteStudent = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(
      `/info/students/delete/${id}/`
    );

    alert("Student Deleted");

    fetchStudents();

  } catch (err) {

    console.log(err);
  }
};

  const fetchStudents = async () => {

    try {

      const res = await API.get(
        `/info/students/?school=${schoolId}`
      );

      setStudents(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  return (
    <Sidebar>

      <div style={styles.header}>

        <div>
          <h2 style={styles.title}>
            Students
          </h2>

          <p style={styles.subtitle}>
            {school?.school_name}
          </p>
        </div>

        <button
          style={styles.button}
          onClick={() =>
            navigate(
              `/schools/${schoolId}/students/add`
            )
          }
        >
          + Add Student
        </button>

      </div>

      <div style={styles.card}>

        <table style={styles.table}>

          <thead>

            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Level</th>
              <th style={styles.th}>Parent</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Actions</th>
            </tr>

          </thead>

         <tbody>

  {students.length > 0 ? (

    students.map((student) => (

      <tr key={student.id}>

        <td style={styles.td}>
          {student.student_name}
        </td>

        <td style={styles.td}>
          {student.course_name}
        </td>

        <td style={styles.td}>
          {student.level}
        </td>

        <td style={styles.td}>
          {student.parent_name}
        </td>

        <td style={styles.td}>
          {student.parent_contact}
        </td>

        {/* ACTIONS */}
        <td style={styles.td}>

          <div style={styles.actionContainer}>

            <button
              style={styles.editButton}
              onClick={() =>
                navigate(`/students/edit/${student.id}`)
              }
            >
              Edit
            </button>

            <button
              style={styles.deleteButton}
              onClick={() =>
                deleteStudent(student.id)
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
        No students found
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
    color: "#6b7280",
  },

  button: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
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
};