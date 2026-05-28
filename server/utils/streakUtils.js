const User = require("../models/User");

const updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastActiveDate) {
      user.currentStreak = 1;
      user.longestStreak = 1;
      user.lastActiveDate = today;
    } else {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - lastActive.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day study
        user.currentStreak += 1;
        if (user.currentStreak > user.longestStreak) {
          user.longestStreak = user.currentStreak;
        }
        user.lastActiveDate = today;
      } else if (diffDays > 1) {
        // Streak broken
        user.currentStreak = 1;
        user.lastActiveDate = today;
      }
      // If diffDays === 0, they already studied today. Keep currentStreak active.
    }
    await user.save();
  } catch (error) {
    console.error("Failed to update streak:", error);
  }
};

module.exports = { updateStreak };
