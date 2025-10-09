import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Game from "./Game";
import LevelRoadmap from "./LevelRoadmap";
import Leaderboard from "./Leaderboard"; 

function Dashboard({ user, setUser, token, setToken }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    tasksCompleted: 0,
    skillsUnlocked: 0,
    mindfulMinutes: 0
  });
  const [activeSection, setActiveSection] = useState(0); // Using index for sections
  const [xpAnimations, setXpAnimations] = useState([]);
  const [toast, setToast] = useState(null);
  const [taskXP, setTaskXP] = useState({
    drink_water: 0, breakfast: 0, lunch: 0, dinner: 0, take_break: 0,
    run: 0, coding: 0, reading: 0, meditation: 0, exercise: 0,
    early_bedtime: 0, stretching: 0, journaling: 0, walking: 0,
    gratitude: 0, learning: 0, music: 0, cleaning: 0
  });
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api';

  // Helper function for authenticated requests
  const makeAuthenticatedRequest = async (url, data = null, method = 'GET') => {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: { Authorization: `Bearer ${token}` }
    };
    if (data) config.data = data;
    return axios(config);
  };

  // Task definitions
  const xpTasks = [
    { id: 'drink_water', name: 'Drink Water', xp: 5, icon: '💧', color: '#06b6d4' },
    { id: 'breakfast', name: 'Breakfast', xp: 10, icon: '🥐', color: '#f59e0b' },
    { id: 'lunch', name: 'Lunch', xp: 15, icon: '🍱', color: '#10b981' },
    { id: 'dinner', name: 'Dinner', xp: 15, icon: '🍽️', color: '#ef4444' },
    { id: 'take_break', name: 'Take Break', xp: 8, icon: '☕', color: '#8b5cf6' },
    { id: 'run', name: 'Run', xp: 20, icon: '🏃‍♂️', color: '#f97316' },
    { id: 'coding', name: 'Coding', xp: 25, icon: '💻', color: '#3b82f6' },
    { id: 'reading', name: 'Reading', xp: 12, icon: '📚', color: '#6366f1' },
    { id: 'meditation', name: 'Meditation', xp: 18, icon: '🧘‍♀️', color: '#14b8a6' },
    { id: 'exercise', name: 'Exercise', xp: 22, icon: '💪', color: '#ec4899' },
    { id: 'early_bedtime', name: 'Early Bedtime', xp: 12, icon: '😴', color: '#8b5cf6' },
    { id: 'stretching', name: 'Stretching', xp: 10, icon: '🤸‍♀️', color: '#10b981' },
    { id: 'journaling', name: 'Journaling', xp: 15, icon: '📝', color: '#f59e0b' },
    { id: 'walking', name: 'Walking', xp: 18, icon: '🚶‍♀️', color: '#06b6d4' },
    { id: 'gratitude', name: 'Gratitude Practice', xp: 8, icon: '🙏', color: '#fbbf24' },
    { id: 'learning', name: 'Learn Something New', xp: 20, icon: '🎓', color: '#6366f1' },
    { id: 'music', name: 'Listen to Music', xp: 8, icon: '🎵', color: '#ec4899' },
    { id: 'cleaning', name: 'Quick Tidy Up', xp: 10, icon: '🧹', color: '#64748b' },
  ];

  // Add XP function using backend API
  const addXP = async (taskId, xpToAdd) => {
    try {
      // Call backend API to add XP
      const response = await makeAuthenticatedRequest('/users/add-xp', { xp: xpToAdd }, 'POST');
      const { level, xp, message } = response.data;

      // Update local state with backend response
      setUserStats(prev => {
        const newLevel = level;
        const newXp = xp;

        // Show level up toast
        if (newLevel > prev.level) {
          setToast({ message: `Level Up! Reached Level ${newLevel}! ✨`, type: 'success' });
          setTimeout(() => setToast(null), 4000);
        } else {
          setToast({ message: `+${xpToAdd} XP Gained!`, type: 'success' });
          setTimeout(() => setToast(null), 3000);
        }
        
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          tasksCompleted: prev.tasksCompleted + 1,
        };
      });

      // Add a floating XP animation
      const newAnimation = {
        id: Date.now(),
        xp: xpToAdd,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      setXpAnimations(prev => [...prev, newAnimation]);
      setTimeout(() => {
        setXpAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
      }, 2500);

      // Update the counter on the task button
      setTaskXP(prev => ({...prev, [taskId]: (prev[taskId] || 0) + 1}));

    } catch (error) {
      console.error('Error adding XP:', error);
      setToast({ message: 'Failed to add XP. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Set default profile for demo purposes
  useEffect(() => {
    setProfile({
      name: "Growth Seeker",
      email: "demo@example.com",
      photoURL: null,
    });
    setLoading(false);
  }, []);

  // Load user data when user changes
  useEffect(() => {
    if (user?._id && token) {
      // Fetch user profile stats from backend
      makeAuthenticatedRequest('/users/profile-stats')
        .then(response => {
          const { progress, stats } = response.data;
          setUserStats({
            level: progress.level || 1,
            xp: progress.xp || 0,
            streak: stats.streak || 0,
            tasksCompleted: stats.tasksCompleted || 0,
            skillsUnlocked: stats.skillsUnlocked || 0,
            mindfulMinutes: 0 // Not tracked in backend yet
          });
        })
        .catch(error => {
          console.error('Error fetching user stats:', error);
          // Set default stats if fetch fails
          setUserStats({
            level: user.level || 1,
            xp: user.xp || 0,
            streak: user.streak || 0,
            tasksCompleted: user.tasksCompleted || 0,
            skillsUnlocked: 0,
            mindfulMinutes: 0
          });
        });
    }
  }, [user, token]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        color: "#f1f5f9",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(96, 165, 250, 0.05) 0%, transparent 70%)",
        borderRadius: "50%", animation: "float 20s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "60%", right: "8%", width: "200px", height: "200px",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
        borderRadius: "50%", animation: "float 25s ease-in-out infinite reverse",
      }} />

      {/* Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)", padding: "20px 0",
        }}
      >
        <div style={{
          maxWidth: "1200px", margin: "0 auto", padding: "0 40px",
          display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap"
        }}>
          {[
            { title: 'Daily Tasks', icon: '📋', color: '#60a5fa' },
            { title: 'Levels', icon: '🏆', color: '#f59e0b' },
            { title: 'AI Assistant', icon: '🤖', color: '#8b5cf6' },
            { title: 'Fun Challenges', icon: '🎮', color: '#ec4899' },
            { title: 'Leaderboard', icon: '🏆', color: '#f97316' },



          ].map((section, index) => (
            <motion.button
              key={section.title}
              whileHover={{ scale: 1.05, boxShadow: `0 4px 15px ${section.color}40` }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(index)}
              style={{
                padding: "12px 24px", borderRadius: "15px", border: "none",
                background: activeSection === index ? `linear-gradient(135deg, ${section.color}, ${section.color}cc)` : "rgba(255, 255, 255, 0.08)",
                color: activeSection === index ? "#fff" : "#94a3b8",
                fontWeight: "600", fontSize: "0.9rem", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s ease",
                boxShadow: activeSection === index ? `0 4px 15px ${section.color}40` : "none",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{section.icon}</span>
              <span>{section.title}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content Container - Enable Scrolling */}
      <div style={{
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
        scrollbarWidth: "thin",
        scrollbarColor: "#8b5cf6 rgba(255, 255, 255, 0.1)"
      }}>
        <AnimatePresence initial={false} custom={activeSection}>
          <motion.div
            key={activeSection}
            custom={activeSection}
            variants={{
              enter: (direction) => ({ x: direction > activeSection ? 1000 : -1000, opacity: 0 }),
              center: { zIndex: 1, x: 0, opacity: 1 },
              exit: (direction) => ({ zIndex: 0, x: direction < activeSection ? 1000 : -1000, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000 && activeSection < 4) setActiveSection(activeSection + 1);
              else if (swipe > 10000 && activeSection > 0) setActiveSection(activeSection - 1);
            }}
            style={{
              width: "100%",
              minHeight: "calc(100vh - 100px)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "20px",
              paddingBottom: "50px"
            }}
          >
            {/* Conditional Rendering of Sections */}
            <div style={{
              width: "100%",
              maxWidth: "1400px",
              minHeight: "fit-content",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "40px 20px"
            }}>
              {activeSection === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: '100%', position: 'relative' }}>
                  {/* Floating Background Particles */}
                  <div style={{
                    position: "absolute", top: "-50px", left: "-50px", width: "200px", height: "200px",
                    background: "radial-gradient(circle, rgba(96, 165, 250, 0.03) 0%, transparent 70%)",
                    borderRadius: "50%", animation: "float 15s ease-in-out infinite",
                  }} />
                  <div style={{
                    position: "absolute", top: "100px", right: "-30px", width: "150px", height: "150px",
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 70%)",
                    borderRadius: "50%", animation: "float 20s ease-in-out infinite reverse",
                  }} />

                  {/* About Section */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      borderRadius: "25px",
                      padding: "30px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                      textAlign: "center",
                      maxWidth: "800px",
                      margin: "0 auto"
                    }}
                  >
                    <motion.h2
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "700",
                        background: "linear-gradient(135deg, #60a5fa, #a855f7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: "20px"
                      }}
                    >
                      About Daily Growth Tracker
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.6",
                        color: "#cbd5e1",
                        marginBottom: "25px"
                      }}
                    >
                      The Daily Growth Tracker helps you turn small habits into big achievements. Earn XP for completing daily tasks, track your progress, and level up your lifestyle one step at a time.
                    </motion.p>

                    {/* Feature List */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                      }}
                    >
                      {[
                        { icon: "🌟", text: "Track Progress" },
                        { icon: "🔥", text: "Earn XP" },
                        { icon: "🧠", text: "Level Up Mindset" },
                        { icon: "🎯", text: "Daily Consistency Boost" }
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.text}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            padding: "12px 20px",
                            borderRadius: "20px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "#e2e8f0"
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>{feature.icon}</span>
                          <span>{feature.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Task Board */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      borderRadius: "25px",
                      padding: "30px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                      maxWidth: "1000px",
                      margin: "0 auto"
                    }}
                  >
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#f1f5f9",
                        marginBottom: "25px",
                        textAlign: "center"
                      }}
                    >
                      Daily XP Tasks
                    </motion.h3>

                    <div style={{
                      display: "flex",
                      gap: "20px",
                      overflowX: "auto",
                      paddingBottom: "10px",
                      scrollbarWidth: "thin",
                      scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)"
                    }}>
                      {xpTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          style={{
                            background: `linear-gradient(135deg, ${task.color}08, ${task.color}05)`,
                            borderRadius: "20px",
                            padding: "25px",
                            border: `2px solid ${task.color}25`,
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            minWidth: "200px",
                            flexShrink: 0
                          }}
                          onClick={(e) => { e.stopPropagation(); addXP(task.id, task.xp); }}
                        >
                          {/* Particle glow effect */}
                          <div style={{
                            position: "absolute",
                            top: "-50%",
                            left: "-50%",
                            width: "200%",
                            height: "200%",
                            background: `radial-gradient(circle, ${task.color}10 0%, transparent 70%)`,
                            opacity: taskXP[task.id] > 0 ? 0.3 : 0,
                            transition: "opacity 0.3s ease"
                          }} />

                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            style={{
                              fontSize: "2.5rem",
                              marginBottom: "15px",
                              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))"
                            }}
                          >
                            {task.icon}
                          </motion.div>

                          <div style={{
                            fontSize: "1.1rem",
                            fontWeight: "700",
                            color: task.color,
                            marginBottom: "8px"
                          }}>
                            {task.name}
                          </div>

                          <div style={{
                            background: `linear-gradient(135deg, ${task.color}, ${task.color}cc)`,
                            padding: "8px 16px",
                            borderRadius: "15px",
                            fontSize: "0.9rem",
                            fontWeight: "800",
                            color: "#fff",
                            boxShadow: `0 4px 15px ${task.color}40`,
                            marginBottom: "15px",
                            display: "inline-block"
                          }}>
                            +{task.xp} XP
                          </div>

                          {/* Completion indicator */}
                          {taskXP[task.id] > 0 && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                background: `linear-gradient(135deg, ${task.color}, ${task.color}dd)`,
                                color: "#fff",
                                padding: "6px 12px",
                                borderRadius: "12px",
                                fontSize: "0.8rem",
                                fontWeight: "800",
                                boxShadow: `0 4px 15px ${task.color}60`,
                                border: "2px solid rgba(255, 255, 255, 0.3)"
                              }}
                            >
                              ✓ {taskXP[task.id]}
                            </motion.div>
                          )}

                          {/* Hover effect overlay */}
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, ${task.color}15, transparent)`,
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            borderRadius: "20px",
                            pointerEvents: "none"
                          }} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* XP Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      borderRadius: "20px",
                      padding: "25px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
                      maxWidth: "600px",
                      margin: "0 auto"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "15px"
                    }}>
                      <span style={{ fontSize: "1.5rem" }}>⚡</span>
                      <span style={{
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        color: "#f59e0b"
                      }}>
                        Today's Progress
                      </span>
                      <span style={{
                        fontSize: "1rem",
                        color: "#94a3b8",
                        marginLeft: "auto"
                      }}>
                        {Object.values(taskXP).reduce((sum, count) => sum + count, 0)} tasks completed
                      </span>
                    </div>

                    <div style={{
                      width: "100%",
                      height: "12px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      overflow: "hidden",
                      position: "relative"
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((Object.values(taskXP).reduce((sum, count) => sum + count, 0) / xpTasks.length) * 100, 100)}%`
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{
                          height: "100%",
                          background: "linear-gradient(90deg, #f59e0b, #f97316, #ef4444)",
                          borderRadius: "6px",
                          boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)"
                        }}
                      />

                      {/* Animated shine effect */}
                      <motion.div
                        animate={{
                          x: ["-100%", "400%"]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "30%",
                          height: "100%",
                          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                          borderRadius: "6px"
                        }}
                      />
                    </div>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                      fontSize: "0.9rem",
                      color: "#64748b"
                    }}>
                      <span>Start your journey</span>
                      <span style={{ color: "#f59e0b", fontWeight: "600" }}>
                        {Math.round((Object.values(taskXP).reduce((sum, count) => sum + count, 0) / xpTasks.length) * 100)}% Complete!
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}
              {activeSection === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: "100%",
                    maxWidth: "1400px",
                    background: "linear-gradient(135deg, #1e293b15, #33415515)",
                    borderRadius: "25px",
                    padding: "30px",
                    border: "2px solid rgba(245, 158, 11, 0.3)",
                    boxShadow: "0 20px 60px rgba(245, 158, 11, 0.1)"
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "3.5rem", marginBottom: "20px", textAlign: "center" }}
                  >
                    🏆
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: "900",
                      background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textAlign: "center",
                      marginBottom: "30px",
                      textShadow: "0 0 30px rgba(251, 191, 36, 0.3)"
                    }}
                  >
                    Epic Level Journey
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <LevelRoadmap user={user} />
                  </motion.div>
                </motion.div>
              )}
              {activeSection === 2 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center', gap: "30px", width: '100%' }}>
                  <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(135deg, #8b5cf6, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "20px" }}>
                    AI Assistant
                  </motion.h2>
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ background: "linear-gradient(135deg, #8b5cf615, #8b5cf605)", padding: "40px", borderRadius: "25px", textAlign: "center", border: "2px solid #8b5cf630", width: "100%", maxWidth: "600px" }}>
                    <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ fontSize: "4rem", marginBottom: "20px" }}>🤖</motion.div>
                    <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#8b5cf6", marginBottom: "15px" }}>Your AI Productivity Partner</div>
                    <p style={{ fontSize: "1rem", opacity: 0.8, marginBottom: "25px", lineHeight: 1.6 }}>Get personalized advice, productivity tips, and motivation to help you achieve your goals!</p>
                    <motion.button whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)" }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/ai-assistant")}
                      style={{ padding: "15px 30px", borderRadius: "15px", border: "none", background: "linear-gradient(135deg, #8b5cf6, #a855f7)", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer" }}>
                      💬 Start Chat
                    </motion.button>
                  </motion.div>
                </div>
              )}
              {activeSection === 3 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", width: '100%', maxWidth: "1200px" }}>
                  <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: "2.5rem", fontWeight: "800", background: "linear-gradient(135deg, #ec4899, #db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "20px" }}>
                    Fun Challenges & Games
                  </motion.h2>

                  {/* Quick Tap Game Section */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{
                      background: "linear-gradient(135deg, #8b5cf615, #8b5cf605)",
                      padding: "30px",
                      borderRadius: "25px",
                      textAlign: "center",
                      border: "2px solid #8b5cf630",
                      width: "100%",
                      maxWidth: "1000px",
                      marginBottom: "30px",
                      boxShadow: "0 8px 32px rgba(139, 92, 246, 0.2)"
                    }}
                  >
                    <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ fontSize: "3rem", marginBottom: "15px" }}>🎮</motion.div>
                    <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#8b5cf6", marginBottom: "10px" }}>Quick Tap Game</div>
                    <p style={{ fontSize: "1rem", opacity: 0.8, marginBottom: "20px", lineHeight: 1.6 }}>
                      Test your reflexes and earn XP! Click targets as they appear for points and combo bonuses.
                    </p>

                    {/* Game Component Container */}
                    <div style={{
                      marginTop: "20px",
                      width: "100%",
                      maxWidth: "900px",
                      margin: "0 auto",
                      borderRadius: "15px",
                      overflow: "hidden",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(139, 92, 246, 0.3)"
                    }}>
                      <Game />
                    </div>
                  </motion.div>

                  {/* Existing Challenge Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", width: "100%", maxWidth: "900px" }}>
                     {[
                      { title: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥", color: "#ef4444", progress: Math.min(userStats.streak / 7 * 100, 100) },
                      { title: "Task Champion", description: "Complete 50 daily tasks", icon: "⭐", color: "#f59e0b", progress: Math.min(userStats.tasksCompleted / 50 * 100, 100) },
                      { title: "Level Up", description: "Reach level 10", icon: "🏆", color: "#10b981", progress: Math.min(userStats.level / 10 * 100, 100) },
                      { title: "Mindful Warrior", description: "100 mindful minutes", icon: "🧘‍♀️", color: "#8b5cf6", progress: Math.min(userStats.mindfulMinutes / 100 * 100, 100) },
                    ].map((challenge, index) => (
                      <motion.div key={challenge.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }} style={{ background: `linear-gradient(135deg, ${challenge.color}15, ${challenge.color}05)`, padding: "25px", borderRadius: "20px", textAlign: "center", border: `2px solid ${challenge.color}30` }}>
                        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ fontSize: "3rem", marginBottom: "15px" }}>{challenge.icon}</motion.div>
                        <div style={{ fontSize: "1.2rem", fontWeight: "700", color: challenge.color, marginBottom: "8px" }}>{challenge.title}</div>
                        <p style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "20px" }}>{challenge.description}</p>
                        <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${challenge.progress}%` }} transition={{ duration: 1, delay: 0.5 + index * 0.1 }} style={{ height: "100%", background: `linear-gradient(90deg, ${challenge.color}, ${challenge.color}cc)`, borderRadius: "4px" }}/>
                        </div>
                        <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>{challenge.progress.toFixed(0)}% Complete</div>
                      </motion.div>
                    ))}
                  </div>
                </div> )}
              {activeSection === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: "100%",
                    maxWidth: "1400px",
                    background: "linear-gradient(135deg, #f9731615, #ea580c15)",
                    borderRadius: "25px",
                    padding: "30px",
                    border: "2px solid rgba(249, 115, 22, 0.3)",
                    boxShadow: "0 20px 60px rgba(249, 115, 22, 0.1)"
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: "3.5rem", marginBottom: "20px", textAlign: "center" }}
                  >
                    🏆
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: "900",
                      background: "linear-gradient(135deg, #f97316, #ea580c, #dc2626)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textAlign: "center",
                      marginBottom: "30px",
                      textShadow: "0 0 30px rgba(249, 115, 22, 0.3)"
                    }}
                  >
                    Global Leaderboard
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Leaderboard />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {activeSection > 0 && (
        <motion.button
          onClick={() => setActiveSection(activeSection - 1)}
          style={{ position: "fixed", left: "20px", top: "50%", transform: "translateY(-50%)", zIndex: 50, /* styles */ }}
        >←</motion.button>
      )}
      {activeSection < 4 && (
        <motion.button
          onClick={() => setActiveSection(activeSection + 1)}
          style={{ position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)", zIndex: 50, /* styles */ }}
        >→</motion.button>
      )}

      {/* Floating XP Animations & Toasts */}
      <AnimatePresence>
        {xpAnimations.map(anim => (
          <motion.div key={anim.id} initial={{ opacity: 1, scale: 0.3, x: anim.x - 30, y: anim.y - 30, color: "#f59e0b" }}
            animate={{ opacity: 0, scale: 1.8, y: anim.y - 120, x: anim.x - 30 + (Math.random() - 0.5) * 60, transition: { duration: 2.5, ease: "easeOut" } }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ position: "fixed", fontSize: "1.5rem", fontWeight: "900", pointerEvents: "none", zIndex: 1000 }}
          >+{anim.xp} XP</motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
            style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", padding: "16px 30px", borderRadius: "15px", zIndex: 1001,
                     background: toast.type === 'error' ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #10b981, #059669)",
                     color: "#fff", fontWeight: "600", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{toast.type === 'error' ? '❌' : '✅'}</span>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-30px) scale(1.05); }
          }
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); }
          ::-webkit-scrollbar-thumb { background: linear-gradient(90deg, #60a5fa, #a855f7); border-radius: 4px; }
        `}
      </style>
    </motion.div>
  );
}

export default Dashboard;