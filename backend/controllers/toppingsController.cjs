const pool = require("../config/database.cjs");

const getToppings = async (req, res) => {
    try {
        const queryDataBreakfast = "SELECT * FROM toppings";
        let rows;

        const [result] = await pool.query(queryDataBreakfast);

        if (!Array.isArray(result)) {
            console.error("Unexpected format for toppings data");
            return res.status(500).send("Internal Server Error");
        }

        rows = result;

        res.json(rows || []);
    } catch (err) {
        console.error("Error fetching toppings data:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getToppings };
