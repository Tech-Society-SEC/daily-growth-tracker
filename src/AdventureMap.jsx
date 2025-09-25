// src/AdventureMap.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiTarget, FiStar, FiZap, FiAward } from "react-icons/fi"; // Added FiAward for more options

// A decorative component for the floating nodes on the map
const MapNode = ({ className, delay }) => (
  <motion.div
    className={`absolute w-5 h-5 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full shadow-lg shadow-yellow-400/60 ${className}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: [0, 1, 0], scale: 1 }}
    transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

// A decorative component for the shimmering gems
const ShimmeringGem = ({ className, delay }) => (
  <motion.div
    className={`absolute w-3 h-3 bg-gradient-to-br from-purple-300 to-indigo-500 rounded-full shadow-lg shadow-purple-400/50 transform rotate-45 ${className}`}
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: [0, 0.8, 0], scale: [0.7, 1.2, 0.7] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);


function AdventureMap() {
  // Animation variants for staggering child animations
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
        duration: 0.7, // Slightly longer duration for a majestic feel
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Majestic background gradient with "stardust" particle effect
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden text-white font-serif
                    bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800
                    bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"> {/* Stardust texture */}
      
      {/* Floating Glow Background (majestic colors) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-fuchsia-400 opacity-20 blur-3xl rounded-full -top-20 -left-40 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] bg-amber-400 opacity-15 blur-3xl rounded-full -bottom-20 -right-40 animate-pulse-slow" />
        <div className="absolute w-80 h-80 bg-blue-400 opacity-15 blur-3xl rounded-full top-1/4 right-1/4 animate-pulse-slow" />
        <div className="absolute w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full bottom-1/3 left-1/4 animate-pulse-slow" />
      </div>

      {/* Decorative floating map nodes (golden) */}
      <MapNode className="top-[15%] left-[10%]" delay={0} />
      <MapNode className="top-[45%] left-[25%]" delay={1} />
      <MapNode className="top-[80%] left-[5%]" delay={2} />
      <MapNode className="top-[20%] right-[20%]" delay={0.5} />
      <MapNode className="top-[70%] right-[10%]" delay={1.5} />
      
      {/* NEW: Decorative shimmering gems (purple/indigo) */}
      <ShimmeringGem className="top-[30%] left-[5%]" delay={0.2} />
      <ShimmeringGem className="top-[60%] left-[15%]" delay={1.2} />
      <ShimmeringGem className="top-[10%] right-[10%]" delay={0.7} />
      <ShimmeringGem className="top-[50%] right-[25%]" delay={1.7} />


      {/* Center Content Card with enhanced Glassmorphism Effect */}
      <motion.div
        className="relative z-10 text-center max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-3xl p-12 mx-4 transform-gpu" // Added transform-gpu for better performance
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold mb-5 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-purple-300 drop-shadow-lg"
          variants={itemVariants}
        >
          ✨ Cosmic Journey Map
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-10 text-gray-200 max-w-md mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Embark on an epic quest through mystical lands. Gather ancient artifacts, overcome formidable guardians, and forge your legend!
        </motion.p>
        
        {/* Mission details section */}
        <motion.div
          className="my-10 text-left bg-white/5 p-7 rounded-2xl border border-white/15 shadow-inner"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold mb-5 text-center text-amber-300">Your Galactic Mandate</h3>
          <ul className="space-y-4 text-gray-100">
            <li className="flex items-center text-lg">
              <FiTarget className="mr-4 text-fuchsia-300" size={26} />
              Chart unknown constellations and discover new worlds.
            </li>
            <li className="flex items-center text-lg">
              <FiStar className="mr-4 text-fuchsia-300" size={26} />
              Collect cosmic shards to unlock legendary powers.
            </li>
            <li className="flex items-center text-lg">
              <FiZap className="mr-4 text-fuchsia-300" size={26} />
              Navigate perilous nebulae and outwit cosmic foes.
            </li>
            <li className="flex items-center text-lg">
              <FiAward className="mr-4 text-fuchsia-300" size={26} /> {/* New icon */}
              Claim your rightful place among the celestial heroes.
            </li>
          </ul>
        </motion.div>

        {/* Start Button */}
        <motion.div variants={itemVariants}>
          <Link to="/game">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(255, 200, 0, 0.8)", transition: { duration: 0.3 } }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 text-xl font-bold rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-red-600 hover:from-red-600 hover:to-gold-400 text-white shadow-xl transition-all duration-400 tracking-wider transform hover:-translate-y-1" // Added transform for subtle lift
              style={{
                // Custom gradient for a richer gold button
                backgroundImage: 'linear-gradient(to right, #FFD700, #FFA500, #FF8C00)', // Gold, Orange, Dark Orange
              }}
            >
              Begin Your Cosmic Quest ✨
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Tailwind CSS for custom pulse animation for the glows */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

export default AdventureMap;