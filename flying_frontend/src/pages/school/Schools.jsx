import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import Sidebar from "../../components/Sidebar";

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await API.get("/info/schools/");
      setSchools(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this school?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(`/info/schools/delete/${id}/`);

    alert("School Deleted");

    fetchSchools();

  } catch (err) {
    console.log(err);
  }
};

  return (
    <Sidebar>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Schools</h2>
          <p style={styles.subtitle}>Manage all academy schools</p>
        </div>

        <button
          style={styles.button}
          onClick={() => navigate("/schools/add")}
        >
          + Add School
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>School</th>
              <th style={styles.th}>Owner</th>
              <th style={styles.th}>Mobile</th>
              <th style={styles.th}>Fees</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {schools.map((school) => (
              <tr key={school.id}>
                <td style={styles.td}>{school.school_name}</td>
                <td style={styles.td}>{school.owner_name}</td>
                <td style={styles.td}>{school.mobile_number}</td>
                <td style={styles.td}>₹ {school.tution_fees}</td>
                <td style={styles.td}>

  <button
    style={styles.editBtn}
    onClick={() => navigate(`/schools/edit/${school.id}`)}
  >
    Edit
  </button>

  <button
    style={styles.deleteBtn}
    onClick={() => handleDelete(school.id)}
  >
    Delete
  </button>

  <button
    style={styles.viewBtn}
    onClick={() =>
      navigate(`/schools/${school.id}/students`)
    }
  >
    View Students
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

  viewBtn: {
  background: "#0f766e",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
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
};