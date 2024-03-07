const pool = require("../config/database.cjs");

const getDataNonCaffeinated = async (req, res) => {
    try {
        const queryDataNonCaffeinated = "SELECT * FROM non_caffeinated";
        let rows;

        const [result] = await pool.query(queryDataNonCaffeinated);

        if (!Array.isArray(result)) {
            console.error("Unexpected format for non-caffeinated data");
            return res.status(500).send("Internal Server Error");
        }

        rows = result;

        res.json(rows || []);
    } catch (err) {
        console.error("Error fetching non-caffeinated data:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getDataNonCaffeinated };
