const Todo = require("../models/Todo");
const StudiedTopic = require("../models/StudiedTopic");
const Revision = require("../models/Revision");

const getAnalytics = async (req, res) => {
  const [todos, topics, revisions] = await Promise.all([
    Todo.find({ userId: req.user.id }),
    StudiedTopic.find({ userId: req.user.id }),
    Revision.find({ userId: req.user.id }),
  ]);

  const dailyStudyTimeMap = {};
  const subjectMap = {};
  topics.forEach((topic) => {
    const dateKey = new Date(topic.studiedDate).toISOString().slice(0, 10);
    dailyStudyTimeMap[dateKey] = (dailyStudyTimeMap[dateKey] || 0) + topic.duration;
    subjectMap[topic.subject] = (subjectMap[topic.subject] || 0) + topic.duration;
  });

  const totalStudyMinutes = topics.reduce((sum, topic) => sum + topic.duration, 0);
  const completedRevisions = revisions.filter((item) => item.completed).length;

  res.json({
    totalTopicsStudied: topics.length,
    totalStudyMinutes,
    pendingTodos: todos.filter((item) => !item.completed).length,
    completedTodos: todos.filter((item) => item.completed).length,
    completedRevisions,
    revisionCompletionRate: revisions.length
      ? Math.round((completedRevisions / revisions.length) * 100)
      : 0,
    dailyStudyTime: Object.entries(dailyStudyTimeMap).map(([date, minutes]) => ({ date, minutes })),
    subjectDistribution: Object.entries(subjectMap).map(([subject, minutes]) => ({ subject, minutes })),
  });
};

module.exports = { getAnalytics };
