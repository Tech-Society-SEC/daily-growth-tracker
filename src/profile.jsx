import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function Profile({ user }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  // Load existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Save updates
  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { name, bio });
      setMessage("Profile updated successfully ✅");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #434343 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, sans-serif",
        padding: "40px",
      }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          }}
        >
          👤
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "700" }}>My Profile</h1>
        <p style={{ color: "#aaa" }}>{user?.email}</p>
      </div>

      {/* Profile Form */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: "40px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="Write a short bio..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{ ...inputStyle, height: "100px", resize: "none" }}
        />

        <button onClick={handleSave} style={btnStyle}>
          Save Profile
        </button>

        {message && (
          <p
            style={{
              color: "#4caf50",
              marginTop: "15px",
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  margin: "12px auto",
  padding: "14px",
  width: "100%",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: "1rem",
  transition: "all 0.3s",
};

const btnStyle = {
  marginTop: "20px",
  padding: "14px 25px",
  border: "none",
  borderRadius: "50px",
  background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
  color: "#fff",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
  width: "100%",
  transition: "all 0.3s ease",
};

export default Profile;
