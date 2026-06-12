import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API from "../../api";

export default function Promotion() {
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
const [courseTypes, setCourseTypes] = useState([]);
const [filteredCourses, setFilteredCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [schoolId, setSchoolId] = useState("");
  const [courseType, setCourseType] = useState("");
  const [courseId, setCourseId] = useState("");
  const [promoteCourse, setPromoteCourse] = useState("");

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
   fetchSchools();
fetchCourses();
fetchCourseTypes();

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

useEffect(() => {

  if (!courseType) {
    setFilteredCourses([]);
    return;
  }

  const filtered = courses.filter(
    (course) =>
      String(course.course_type) === String(courseType)
  );

  setFilteredCourses(filtered);

  setCourseId("");
  setPromoteCourse("");

}, [courseType, courses]);
  const fetchSchools = async () => {
    try {
      const res = await API.get("/info/schools/");
      setSchools(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("/info/courses/");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourseTypes = async () => {
  try {
    const res = await API.get(
      "/info/course-types/"
    );

    setCourseTypes(res.data);

  } catch (err) {
    console.log(err);
  }
};

  const loadStudents = async () => {
    if (!schoolId || !courseId) {
      alert("Please select school and current course");
      return;
    }

    try {
      const res = await API.get(`/info/students/?school=${schoolId}`);
      const filtered = res.data.filter(
        (student) => String(student.course) === String(courseId)
      );
      setStudents(filtered);
      setSelectedStudents([]); 
    } catch (err) {
      console.log(err);
    }
  };

  const toggleStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((studentId) => studentId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.id));
    }
  };

  const promoteStudents = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select students");
      return;
    }

    if (!promoteCourse) {
      alert("Please select promotion level");
      return;
    }

    try {
      for (const studentId of selectedStudents) {
        await API.post(`/info/students/promote/${studentId}/`, {
          course: promoteCourse,
        });
      }

      alert("Students promoted successfully ✨");
      loadStudents();
    } catch (err) {
      console.log(err);
      alert("Promotion failed");
    }
  };

  const isMobile = windowWidth <= 640;

  return (
    <Sidebar>
      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <div style={styles.headingWrapper}>
              <div style={styles.verticalLine}></div>
              <h2 style={styles.title}>Student Promotion</h2>
            </div>
            <p style={styles.subtitle}>Promote batches or individual students school-wise and level-wise.</p>
          </div>
        </div>

        {/* CONTROLS & FILTER PANELS */}
        <div style={styles.filterBox}>
          <div style={{
            ...styles.filterGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr"
          }}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>School Origin Target</label>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                style={styles.select}
              >
                <option value="">Select School</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Academic Course Type</label>
              <select
  value={courseType}
  onChange={(e) =>
    setCourseType(e.target.value)
  }
  style={styles.select}
>
  <option value="">
    Course Type
  </option>

  {courseTypes.map((type) => (
    <option
      key={type.id}
      value={type.id}
    >
      {type.name}
    </option>
  ))}
</select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Current Active Level</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                style={styles.select}
              >
                <option value="">Current Level</option>
                {filteredCourses.map((course) => (
  <option
    key={course.id}
    value={course.id}
  >
    {course.level_name}
  </option>
))}
                
              </select>
            </div>
          </div>

          <button 
            type="button" 
            style={{ 
              ...styles.primaryButton, 
              width: isMobile ? "100%" : "auto", 
              alignSelf: isMobile ? "stretch" : "flex-end",
              whiteSpace: isMobile ? "normal" : "nowrap", // 🌟 Wraps cleanly into two lines on small screens
              padding: isMobile ? "6px 16px" : "10px 20px"  // 🌟 Balance height when text splits
            }} 
            onClick={loadStudents}
          >
            🔍 Load Active Students
          </button>
        </div>

        {/* DATA CONTAINER TABLE CONTAINER */}
        <div style={styles.tableWrapper}>
          {students.length > 0 ? (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: "60px", textAlign: "center" }}>
                    <input 
                      type="checkbox"
                      checked={students.length > 0 && selectedStudents.length === students.length}
                      onChange={toggleAllStudents}
                      style={styles.checkbox}
                    />
                  </th>
                  <th style={styles.th}>Student Details</th>
                  <th style={styles.th}>Parent/Guardian</th>
                  <th style={styles.th}>Current Rank Level</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} style={styles.tr}>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                        style={styles.checkbox}
                      />
                    </td>
                    <td style={{ ...styles.td, fontWeight: "600", color: "var(--text-main)" }}>
                      {student.student_name}
                    </td>
                    <td style={styles.td}>{student.parent_name || "—"}</td>
                    <td style={styles.td}>
                      <span style={styles.levelBadge}>
                        Level {student.level_name || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.emptyState}>
              <p>No active student records matched current parameters. Select a school and level above to fetch records.</p>
            </div>
          )}
        </div>

        {/* BOTTOM GLOBAL PROMOTIONS TRIGGER UNIT */}
        {students.length > 0 && (
          <div style={{
            ...styles.bottomBox,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <div style={{ ...styles.inputGroup, minWidth: isMobile ? "100%" : "260px", margin: 0 }}>
              <label style={styles.label}>Target Promotion Destination Level *</label>
              <select
                value={promoteCourse}
                onChange={(e) => setPromoteCourse(e.target.value)}
                style={styles.select}
              >
                <option value="">Promote To Level...</option>
                {filteredCourses.map((course) => (
  <option
    key={course.id}
    value={course.id}
  >
    {course.level_name}
  </option>
))}
              </select>
            </div>

            <button
              type="button"
              style={{
                ...styles.promoteButton,
                marginTop: isMobile ? "10px" : "18px",
                width: isMobile ? "100%" : "auto"
              }}
              onClick={promoteStudents}
            >
              🚀 Promote Selected ({selectedStudents.length})
            </button>
          </div>
        )}
      </div>
    </Sidebar>
  );
}

