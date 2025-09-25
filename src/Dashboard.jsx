import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Leaderboard from "./leaderboard";

function Dashboard({ user, setUser }) {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // 🔹 Fetch profile data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          const defaultProfile = { name: user.email.split("@")[0], email: user.email, bio: "" };
          await setDoc(docRef, defaultProfile);
          setProfile(defaultProfile);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  // 🔹 Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/auth");
  };

  if (!profile) return <p style={{ color: "#fff" }}>Loading dashboard...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 40px",
        fontFamily: "Segoe UI, sans-serif",
        background: "linear-gradient(135deg, #000000 0%, #434343 100%)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      {/* ✨ Catchy Hero Section */}
      <h1 style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "15px" }}>
        "Grow Daily. Achieve Greatness."
      </h1>
      <p style={{ fontSize: "1.3rem", marginBottom: "50px", color: "#ddd" }}>
        Welcome back, <strong>{profile.name || profile.email}</strong> 👋 <br />
        Your journey of self-improvement starts here.
      </p>

      {/* 🔹 Features Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "30px",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>📈 Track Progress</h2>
          <p style={{ color: "#ccc" }}>Visualize your daily growth and celebrate milestones.</p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "30px",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>🏆 Compete & Inspire</h2>
          <p style={{ color: "#ccc" }}>
            Join the leaderboard, challenge friends, and stay motivated.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "30px",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>💡 Daily Growth</h2>
          <p style={{ color: "#ccc" }}>
            Learn, reflect, and improve every single day with guided features.
          </p>
        </div>
      </div>

      {/* 🔹 Buttons */}
      <div style={{ marginTop: "50px" }}>
        <button
          onClick={() => navigate("/profile")}
          style={{
            marginRight: "20px",
            padding: "14px 35px",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "#fff",
            color: "#000",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          Go to Profile
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "14px 35px",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "#ff4d4d",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔹 Leaderboard */}
      <div style={{ marginTop: "70px" }}>
        <Leaderboard />
      </div>
    </div>
  );
}

export default Dashboard;
