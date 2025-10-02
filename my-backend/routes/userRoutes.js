const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get or create user profile
router.post("/profile", async (req, res) => {
  try {
    const { firebaseUid, email, name, photoURL } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: "Firebase UID and email are required" });
    }

    // Find existing user or create new one
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = new User({
        firebaseUid,
        email,
        name: name || email.split("@")[0],
        photoURL: photoURL || "",
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error("Error in /profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user by Firebase UID
router.get("/profile/:firebaseUid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
router.put("/profile/:firebaseUid", async (req, res) => {
  try {
    const { name, bio, photoURL } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { name, bio, photoURL },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user stats (XP, level, points)
router.patch("/profile/:firebaseUid/stats", async (req, res) => {
  try {
    const { xp, level, totalPoints, streak } = req.body;

    const updateData = {};
    if (xp !== undefined) updateData.xp = xp;
    if (level !== undefined) updateData.level = level;
    if (totalPoints !== undefined) updateData.totalPoints = totalPoints;
    if (streak !== undefined) updateData.streak = streak;
    updateData.lastActiveDate = new Date();

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating stats:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add achievement to user
router.post("/profile/:firebaseUid/achievements", async (req, res) => {
  try {
    const { name, icon } = req.body;

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      {
        $push: {
          achievements: {
            name,
            icon,
            unlockedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error adding achievement:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