const styles = {
  container: { width: "100%", boxSizing: "border-box", padding: "4px" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  titleSection: { display: "flex", flexDirection: "column", gap: "4px" },
  headingWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  verticalLine: { width: "4px", height: "24px", backgroundColor: "#6080E8", borderRadius: "2px", flexShrink: 0 },
  title: { fontSize: "22px", fontWeight: "700", color: "var(--text-main)", margin: 0, lineHeight: "1.2" },
  subtitle: { fontSize: "13px", color: "var(--text-muted)", margin: 0, paddingLeft: "14px" },
  
  /* CARDS FILTER COMPONENT BOX */
  filterBox: { background: "var(--bg-card)", border: "1px solid var(--border-main)", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px var(--shadow-light)", display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" },
  filterGrid: { display: "grid", gap: "12px", width: "100%" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" },
  select: { padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border-main)", fontSize: "14px", color: "var(--text-main)", background: "var(--bg-surface)", outline: "none", cursor: "pointer", width: "100%", boxSizing: "border-box" },
  
  primaryButton: { background: "#6080E8", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", boxShadow: "0 2px 4px rgba(96, 128, 232, 0.15)", boxSizing: "border-box", minHeight: "40px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" },
  
  /* DATA SYSTEM DISPLAY TABLES */
  tableWrapper: { width: "100%", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-main)", boxShadow: "0 1px 3px var(--shadow-light)", overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  th: { background: "var(--bg-table-th)", padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-main)", whiteSpace: "nowrap" },
  tr: { borderBottom: "1px solid var(--border-light)" },
  td: { padding: "14px 20px", fontSize: "14px", color: "var(--text-td)", whiteSpace: "nowrap", verticalAlign: "middle" },
  levelBadge: { display: "inline-block", background: "rgba(96, 128, 232, 0.12)", color: "#7C94F2", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  checkbox: { width: "16px", height: "16px", accentColor: "#6080E8", cursor: "pointer" },
  emptyState: { padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" },
  
  /* FOOTER CONTEXT BOX CONTROLS */
  bottomBox: { background: "var(--bg-card)", border: "1px solid var(--border-main)", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px var(--shadow-light)", display: "flex", gap: "16px", justifyContent: "space-between" },
  promoteButton: { background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", cursor: "pointer", fontWeight: "600", fontSize: "13px", height: "40px", boxShadow: "0 2px 4px rgba(16, 185, 129, 0.15)", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }
};