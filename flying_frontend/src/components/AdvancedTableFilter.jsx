import { useEffect, useState } from "react";

export default function AdvancedTableFilter({
  data = [],
  onFilter,
  setItemsPerPage,
}) {
  const [filters, setFilters] = useState([
    {
      field: "",
      value: "",
    },
  ]);

  const [sortOrder, setSortOrder] = useState("");

  // =====================================
  // AUTO DETECT FIELDS
  // =====================================
  const hiddenFields = ["id", "password", "role", "school"];
  const allFields = new Set();

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!hiddenFields.includes(key)) {
        allFields.add(key);
      }
    });
  });

  const fields = [...allFields];

  // =====================================
  // FILTER ACTIONS
  // =====================================
  const addFilterRow = () => {
    setFilters([
      ...filters,
      {
        field: "",
        value: "",
      },
    ]);
  };

  const removeFilterRow = (index) => {
    const updated = [...filters];
    updated.splice(index, 1);
    setFilters(updated);
  };

  const handleFilterChange = (index, key, value) => {
    const updated = [...filters];
    updated[index][key] = value;
    setFilters(updated);
  };

  const clearAllFilters = () => {
    setFilters([{ field: "", value: "" }]);
    setSortOrder("");
  };

  // =====================================
  // APPLY FILTERS ENGINE
  // =====================================
  useEffect(() => {
    let filteredData = [...data];

    // Evaluate active filter parameters
    filters.forEach((filter) => {
      if (filter.field && filter.value) {
        filteredData = filteredData.filter((item) => {
          const value = item[filter.field];
          return String(value || "")
            .toLowerCase()
            .includes(filter.value.toLowerCase());
        });
      }
    });

    // Handle alphanumeric sorting strings safely
    if (sortOrder === "asc") {
      filteredData.sort((a, b) => {
        const firstKey = Object.keys(a)[0];
        return String(a[firstKey] || "").localeCompare(String(b[firstKey] || ""));
      });
    }

    if (sortOrder === "desc") {
      filteredData.sort((a, b) => {
        const firstKey = Object.keys(b)[0];
        return String(b[firstKey] || "").localeCompare(String(a[firstKey] || ""));
      });
    }

    onFilter(filteredData);
  }, [data, filters, sortOrder, onFilter]);

  return (
    <div style={styles.sidebarLayout}>
      
      {/* FILTER CONDITION CARDS LAYER */}
      <div style={styles.sectionBlock}>
        <label style={styles.sectionLabel}>MATCH CONDITIONS</label>
        
        {filters.map((filter, index) => (
          <div key={index} style={styles.filterCard}>
            
            {/* Header row inside individual condition cards */}
            <div style={styles.cardHeader}>
              <span style={styles.cardIndex}>Condition #{index + 1}</span>
              {filters.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFilterRow(index)}
                  style={styles.removeLink}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Field Target Picker Selection */}
            <div style={styles.inputGroup}>
              <label style={styles.fieldLabel}>Search Column Target</label>
              <select
                value={filter.field}
                onChange={(e) => handleFilterChange(index, "field", e.target.value)}
                style={styles.selectInput}
              >
                <option value="">Select Target Field...</option>
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Logical Value Matching Entry Field */}
            <div style={styles.inputGroup}>
              <label style={styles.fieldLabel}>Value Query Selector</label>
              {filter.field.includes("is_") || filter.field === "rte" ? (
                <select
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                  style={styles.selectInput}
                >
                  <option value="">Choose State...</option>
                  <option value="true">Yes / Active</option>
                  <option value="false">No / Inactive</option>
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Type search terms..."
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, "value", e.target.value)}
                  style={styles.textField}
                />
              )}
            </div>

          </div>
        ))}

        <button type="button" onClick={addFilterRow} style={styles.addRuleBtn}>
          ➕ Add Filter Rule
        </button>
      </div>

      <hr style={styles.divider} />

      {/* METRICS DISCOVERY & ORDER CONTROL SECTION */}
      <div style={styles.sectionBlock}>
        <div style={styles.inputGroup}>
          <label style={styles.sectionLabel}>ALPHABETICAL SORTING</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.selectInput}
          >
            <option value="">Default Listing Order</option>
            <option value="asc">A → Z (Ascending)</option>
            <option value="desc">Z → A (Descending)</option>
          </select>
        </div>
      </div>

      <div style={styles.sectionBlock}>
        <div style={styles.inputGroup}>
          <label style={styles.sectionLabel}>ITEMS SHOWN PER PAGE</label>
          <select
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={styles.selectInput}
            defaultValue={8}
          >
            <option value={5}>5 Rows per page</option>
            <option value={8}>8 Rows per page</option>
            <option value={10}>10 Rows per page</option>
            <option value={20}>20 Rows per page</option>
            <option value={50}>50 Rows per page</option>
          </select>
        </div>
      </div>

      {/* FOOTER MASTER RESET TRIGGER ACTION */}
      <button type="button" onClick={clearAllFilters} style={styles.resetBtn}>
        Clear Active Filters
      </button>

    </div>
  );
}

const styles = {
  sidebarLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    boxSizing: "border-box",
  },
  sectionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "0.08em",
    marginBottom: "4px",
  },
  filterCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px dashed #e2e8f0",
    paddingBottom: "8px",
  },
  cardIndex: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
  },
  removeLink: {
    background: "none",
    border: "none",
    color: "#ef4444",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    padding: 0,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
  },
  selectInput: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#fff",
    color: "#334155",
    fontSize: "13px",
    fontWeight: "500",
    outline: "none",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  textField: {
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#fff",
    color: "#334155",
    fontSize: "13px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  addRuleBtn: {
    background: "#f0f4ff",
    color: "#6080E8",
    border: "1px dashed #6080E8",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "4px",
    transition: "all 0.2s ease",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e2e8f0",
    margin: "8px 0",
  },
  resetBtn: {
    background: "#fff",
    color: "#64748b",
    border: "1px solid #cbd5e1",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "10px",
    transition: "background 0.2s",
  }
};