const mongoose = require("mongoose");

const studiedTopicSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true, trim: true },
    subject: { type: String, default: "General", trim: true },
    notes: { type: String, default: "" },
    confidence: { type: Number, min: 1, max: 5, default: 3 },
    duration: { type: Number, min: 0, default: 0 },
    studiedDate: { type: Date, default: Date.now },
    revisionDates: [{ type: Date }],
    repetitionCount: { type: Number, default: 0 },
    easinessFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    flashcards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudiedTopic", studiedTopicSchema);
