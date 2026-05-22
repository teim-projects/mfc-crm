import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../api";

import Sidebar from "../../components/Sidebar";

export default function AllStudents() {

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const res = await API.get(
        "/info/students/"
      );

      setStudents(res.data);

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

      alert("Student Deleted Successfully");

      fetchStudents();

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
            Students
          </h2>

          <p style={styles.subtitle}>
            Manage all academy students
          </p>

        </div>

      </div>

      {/* TABLE */}
      <div style={styles.card}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={styles.th}>
                Student Name
              </th>

              <th style={styles.th}>
                School
              </th>

              <th style={styles.th}>
                Course
              </th>

              <th style={styles.th}>
                Level
              </th>

              <th style={styles.th}>
                Parent
              </th>

              <th style={styles.th}>
                Contact
              </th>

              <th style={styles.th}>
                RTE
              </th>

              <th style={styles.th}>
                Actions
              </th>

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
                    {student.school_name}
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

                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.rteBadge,
                        background: student.rte
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: student.rte
                          ? "#166534"
                          : "#991b1b",
                      }}
                    >
                      {student.rte ? "YES" : "NO"}
                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td style={styles.td}>

                    <div style={styles.actionContainer}>

                      <button
                        style={styles.editButton}
                        onClick={() =>
                          navigate(
                            `/students/edit/${student.id}`
                          )
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
                  colSpan="8"
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

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    overflowX: "auto",
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
    background: "#f9fafb",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#9ca3af",
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
    fontWeight: "600",
  },

  deleteButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  rteBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
};