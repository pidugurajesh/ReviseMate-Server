const Revision = require("../models/Revision");
const StudiedTopic = require("../models/StudiedTopic");
const { calculateSM2 } = require("../utils/revisionUtils");
const { updateStreak } = require("../utils/streakUtils");

const getRevisions = async (req, res) => {
  const now = new Date();
  const revisions = await Revision.find({ userId: req.user.id })
    .populate("topicId", "topic subject confidence flashcards notes")
    .sort({ revisionDate: 1 });

  const data = revisions.map((item) => ({
    ...item.toObject(),
    status: item.completed
      ? "completed"
      : item.revisionDate <= now
      ? "due"
      : "upcoming",
    overdue: !item.completed && item.revisionDate < new Date(now.toDateString()),
  }));
  res.json(data);
};

const markRevisionComplete = async (req, res) => {
  try {
    const revision = await Revision.findOne({ _id: req.params.id, userId: req.user.id });
    if (!revision) {
      return res.status(404).json({ message: "Revision not found" });
    }

    const topic = await StudiedTopic.findOne({ _id: revision.topicId, userId: req.user.id });
    if (!topic) {
      return res.status(404).json({ message: "Associated topic not found" });
    }

    const quality = typeof req.body.quality === "number" ? req.body.quality : 4;
    const sm2 = calculateSM2(quality, topic.repetitionCount, topic.interval, topic.easinessFactor);

    // Update topic values
    topic.repetitionCount = sm2.repetitions;
    topic.interval = sm2.interval;
    topic.easinessFactor = sm2.easinessFactor;

    if (sm2.interval > 0) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + sm2.interval);
      topic.revisionDates.push(nextDate);
      
      // Create next revision schedule
      await Revision.create({
        userId: req.user.id,
        topicId: topic._id,
        revisionDate: nextDate,
      });
    }
    
    await topic.save();

    // Mark current revision complete
    revision.completed = true;
    revision.completedAt = new Date();
    await revision.save();

    await updateStreak(req.user.id);

    res.json(revision);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark revision complete", error: error.message });
  }
};

const snoozeRevision = async (req, res) => {
  const minutes = Number(req.body.minutes || 60);
  const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000);
  const revision = await Revision.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { revisionDate: snoozedUntil, snoozedUntil },
    { returnDocument: "after" }
  );
  res.json(revision);
};

module.exports = { getRevisions, markRevisionComplete, snoozeRevision };
