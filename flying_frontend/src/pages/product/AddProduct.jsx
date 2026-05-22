import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import API from "../../api";

import Sidebar from "../../components/Sidebar";

export default function AddProduct() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({

    product_name: "",
    product_type: "",
    course_type: "",
    course: "",
    unit_price: "",
    description: "",
    is_active: true,

  });

  useEffect(() => {

    fetchCourses();

    if (id) {
      fetchProduct();
    }

  }, [id]);

  // 🚀 FETCH COURSES
  const fetchCourses = async () => {

    try {

      const res = await API.get(
        "/info/courses/"
      );

      setCourses(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // 🚀 FETCH PRODUCT
  const fetchProduct = async () => {

    try {

      const res = await API.get(
        `/inventory/products/${id}/`
      );

      setFormData({
        ...res.data,
        course: res.data.course || "",
      });

    } catch (err) {

      console.log(err);
    }
  };

  // 🚀 FILTER COURSES
  const filteredCourses = courses.filter((course) => {

    return (
      course.course_type ===
      formData.course_type
    );
  });

  // 🚀 HANDLE CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    // 🎯 PRODUCT TYPE CHANGE
    if (name === "product_type") {

      // 🎒 BAG
      if (value === "bag") {

        setFormData({
          ...formData,
          product_type: value,
          course_type: "common",
          course: "",
        });

        return;
      }

      setFormData({
        ...formData,
        product_type: value,
        course_type: "",
        course: "",
      });

      return;
    }

    // 🎯 COURSE TYPE CHANGE
    if (name === "course_type") {

      setFormData({
        ...formData,
        course_type: value,
        course: "",
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🚀 SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {

        ...formData
      };

      // 🎒 BAG
      if (payload.product_type === "bag") {

        payload.course_type = "common";
        payload.course = null;
      }

      // 🧮 INSTRUMENT
      if (payload.product_type === "instrument") {

        payload.course = null;
      }

      if (id) {

        await API.put(
          `/inventory/products/update/${id}/`,
          payload
        );

        alert("Product Updated Successfully ✨");

      } else {

        await API.post(
          "/inventory/products/create/",
          payload
        );

        alert("Product Added Successfully 🚀");
      }

      navigate("/products");

    } catch (err) {

      console.log(err.response?.data);

      alert("Something went wrong");
    }
  };

  return (

    <Sidebar>

      <div style={styles.wrapper}>

        <h2 style={styles.title}>
          {id ? "Edit Product" : "Add Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >

          {/* PRODUCT NAME */}
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Product Name"
            style={styles.input}
          />

          {/* PRODUCT TYPE */}
          <select
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            style={styles.input}
          >

            <option value="">
              Select Product Type
            </option>

            <option value="book">
              Book
            </option>

            <option value="instrument">
              Instrument
            </option>

            <option value="bag">
              Bag
            </option>

          </select>

          {/* COURSE TYPE */}

          {(formData.product_type === "book" ||
            formData.product_type === "instrument" ||
            formData.product_type === "bag") && (

            <select
              name="course_type"
              value={formData.course_type}
              onChange={handleChange}
              style={styles.input}
            >

              <option value="">
                Select Course Type
              </option>

              <option value="abacus">
                Abacus
              </option>

              <option value="vedic_maths">
                Vedic Maths
              </option>

              {/* 🎒 BAG */}
              {formData.product_type === "bag" && (

                <option value="common">
                  Common
                </option>

              )}

            </select>

          )}

          {/* COURSE */}

          {formData.product_type === "book" && (

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              style={styles.input}
            >

              <option value="">
                Select Course
              </option>

              {filteredCourses.map((course) => (

                <option
                  key={course.id}
                  value={course.id}
                >

                  {course.course_type ===
                    "abacus"
                    ? "Abacus"
                    : "Vedic Maths"} - {" "}
                  {course.level}

                </option>

              ))}

            </select>

          )}

          {/* LEVEL INFO */}

          {formData.product_type ===
            "instrument" && (

            <div style={styles.infoBox}>
              Level: All Levels
            </div>

          )}

          {formData.product_type ===
            "bag" && (

            <div style={styles.infoBox}>
              Level: Common
            </div>

          )}

          {/* UNIT PRICE */}
          <input
            type="number"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            placeholder="Unit Price"
            style={styles.input}
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            style={styles.textarea}
          />

          {/* BUTTON */}
          <button
            type="submit"
            style={styles.button}
          >
            {id
              ? "Update Product"
              : "Save Product"}
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
    minHeight: "120px",
    outline: "none",
  },

  infoBox: {
    background: "#f3f4f6",
    padding: "12px",
    borderRadius: "8px",
    color: "#374151",
    fontWeight: "600",
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