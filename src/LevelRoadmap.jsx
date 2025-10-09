import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaStar, FaCrown, FaFire, FaBolt, FaGem } from 'react-icons/fa';
import { getUserProfile, updateUserProfile } from './firebase'; // Assuming you have this file

const LEVELS = [
  { id: 1, name: "Sprout", xpRequired: 250, icon: "🌱", color: "#10b981" },
  { id: 2, name: "Seedling", xpRequired: 500, icon: "🌿", color: "#3b82f6" },
  { id: 3, name: "Bloom", xpRequired: 750, icon: "🌸", color: "#8b5cf6" },
  { id: 4, name: "Growth", xpRequired: 1000, icon: "🌳", color: "#ec4899" },
  { id: 5, name: "Flourish", xpRequired: 1250, icon: "🌺", color: "#f59e0b" },
  { id: 6, name: "Thrive", xpRequired: 1500, icon: "🌴", color: "#ef4444" },
  { id: 7, name: "Excel", xpRequired: 1750, icon: "⭐", color: "#dc2626" },
  { id: 8, name: "Master", xpRequired: 2000, icon: "👑", color: "#7c3aed" },
  { id: 9, name: "Sage", xpRequired: 2250, icon: "🧙", color: "#db2777" },
  { id: 10, name: "Legend", xpRequired: 2500, icon: "🏆", color: "#06b6d4" },
  { id: 11, name: "Champion", xpRequired: 2750, icon: "⚡", color: "#fbbf24" },
  { id: 12, name: "Hero", xpRequired: 3000, icon: "🦸", color: "#a855f7" },
  { id: 13, name: "Titan", xpRequired: 3250, icon: "💪", color: "#f97316" },
  { id: 14, name: "Oracle", xpRequired: 3500, icon: "🔮", color: "#0ea5e9" },
  { id: 15, name: "Divine", xpRequired: 3750, icon: "✨", color: "#fcd34d" },
];

