import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiStar, FiTrendingUp, FiAward, FiZap, 
  FiCalendar, FiTarget, FiSettings, FiSave 
} from "react-icons/fi";

// Avatar customization options
const AVATAR_OPTIONS = {
  skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#654321'],
  hair: {
    styles: ['short', 'long', 'curly', 'bald', 'ponytail', 'mohawk'],
    colors: ['#2C1B18', '#724C34', '#8B4513', '#D2691E', '#FFD700', '#FF6347', '#9932CC']
  },
  eyes: ['#8B4513', '#228B22', '#4169E1', '#32CD32', '#FF1493', '#00CED1'],
  clothes: {
    tops: ['tshirt', 'hoodie', 'suit', 'tank', 'dress', 'armor'],
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
  },
  accessories: ['none', 'glasses', 'hat', 'crown', 'mask', 'earrings']
};

// Level system with unlocks
const LEVEL_UNLOCKS = {
  1: { hair: ['short'], clothes: ['tshirt'], accessories: ['none'] },
  3: { hair: ['long', 'curly'], clothes: ['hoodie'] },
  5: { accessories: ['glasses', 'hat'] },
  8: { clothes: ['suit', 'dress'], hair: ['ponytail'] },
  10: { accessories: ['crown'], clothes: ['armor'] },
  12: { hair: ['mohawk'], accessories: ['mask'] },
  15: { accessories: ['earrings'], special: 'legendary_aura' }
};

// Mock daily tasks data
const DAILY_TASKS = [
  { id: 1, name: 'Drink Water', xp: 5, completed: true },
  { id: 2, name: 'Exercise', xp: 15, completed: true },
  { id: 3, name: 'Read', xp: 10, completed: false },
  { id: 4, name: 'Meditate', xp: 8, completed: true },
  { id: 5, name: 'Code Practice', xp: 20, completed: false }
];

