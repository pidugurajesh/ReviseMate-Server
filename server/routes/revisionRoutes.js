const express = require("express");
const { getRevisions, markRevisionComplete, snoozeRevision } = require("../controllers/revisionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getRevisions);
router.put("/:id/complete", markRevisionComplete);
router.put("/:id/snooze", snoozeRevision);

module.exports = router;