function LevelRoadmap({ user }) {
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchUserProgress();
    } else {
      // No user logged in, set default state
      setLoading(false);
    }
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(user.uid);

      if (profile) {
        setUserProfile(profile);
        setUserLevel(profile.level || 1);
        setUserXP(profile.xp || 0);
      } else {
        // Create default profile if none exists
        const defaultProfile = {
          level: 1,
          xp: 0,
          totalPoints: 0,
          streak: 0,
          tasksCompleted: 0,
          skillsUnlocked: 0,
          mindfulMinutes: 0,
          badges: []
        };
        setUserProfile(defaultProfile);
        setUserLevel(1);
        setUserXP(0);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Set default values on error
      setUserLevel(1);
      setUserXP(0);
      setUserProfile({
        level: 1,
        xp: 0,
        totalPoints: 0,
        streak: 0,
        tasksCompleted: 0,
        skillsUnlocked: 0,
        mindfulMinutes: 0,
        badges: []
      });
    } finally {
      setLoading(false);
    }
  };

  const addXP = async (amount) => {
    if (!user?.uid) return;

    try {
      const newXP = (userProfile?.xp || 0) + amount;
      const newLevel = Math.floor(newXP / 250) + 1;
      const oldLevel = userLevel;

      // Update local state first for immediate feedback
      setUserXP(newXP);
      if (newLevel > oldLevel) {
        setUserLevel(newLevel);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      // Update Firebase
      await updateUserProfile(user.uid, {
        xp: newXP,
        level: newLevel,
        totalPoints: (userProfile?.totalPoints || 0) + amount
      });

      // Update local profile
      setUserProfile(prev => ({
        ...prev,
        xp: newXP,
        level: newLevel,
        totalPoints: (prev?.totalPoints || 0) + amount
      }));

    } catch (error) {
      console.error('Error adding XP:', error);
      // Still update local state for better UX even if Firebase fails
      const newXP = (userProfile?.xp || 0) + amount;
      const newLevel = Math.floor(newXP / 250) + 1;
      setUserXP(newXP);
      setUserLevel(newLevel);
    }
  };

  const getCurrentLevelInfo = () => {
    return LEVELS.find(l => l.id === userLevel) || LEVELS[0];
  };

  const getNextLevelInfo = () => {
    return LEVELS.find(l => l.id === userLevel + 1) || LEVELS[LEVELS.length - 1];
  };

  const getProgressPercentage = () => {
    const currentLevelInfo = getCurrentLevelInfo();
    const nextLevelInfo = getNextLevelInfo();

    if (userLevel >= LEVELS.length) {
        return 100;
    }

    const currentLevelStartXP = (currentLevelInfo.id - 1) * 250;
    const xpNeededForNextLevel = nextLevelInfo.xpRequired - currentLevelStartXP;
    const xpInCurrentLevel = userXP - currentLevelStartXP;

    if (xpNeededForNextLevel === 0) return 100;

    return Math.min((xpInCurrentLevel / 250) * 100, 100);
  };


  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your growth journey...</p>
      </div>
    );
  }

  const currentLevel = getCurrentLevelInfo();
  const nextLevel = getNextLevelInfo();
  const progressPercent = getProgressPercentage();

  return (
    <div style={styles.container}>
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            style={styles.levelUpNotification}
          >
            <FaCrown size={50} color="#fbbf24" />
            <h2>LEVEL UP!</h2>
            <p>You've reached {currentLevel.name}!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={styles.title}>
          <FaTrophy color="#fbbf24" /> Your Growth Journey
        </h1>
        <p style={styles.subtitle}>Progress through 15 legendary levels</p>
      </motion.div>

      {/* Current Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          ...styles.currentLevelCard,
          background: `linear-gradient(135deg, ${currentLevel.color}22, ${currentLevel.color}44)`,
          borderColor: currentLevel.color,
        }}
      >
        <div style={styles.levelIcon}>{currentLevel.icon}</div>
        <div style={styles.levelInfo}>
          <h2 style={styles.levelName}>
            Level {currentLevel.id}: {currentLevel.name}
          </h2>
          <p style={styles.xpText}>
            {userXP} / {nextLevel.xpRequired} XP
          </p>
        </div>
        <div style={styles.levelBadge}>
          <FaStar color={currentLevel.color} size={24} />
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabels}>
          <span style={styles.progressLabel}>
            {currentLevel.name}
          </span>
          <span style={styles.progressLabel}>
            {progressPercent.toFixed(0)}%
          </span>
          <span style={styles.progressLabel}>
            {nextLevel.name}
          </span>
        </div>
        <div style={styles.progressBarBg}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              ...styles.progressBarFill,
              background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
            }}
          />
        </div>
      </div>

      {/* XP Actions */}
      <div style={styles.xpActions}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addXP(50)}
          style={styles.xpButton}
        >
          <FaFire /> +50 XP
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addXP(100)}
          style={styles.xpButton}
        >
          <FaBolt /> +100 XP
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addXP(250)}
          style={styles.xpButton}
        >
          <FaGem /> +250 XP
        </motion.button>
      </div>

      {/* Roadmap Path */}
      <div style={styles.roadmapContainer}>
        <h3 style={styles.roadmapTitle}>Level Roadmap</h3>
        <div style={styles.roadmapPath}>
          {LEVELS.map((level, index) => {
            const isUnlocked = userLevel >= level.id;
            const isCurrent = userLevel === level.id;
            const isNext = userLevel + 1 === level.id;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  ...styles.levelNode,
                  ...(isCurrent && styles.levelNodeCurrent),
                  ...(isNext && styles.levelNodeNext),
                  ...(!isUnlocked && styles.levelNodeLocked),
                }}
              >
                {/* Connector Line */}
                {index < LEVELS.length - 1 && (
                  <div
                    style={{
                      ...styles.connector,
                      background: isUnlocked
                        ? `linear-gradient(90deg, ${level.color}, ${LEVELS[index + 1].color})`
                        : '#333',
                    }}
                  />
                )}

                {/* Level Circle */}
                <motion.div
                  whileHover={isUnlocked ? { scale: 1.1 } : {}}
                  style={{
                    ...styles.levelCircle,
                    borderColor: isUnlocked ? level.color : '#555',
                    background: isUnlocked
                      ? `linear-gradient(135deg, ${level.color}33, ${level.color}66)`
                      : '#1a1a1a',
                    boxShadow: isCurrent
                      ? `0 0 30px ${level.color}`
                      : isUnlocked
                      ? `0 0 15px ${level.color}66`
                      : 'none',
                  }}
                >
                  <span style={styles.levelEmoji}>{level.icon}</span>
                  {isCurrent && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={styles.currentIndicator}
                    />
                  )}
                </motion.div>

                {/* Level Info */}
                <div style={styles.levelNodeInfo}>
                  <p style={styles.levelNodeName}>{level.name}</p>
                  <p style={styles.levelNodeXP}>{level.xpRequired} XP</p>
                  {isUnlocked && (
                    <FaStar color={level.color} size={12} style={styles.unlockedStar} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    padding: '40px 20px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: '#fff',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    color: '#fff',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.1)',
    borderTop: '4px solid #8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  levelUpNotification: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    padding: '40px 60px',
    borderRadius: '20px',
    textAlign: 'center',
    zIndex: 1000,
    boxShadow: '0 20px 60px rgba(251, 191, 36, 0.5)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '900',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#9ca3af',
  },
  currentLevelCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '30px',
    borderRadius: '20px',
    border: '2px solid',
    marginBottom: '30px',
    backdropFilter: 'blur(10px)',
    maxWidth: '800px',
    margin: '0 auto 30px',
  },
  levelIcon: {
    fontSize: '4rem',
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '10px',
  },
  xpText: {
    fontSize: '1.2rem',
    color: '#d1d5db',
  },
  levelBadge: {
    background: 'rgba(0,0,0,0.3)',
    padding: '15px',
    borderRadius: '50%',
  },
  progressContainer: {
    maxWidth: '800px',
    margin: '0 auto 40px',
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    fontWeight: '600',
  },
  progressBarBg: {
    width: '100%',
    height: '20px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 1s ease-out',
  },
  xpActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '50px',
    flexWrap: 'wrap',
  },
  xpButton: {
    padding: '15px 30px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
  },
  roadmapContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  roadmapTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '40px',
  },
  roadmapPath: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    position: 'relative',
  },
  levelNode: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '120px',
  },
  levelNodeCurrent: {
    transform: 'scale(1.1)',
  },
  levelNodeNext: {
    opacity: 0.9,
  },
  levelNodeLocked: {
    opacity: 0.4,
  },
  connector: {
    position: 'absolute',
    top: '40px',
    left: '100%',
    width: '20px',
    height: '4px',
    zIndex: 0,
  },
  levelCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '3px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.3s ease',
  },
  levelEmoji: {
    fontSize: '2.5rem',
  },
  currentIndicator: {
    position: 'absolute',
    inset: '-10px',
    border: '3px solid #fbbf24',
    borderRadius: '50%',
    borderTop: '3px solid transparent',
  },
  levelNodeInfo: {
    textAlign: 'center',
    marginTop: '10px',
  },
  levelNodeName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    marginBottom: '5px',
  },
  levelNodeXP: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  unlockedStar: {
    marginTop: '5px',
  },
};

export default LevelRoadmap;