function Profile({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [avatar, setAvatar] = useState({
    skin: '#FDBCB4',
    hair: { style: 'short', color: '#2C1B18' },
    eyes: '#8B4513',
    clothes: { top: 'tshirt', color: '#4ECDC4' },
    accessories: 'none'
  });

  // User progress data (from API)
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    totalXp: 0,
    streak: 0,
    tasksCompleted: 0,
    badges: [],
    todayXp: 0,
    weeklyXp: 0
  });

  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [particles, setParticles] = useState([]);

  // Calculate level progress
  const currentLevelXp = userProgress.level * 1000;
  const nextLevelXp = (userProgress.level + 1) * 1000;
  const progressPercent = ((userProgress.xp - (userProgress.level - 1) * 1000) / 1000) * 100;

  // Load user data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch avatar
        const avatarResponse = await fetch('http://localhost:5000/api/users/avatar', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          setAvatar(avatarData.avatar);
        }

        // Fetch profile stats
        const statsResponse = await fetch('http://localhost:5000/api/users/profile-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setUserProgress({
            level: statsData.progress.level,
            xp: statsData.progress.xp,
            totalXp: statsData.progress.totalXp,
            streak: statsData.stats.streak,
            tasksCompleted: statsData.stats.tasksCompleted,
            badges: statsData.stats.badges,
            todayXp: statsData.progress.todayXp,
            weeklyXp: statsData.progress.weeklyXp
          });
          setDailyTasks(statsData.dailyTasks);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Level up animation
  const triggerLevelUp = () => {
    setShowLevelUp(true);
    createParticles();
    setTimeout(() => setShowLevelUp(false), 3000);
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  // Save avatar
  const saveAvatar = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/users/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar }),
      });

      if (response.ok) {
        console.log('Avatar saved successfully');
      } else {
        console.error('Failed to save avatar');
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Avatar component
  const AvatarDisplay = ({ avatar, size = 200, showAura = false }) => (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Legendary Aura */}
      {(showAura || userProgress.level >= 15) && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #ff6b6b)',
            filter: 'blur(8px)',
            opacity: 0.6
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {/* Avatar Body */}
      <div
        className="relative z-10 rounded-full border-4 border-white/20 overflow-hidden"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          background: avatar.skin,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}
      >
        {/* Hair */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '80%',
            height: '40%',
            background: avatar.hair.color,
            borderRadius: avatar.hair.style === 'curly' ? '50% 50% 40% 40%' : 
                         avatar.hair.style === 'long' ? '50% 50% 20% 20%' :
                         avatar.hair.style === 'mohawk' ? '20% 20% 50% 50%' : '50%'
          }}
        />
        
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: avatar.eyes }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: avatar.eyes }}
          />
        </div>
        
        {/* Clothes */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          style={{
            width: '90%',
            height: '50%',
            background: avatar.clothes.color,
            borderRadius: avatar.clothes.top === 'suit' ? '10px 10px 0 0' : '20px 20px 0 0'
          }}
        />
        
        {/* Accessories */}
        {avatar.accessories !== 'none' && (
          <div
            className="absolute"
            style={{
              top: avatar.accessories === 'hat' || avatar.accessories === 'crown' ? '5%' : '30%',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '1.5rem'
            }}
          >
            {avatar.accessories === 'glasses' && '👓'}
            {avatar.accessories === 'hat' && '🎩'}
            {avatar.accessories === 'crown' && '👑'}
            {avatar.accessories === 'mask' && '🎭'}
            {avatar.accessories === 'earrings' && '💎'}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-center"
            >
              <motion.h1
                className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                LEVEL UP!
              </motion.h1>
              <p className="text-2xl">Level {userProgress.level + 1} Achieved! 🎉</p>
            </motion.div>
            
            {/* Particles */}
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1, 0],
                  y: -100,
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: particle.delay,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Character Profile
        </h1>
        <p className="text-gray-300">{user?.name || user?.email}</p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Display */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
            <div className="text-center mb-6">
              <AvatarDisplay avatar={avatar} size={200} showAura={userProgress.level >= 15} />
              <div className="mt-4">
                <h3 className="text-xl font-bold">Level {userProgress.level}</h3>
                <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  {userProgress.xp - (userProgress.level - 1) * 1000} / 1000 XP
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={triggerLevelUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg font-bold text-black"
            >
              🎉 Test Level Up
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-black/40 backdrop-blur-xl rounded-xl p-1 border border-purple-500/30">
            {[
              { id: 'stats', label: 'Stats', icon: FiTrendingUp },
              { id: 'customize', label: 'Customize', icon: FiSettings },
              { id: 'tasks', label: 'Daily Tasks', icon: FiTarget }
            ].map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon size={18} />
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* XP Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Today XP', value: userProgress.todayXp, icon: FiZap, color: 'from-green-400 to-blue-500' },
                  { label: 'Weekly XP', value: userProgress.weeklyXp, icon: FiCalendar, color: 'from-purple-400 to-pink-500' },
                  { label: 'Total XP', value: userProgress.totalXp, icon: FiStar, color: 'from-yellow-400 to-orange-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                        <stat.icon className="text-white" size={20} />
                      </div>
                      <span className="text-gray-300">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              {/* Achievements */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiAward className="text-yellow-400" />
                  Achievements & Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  {userProgress.badges.map((badge, index) => (
                    <motion.div
                      key={badge}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm"
                    >
                      🏆 {badge}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Customize Tab */}
          {activeTab === 'customize' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
            >
              <h3 className="text-xl font-bold mb-6">Customize Your Avatar</h3>
              
              {/* Customization Options */}
              <div className="space-y-6">
                {/* Skin Color */}
                <div>
                  <label className="block text-sm font-medium mb-3">Skin Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.skin.map(color => (
                      <motion.button
                        key={color}
                        onClick={() => setAvatar({...avatar, skin: color})}
                        className={`w-8 h-8 rounded-full border-2 ${avatar.skin === color ? 'border-white' : 'border-gray-600'}`}
                        style={{ backgroundColor: color }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair Style & Color */}
                <div>
                  <label className="block text-sm font-medium mb-3">Hair Style</label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {AVATAR_OPTIONS.hair.styles.map(style => {
                      const isUnlocked = Object.values(LEVEL_UNLOCKS)
                        .slice(0, userProgress.level)
                        .some(unlock => unlock.hair?.includes(style));
                      
                      return (
                        <motion.button
                          key={style}
                          onClick={() => isUnlocked && setAvatar({...avatar, hair: {...avatar.hair, style}})}
                          className={`p-3 rounded-lg border text-sm capitalize ${
                            avatar.hair.style === style 
                              ? 'border-cyan-400 bg-cyan-400/20' 
                              : isUnlocked 
                                ? 'border-gray-600 hover:border-gray-400' 
                                : 'border-gray-800 text-gray-600 cursor-not-allowed'
                          }`}
                          whileHover={isUnlocked ? { scale: 1.02 } : {}}
                          disabled={!isUnlocked}
                        >
                          {style} {!isUnlocked && '🔒'}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  <label className="block text-sm font-medium mb-3">Hair Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_OPTIONS.hair.colors.map(color => (
                      <motion.button
                        key={color}
                        onClick={() => setAvatar({...avatar, hair: {...avatar.hair, color}})}
                        className={`w-8 h-8 rounded-full border-2 ${avatar.hair.color === color ? 'border-white' : 'border-gray-600'}`}
                        style={{ backgroundColor: color }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <motion.button
                  onClick={saveAvatar}
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
                    saving 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
                  }`}
                >
                  <FiSave />
                  {saving ? 'Saving...' : 'Save Avatar'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Daily Tasks Tab */}
          {activeTab === 'tasks' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30"
            >
              <h3 className="text-xl font-bold mb-6">Today's Tasks</h3>
              <div className="space-y-3">
                {DAILY_TASKS.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      task.completed 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        task.completed ? 'border-green-500 bg-green-500' : 'border-gray-400'
                      }`}>
                        {task.completed && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.name}</span>
                    </div>
                    <span className="text-yellow-400 font-bold">+{task.xp} XP</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
