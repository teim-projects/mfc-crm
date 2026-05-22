import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import AddStudent from "./AddStudent";

export default function Students() {
  const { schoolId } = useParams();
  const [students, setStudents] = useState([]);
  const [school, setSchool] = useState(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState(null);

  useEffect(() => {
    fetchSchool();
    fetchStudents();
  }, [schoolId]);

  const fetchSchool = async () => {
    try {
      const res = await API.get(`/info/schools/${schoolId}/`);
      setSchool(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get(`/info/students/?school=${schoolId}`);
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenAddModal = () => {
    setTargetStudentId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setTargetStudentId(id);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setTargetStudentId(null);
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/info/students/delete/${id}/`);
      alert("Student Deleted");
      fetchStudents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>Students Roster</h2>
            </div>
            <p style={styles.subtitle}>
              Current Institution: <span style={{ fontWeight: "600", color: "#6080E8" }}>{school?.school_name || "Loading..."}</span>
            </p>
          </div>

          <button style={styles.primaryButton} onClick={handleOpenAddModal}>
            + Add Student
          </button>
        </div>

        {/* DATA SHEET LAYER CONTAINER */}
        <div style={styles.tableWrapper}>
          {students.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Course Track</th>
                  <th style={styles.th}>Level Term</th>
                  <th style={styles.th}>Guardian</th>
                  <th style={styles.th}>Contact Connection</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                      <div style={styles.nameSection}>
                        <div style={styles.avatar}>
                          {student.student_name ? student.student_name.charAt(0).toUpperCase() : "S"}
                        </div>
                        {student.student_name}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.courseBadge}>
                        {student.course_name || "General Program"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.levelMarker}>Lvl {student.level}</span>
                    </td>
                    <td style={styles.td}>{student.parent_name || "—"}</td>
                    <td style={styles.td}>{student.parent_contact || "—"}</td>
                    <td style={styles.td}>
                      <div style={styles.actionButtonGroup}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleOpenEditModal(student.id)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => deleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
              <p>No student enrollment sheets match this academy index reference yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* OVERLAY POPUP HOOK */}
      <AddStudent
        isOpen={modalOpen}
        schoolId={schoolId}
        id={targetStudentId}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </Sidebar>
  );
}

const styles = {
  container: {
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  },
  titleSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  headingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  verticalLine: {
    width: "4px",
    height: "24px",
    backgroundColor: "#6080E8",
    borderRadius: "2px",
    flexShrink: 0,
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    paddingLeft: "14px",
  },
  primaryButton: {
    background: "#6080E8",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
    textAlign: "center",
  },
  tableWrapper: {
    width: "100%",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px", // Maintains perfect full line row parameters across dynamic displays
  },
  th: {
    background: "#f8fafc",
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s ease",
  },
  td: {
    padding: "12px 20px",
    fontSize: "14px",
    color: "#334155",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  },
  nameSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#f0f4ff",
    color: "#6080E8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "bold",
    flexShrink: 0,
  },
  courseBadge: {
    background: "#f0f4ff",
    color: "#6080E8",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  levelMarker: {
    color: "#475569",
    fontWeight: "600",
    fontSize: "13px",
  },
  actionButtonGroup: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    background: "#fff",
    color: "#6080E8",
    border: "1px solid #6080E8",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "5px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#64748b",
  },
};