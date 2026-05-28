const StudiedTopic = require("../models/StudiedTopic");
const Revision = require("../models/Revision");
const { getFirstRevisionDate } = require("../utils/revisionUtils");
const { updateStreak } = require("../utils/streakUtils");

const getStudiedTopics = async (req, res) => {
  const { q = "", subject, confidence } = req.query;
  const filter = { userId: req.user.id };
  if (subject) filter.subject = subject;
  if (confidence) filter.confidence = Number(confidence);
  if (q) filter.topic = { $regex: q, $options: "i" };
  const topics = await StudiedTopic.find(filter).sort({ studiedDate: -1 });
  res.json(topics);
};

const createStudiedTopic = async (req, res) => {
  try {
    const studiedDate = req.body.studiedDate || new Date();
    const firstRevisionDate = getFirstRevisionDate(studiedDate);
    const topic = await StudiedTopic.create({
      ...req.body,
      userId: req.user.id,
      studiedDate,
      revisionDates: [firstRevisionDate],
      repetitionCount: 0,
      easinessFactor: 2.5,
      interval: 0,
    });

    await Revision.create({
      userId: req.user.id,
      topicId: topic._id,
      revisionDate: firstRevisionDate,
    });

    await updateStreak(req.user.id);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: "Failed to create studied topic", error: error.message });
  }
};

const updateStudiedTopic = async (req, res) => {
  try {
    const refreshedStudiedDate = new Date();
    const firstRevisionDate = getFirstRevisionDate(refreshedStudiedDate);

    const topic = await StudiedTopic.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        ...req.body,
        studiedDate: refreshedStudiedDate,
        revisionDates: [firstRevisionDate],
        repetitionCount: 0,
        easinessFactor: 2.5,
        interval: 0,
      },
      { returnDocument: "after" }
    );

    if (topic) {
      await Revision.deleteMany({ topicId: topic._id, userId: req.user.id });
      await Revision.create({
        userId: req.user.id,
        topicId: topic._id,
        revisionDate: firstRevisionDate,
      });
      await updateStreak(req.user.id);
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Failed to update studied topic", error: error.message });
  }
};

const deleteStudiedTopic = async (req, res) => {
  await StudiedTopic.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  await Revision.deleteMany({ topicId: req.params.id, userId: req.user.id });
  res.json({ message: "Studied topic deleted" });
};

module.exports = {
  getStudiedTopics,
  createStudiedTopic,
  updateStudiedTopic,
  deleteStudiedTopic,
};
