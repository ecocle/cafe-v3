const pool = require("../config/database.cjs");

const getDataCoffee = async (req, res) => {
    try {
        const queryDataCoffee = "SELECT * FROM coffee";
        let rows;

        const [result] = await pool.query(queryDataCoffee);

        if (!Array.isArray(result)) {
            console.error("Unexpected format for Coffee data");
            res.status(500).send("Internal Server Error");
            return;
        }

        rows = result;

        res.json(rows || []);
    } catch (err) {
        console.error("Error fetching coffee data:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getDataCoffee };
