import { useEffect, useState } from "react";
import API from "../../api";

export default function AddStudent({ isOpen, schoolId, id, onClose, onSuccess }) {
  const [studentSchoolId, setStudentSchoolId] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courseType, setCourseType] = useState("");

  const [formData, setFormData] = useState({
    student_name: "",
    school: schoolId,
    course: "",
    level: "",
    parent_name: "",
    parent_contact: "",
    parent_email: "",
    parent_address: "",
    rte: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [id, isOpen, schoolId]);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/info/courses/");
      setAllCourses(res.data);

      if (id) {
        const studentRes = await API.get(`/info/students/${id}/`);
        const studentData = studentRes.data;

        setFormData(studentData);
        setStudentSchoolId(studentData.school);

        const selectedCourse = res.data.find(
          (course) => course.id === studentData.course
        );

        if (selectedCourse) {
          setCourseType(selectedCourse.course_type);
          const filtered = res.data.filter(
            (course) => course.course_type === selectedCourse.course_type
          );
          setFilteredCourses(filtered);
        }
      } else {
        // Reset state variables for creating a new profile entry record
        setFormData({
          student_name: "",
          school: schoolId,
          course: "",
          level: "",
          parent_name: "",
          parent_contact: "",
          parent_email: "",
          parent_address: "",
          rte: false,
        });
        setCourseType("");
        setFilteredCourses([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course_type") {
      setCourseType(value);
      const filtered = allCourses.filter((course) => course.course_type === value);
      setFilteredCourses(filtered);
      setFormData({
        ...formData,
        course: "",
        level: "",
      });
      return;
    }

    if (name === "course") {
      const selectedCourse = allCourses.find((course) => course.id == value);
      setFormData({
        ...formData,
        course: value,
        level: selectedCourse?.level || "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/info/students/update/${id}/`, formData);
        alert("Student Updated Successfully ✨");
      } else {
        await API.post("/info/students/create/", { ...formData, school: schoolId });
        alert("Student Added Successfully 🚀");
      }
      onSuccess();
    } catch (err) {
      console.log(err.response?.data);
      alert("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.titleWrapper}>
            <h2 style={styles.title}>{id ? "Edit Student Profile" : "Register New Student"}</h2>
            <p style={styles.subtitle}>Configure structural path files and contact credentials.</p>
          </div>
          <button style={styles.closeX} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            
            {/* STUDENT SECTION */}
            <div style={{ ...styles.inputContainer, gridColumn: "span 2" }}>
              <label style={styles.fieldLabel}>Student Full Name *</label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name || ""}
                placeholder="Alex Mercer"
                style={styles.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Course Program *</label>
              <select
                name="course_type"
                value={courseType}
                style={styles.select}
                onChange={handleChange}
                required
              >
                <option value="">Select Course Type</option>
                <option value="vedic_maths">Vedic Maths</option>
                <option value="abacus">Abacus</option>
              </select>
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Assigned Level Term *</label>
              <select
                name="course"
                value={formData.course || ""}
                style={styles.select}
                onChange={handleChange}
                required
              >
                <option value="">Select Course Level</option>
                {filteredCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_type} - Level {course.level}
                  </option>
                ))}
              </select>
            </div>

            {/* PARENTAL INFO */}
            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Parent/Guardian Name</label>
              <input
                type="text"
                name="parent_name"
                value={formData.parent_name || ""}
                placeholder="Robert Mercer"
                style={styles.input}
                onChange={handleChange}
              />
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.fieldLabel}>Primary Contact Phone</label>
              <input
                type="text"
                name="parent_contact"
                value={formData.parent_contact || ""}
                placeholder="Contact Number"
                style={styles.input}
                onChange={handleChange}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: "span 2" }}>
              <label style={styles.fieldLabel}>Parent Email Address</label>
              <input
                type="email"
                name="parent_email"
                value={formData.parent_email || ""}
                placeholder="guardian@domain.com"
                style={styles.input}
                onChange={handleChange}
              />
            </div>

            <div style={{ ...styles.inputContainer, gridColumn: "span 2" }}>
              <label style={styles.fieldLabel}>Home Address Data</label>
              <textarea
                name="parent_address"
                value={formData.parent_address || ""}
                placeholder="Street address details..."
                style={styles.textarea}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.checkboxWrapper}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="rte"
                checked={formData.rte || false}
                onChange={(e) => setFormData({ ...formData, rte: e.target.checked })}
                style={styles.checkboxInput}
              />
              RTE (Right To Education) Admission Status Allocation
            </label>
          </div>

          <div style={styles.actionRow}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              {id ? "Update Profile" : "Save Student Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
    boxSizing: "border-box",
  },
  modalCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "16px",
    marginBottom: "20px",
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  closeX: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#94a3b8",
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: "1",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: window.innerWidth <= 600 ? "1fr" : "1fr 1fr",
    gap: "14px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    gridColumn: window.innerWidth <= 600 ? "span 2" : "initial",
  },
  fieldLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    color: "#334155",
    boxSizing: "border-box",
    width: "100%",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    color: "#334155",
    boxSizing: "border-box",
    width: "100%",
    background: "#fff",
    cursor: "pointer",
  },
  textarea: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    color: "#334155",
    boxSizing: "border-box",
    width: "100%",
    minHeight: "80px",
    resize: "vertical",
  },
  checkboxWrapper: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#334155",
    cursor: "pointer",
    fontWeight: "500",
  },
  checkboxInput: {
    accentColor: "#6080E8",
    margin: 0,
    width: "16px",
    height: "16px",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
  },
  cancelBtn: {
    background: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  submitBtn: {
    background: "#6080E8",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)",
  },
};