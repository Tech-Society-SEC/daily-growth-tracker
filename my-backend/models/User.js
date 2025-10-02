const mongoose = require("mongoose");

// 15 Level System (1000 XP to 15000 XP)
const LEVELS = [
  { id: 1, name: "Novice", xpRequired: 1000 },
  { id: 2, name: "Apprentice", xpRequired: 2000 },
  { id: 3, name: "Warrior", xpRequired: 3000 },
  { id: 4, name: "Champion", xpRequired: 4000 },
  { id: 5, name: "Gladiator", xpRequired: 5000 },
  { id: 6, name: "Conqueror", xpRequired: 6000 },
  { id: 7, name: "Warlord", xpRequired: 7000 },
  { id: 8, name: "Titan", xpRequired: 8000 },
  { id: 9, name: "Immortal", xpRequired: 9000 },
  { id: 10, name: "Celestial", xpRequired: 10000 },
  { id: 11, name: "Divine", xpRequired: 11000 },
  { id: 12, name: "Mythic", xpRequired: 12000 },
  { id: 13, name: "Ascendant", xpRequired: 13000 },
  { id: 14, name: "Transcendent", xpRequired: 14000 },
  { id: 15, name: "Omnipotent", xpRequired: 15000 },
];

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, default: "" },
  bio: { type: String, default: "" },
  photoURL: { type: String, default: "" },
  level: { type: Number, default: 1, min: 1, max: 15 },
  xp: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  tasksCompleted: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
