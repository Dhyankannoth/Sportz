const express = require("express");
const { getAllMatches, getMatchById } = require("../controllers/matchController");

const router = express.Router();

// GET /api/matches — list all matches (paginated, filterable)
router.get("/", getAllMatches);

// GET /api/matches/:id — single match with commentary
router.get("/:id", getMatchById);

module.exports = router;
