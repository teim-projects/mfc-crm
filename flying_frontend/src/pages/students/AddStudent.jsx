import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function AddStudent() {

  const navigate = useNavigate();
  const [studentSchoolId, setStudentSchoolId] = useState(null);

  const { schoolId, id } = useParams();

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

  fetchCourses();

  if (id) {
    fetchStudent();
  }

}, []);

  // FETCH COURSES
  const fetchCourses = async () => {

  try {

    const res = await API.get("/info/courses/");

    setAllCourses(res.data);

    // edit mode
    if (id) {

      const studentRes = await API.get(
        `/info/students/${id}/`
      );

      const studentData = studentRes.data;

      setFormData(studentData);
      setStudentSchoolId(studentData.school);

      const selectedCourse = res.data.find(
        (course) => course.id === studentData.course
      );

      if (selectedCourse) {

        setCourseType(
          selectedCourse.course_type
        );

        const filtered = res.data.filter(
          (course) =>
            course.course_type === selectedCourse.course_type
        );

        setFilteredCourses(filtered);
      }
    }

  } catch (err) {

    console.log(err);
  }
};


  // FETCH STUDENT
const fetchStudent = async () => {

  try {

    const res = await API.get(
      `/info/students/${id}/`
    );

    const data = res.data;

    setFormData(data);

    // auto select course type
    const selectedCourse = allCourses.find(
      (course) => course.id === data.course
    );

    if (selectedCourse) {

      setCourseType(
        selectedCourse.course_type
      );

      const filtered = allCourses.filter(
        (course) =>
          course.course_type === selectedCourse.course_type
      );

      setFilteredCourses(filtered);
    }

  } catch (err) {

    console.log(err);
  }
};

  // HANDLE CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    // 🚀 COURSE TYPE
    if (name === "course_type") {

      setCourseType(value);

      const filtered = allCourses.filter(
        (course) => course.course_type === value
      );

      setFilteredCourses(filtered);

      setFormData({
        ...formData,
        course: "",
        level: "",
      });

      return;
    }

    // 🚀 COURSE SELECT
    if (name === "course") {

      const selectedCourse = allCourses.find(
        (course) => course.id == value
      );

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

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (id) {

  await API.put(
    `/info/students/update/${id}/`,
    formData
  );

  alert("Student Updated Successfully ✨");

} else {

  await API.post(
    "/info/students/create/",
    formData
  );

  alert("Student Added Successfully 🚀");
}

      navigate(
  `/schools/${studentSchoolId || schoolId}/students`
);

    } catch (err) {

      console.log(err.response?.data);

      alert("Something went wrong");
    }
  };

  return (
    <Sidebar>

      <div style={styles.wrapper}>

      <h2 style={styles.title}>
  {id ? "Edit Student" : "Add Student"}
</h2>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          {/* STUDENT NAME */}
          <input
            type="text"
            name="student_name"
            value={formData.student_name}
            placeholder="Student Name"
            style={styles.input}
            onChange={handleChange}
            required
          />

          {/* COURSE TYPE */}
          <select
            name="course_type"
            value={courseType}
            style={styles.input}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Course Type
            </option>

            <option value="vedic_maths">
              Vedic Maths
            </option>

            <option value="abacus">
              Abacus
            </option>

          </select>

          {/* COURSE */}
          <select
            name="course"
            value={formData.course}
            style={styles.input}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Course
            </option>

            {filteredCourses.map((course) => (

  <option
    key={course.id}
    value={course.id}
  >
    {course.course_type} - {course.level}
  </option>

))}

          </select>

          {/* AUTO LEVEL */}
          <input
            type="text"
            name="level"
            value={formData.level}
            placeholder="Level"
            style={styles.input}
            readOnly
          />

          {/* PARENT NAME */}
          <input
            type="text"
            name="parent_name"
            value={formData.parent_name}
            placeholder="Parent Name"
            style={styles.input}
            onChange={handleChange}
          />

          {/* PARENT CONTACT */}
          <input
            type="text"
            name="parent_contact"
            value={formData.parent_contact}
            placeholder="Parent Contact"
            style={styles.input}
            onChange={handleChange}
          />

          {/* PARENT EMAIL */}
          <input
            type="email"
            name="parent_email"
            value={formData.parent_email}
            placeholder="Parent Email"
            style={styles.input}
            onChange={handleChange}
          />

          {/* PARENT ADDRESS */}
          <textarea
            name="parent_address"
            value={formData.parent_address}
            placeholder="Parent Address"
            style={styles.textarea}
            onChange={handleChange}
          />

          <div style={styles.checkboxContainer}>

  <label style={styles.checkboxLabel}>

    <input
      type="checkbox"
      name="rte"
      checked={formData.rte}
      onChange={(e) =>
        setFormData({
          ...formData,
          rte: e.target.checked
        })
      }
    />

    RTE (Right To Education)

  </label>

</div>

          <button style={styles.button}>
  {id ? "Update Student" : "Save Student"}
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
    color: "#111827",
  },

  checkboxContainer: {
  display: "flex",
  alignItems: "center",
},

checkboxLabel: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
  fontWeight: "500",
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