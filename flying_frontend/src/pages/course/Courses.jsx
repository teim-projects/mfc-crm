import { useEffect, useState } from "react";
import API from "../../api";
import Sidebar from "../../components/Sidebar";
import AddCourse from "./AddCourse";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetCourseId, setTargetCourseId] = useState(null);

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

  const handleOpenAddModal = () => {
    setTargetCourseId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    setTargetCourseId(id);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    setTargetCourseId(null);
    fetchCourses();
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
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>Courses Catalogue</h2>
            </div>
            <p style={styles.subtitle}>
              Manage all specialized Vedic Maths & Abacus syllabus levels and dynamic pricing tiers.
            </p>
          </div>

          <button style={styles.primaryButton} onClick={handleOpenAddModal}>
            + Add Course
          </button>
        </div>

        {/* DATA CONTAINER WITH STABLE HORIZONTAL SCROLLER */}
        <div style={styles.tableWrapper}>
          {courses.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Course Type</th>
                  <th style={styles.th}>Academic Level</th>
                  <th style={styles.th}>Tuition Base Fees</th>
                  <th style={styles.th}>Track Duration</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} style={styles.tr}>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                      <span
                        style={{
                          ...styles.typeTag,
                          background: course.course_type === "vedic_maths" ? "#f0f4ff" : "#fef3c7",
                          color: course.course_type === "vedic_maths" ? "#6080E8" : "#d97706",
                        }}
                      >
                        {course.course_type === "vedic_maths" ? "Vedic Maths" : "Abacus"}
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: "600", color: "#475569" }}>
                      {course.level}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.feeBadge}>
                        ₹ {Number(course.tuition_fees || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: "#64748b", fontWeight: "500" }}>
                      {course.duration || "—"}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtonGroup}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleOpenEditModal(course.id)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(course.id)}
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
              <p>No program tracks are found registered within this cluster interface matrix yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* REUSABLE OVERLAY DATA POPUP HOOK */}
      <AddCourse
        isOpen={modalOpen}
        id={targetCourseId}
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
    minWidth: "700px", // Retains perfect column margins on tight phone interfaces
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
  typeTag: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  },
  feeBadge: {
    background: "#f0fdf4",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
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