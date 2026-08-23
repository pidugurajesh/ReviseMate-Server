const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "StudiedTopic", required: true },
    revisionDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    snoozedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Revision", revisionSchema);
