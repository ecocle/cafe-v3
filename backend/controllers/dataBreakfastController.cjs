const pool = require("../config/database.cjs");

const getDataBreakfast = async (req, res) => {
    try {
        const queryDataBreakfast = "SELECT * FROM breakfast";
        let rows;

        const [result] = await pool.query(queryDataBreakfast);

        if (!Array.isArray(result)) {
            console.error("Unexpected format for non caffeinated data");
            return res.status(500).send("Internal Server Error");
        }

        rows = result;

        res.json(rows || []);
    } catch (err) {
        console.error("Error fetching coffee data:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getDataBreakfast };
