const express = require("express");
const {
  createStudiedTopic,
  deleteStudiedTopic,
  getStudiedTopics,
  updateStudiedTopic,
} = require("../controllers/studiedController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getStudiedTopics);
router.post("/", createStudiedTopic);
router.put("/:id", updateStudiedTopic);
router.delete("/:id", deleteStudiedTopic);

module.exports = router;
