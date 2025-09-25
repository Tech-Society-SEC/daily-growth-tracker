import React, { useState } from "react";
import { FaTrophy, FaSearch, FaSortAlphaDown, FaSortAmountDown } from "react-icons/fa";

function Leaderboard() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rank");

  const leaderboardData = [
    { id: 1, name: "Siddharth", progress: 95 },
    { id: 2, name: "Kumar", progress: 88 },
    { id: 3, name: "Priya", progress: 82 },
    { id: 4, name: "Rahul", progress: 75 },
    { id: 5, name: "Meera", progress: 70 },
    { id: 6, name: "Vikram", progress: 65 },
    { id: 7, name: "Ananya", progress: 60 },
  ];

  const filteredData = leaderboardData
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "progress") return b.progress - a.progress;
      return a.id - b.id;
    });

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "20px",
        background: "#1e1e2f",
        color: "#f0f0f0",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h1 style={{ fontSize: "2.2rem", margin: 0, color: "#fff" }}>
          🏆 Global Leaderboard
        </h1>
        <p style={{ color: "#aaa", marginTop: "5px", fontSize: "1rem" }}>
          Track your growth, compete & rise to the top
        </p>
      </div>

      {/* Search and Sort */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FaSearch color="#aaa" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #555",
              outline: "none",
              background: "#2a2a3f",
              color: "#f0f0f0",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setSortBy("name")} style={buttonStyle}>
            <FaSortAlphaDown /> Name
          </button>
          <button onClick={() => setSortBy("progress")} style={buttonStyle}>
            <FaSortAmountDown /> Progress
          </button>
        </div>
      </div>

      {/* Scrollable Table */}
      <div
        style={{
          maxHeight: "350px",
          overflowY: "auto",
          borderRadius: "15px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#2a2a3f", position: "sticky", top: 0 }}>
              <th style={thStyle}>Rank</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Progress</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr
                key={user.id}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 0px transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 0 15px #6a11cb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 0 0px transparent")
                }
              >
                <td style={tdStyle}>
                  {index === 0 && <FaTrophy style={{ color: "#FFD700" }} />} {index + 1}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        backgroundColor: "#6a11cb",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, width: "50%" }}>
                  <div
                    style={{
                      background: "#44445a",
                      borderRadius: "10px",
                      height: "12px",
                      overflow: "hidden",
                      marginTop: "5px",
                    }}
                  >
                    <div
                      style={{
                        width: `${user.progress}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                        borderRadius: "10px",
                        transition: "width 0.5s ease-in-out",
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#ccc" }}>
                    {user.progress}%
                  </span>
                </td>
                <td style={tdStyle}>
                  <button style={viewButtonStyle}>View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  fontWeight: "600",
  color: "#f0f0f0",
};

const tdStyle = {
  padding: "12px",
  color: "#f0f0f0",
  fontSize: "0.95rem",
};

const buttonStyle = {
  padding: "6px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#6a11cb",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "all 0.3s ease",
};

const viewButtonStyle = {
  padding: "6px 12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(90deg, #6a11cb, #2575fc)",
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.85rem",
  transition: "all 0.3s ease",
};

export default Leaderboard;
