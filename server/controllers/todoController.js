const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
  const { q = "", status, subject } = req.query;
  const filter = { userId: req.user.id };
  if (status === "completed") filter.completed = true;
  if (status === "pending") filter.completed = false;
  if (subject) filter.subject = subject;
  if (q) filter.title = { $regex: q, $options: "i" };
  const todos = await Todo.find(filter).sort({ createdAt: -1 });
  res.json(todos);
};

const createTodo = async (req, res) => {
  const todo = await Todo.create({ ...req.body, userId: req.user.id });
  res.status(201).json(todo);
};

const updateTodo = async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { returnDocument: "after" }
  );
  res.json(todo);
};

const deleteTodo = async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Todo deleted" });
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
