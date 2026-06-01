const pool = require("../db/postgres.js");

// GET /api/matches
// Supports: ?status=Live&sport=Football&page=1&limit=10
const getAllMatches = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { status, sport } = req.query;

        // Build dynamic WHERE clause
        const conditions = [];
        const values = [];
        let paramIndex = 1;

        if (status) {
            conditions.push(`status = $${paramIndex++}`);
            values.push(status);
        }

        if (sport) {
            conditions.push(`sport = $${paramIndex++}`);
            values.push(sport);
        }

        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        // Get total count for pagination metadata
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM match ${whereClause}`,
            values
        );
        const total = parseInt(countResult.rows[0].count);

        // Fetch paginated matches
        const matchResult = await pool.query(
            `SELECT * FROM match ${whereClause} ORDER BY start_time DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            [...values, limit, offset]
        );

        res.status(200).json({
            matches: matchResult.rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        console.error("Error fetching matches:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/matches/:id
// Returns match details + commentary ordered by sequence_no
const getMatchById = async (req, res) => {
    try {
        const { id } = req.params;

        const matchResult = await pool.query(
            `SELECT * FROM match WHERE id = $1`,
            [id]
        );

        if (matchResult.rows.length === 0) {
            return res.status(404).json({ message: "Match not found" });
        }

        const commentaryResult = await pool.query(
            `SELECT * FROM commentary WHERE match_id = $1 ORDER BY sequence_no ASC`,
            [id]
        );

        res.status(200).json({
            match: matchResult.rows[0],
            commentary: commentaryResult.rows,
        });

    } catch (error) {
        console.error("Error fetching match:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getAllMatches, getMatchById };
