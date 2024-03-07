const { getFromCache, setInCache } = require("../services/cacheService.cjs");
const pool = require("../config/database.cjs");

const getToppings = async (req, res) => {
    try {
        const queryDataBreakfast = "SELECT * FROM toppings";

        const cachedResults = getFromCache(queryDataBreakfast);
        let rows;

        if (cachedResults) {
            rows = cachedResults;
        } else {
            const [result] = await pool.query(queryDataBreakfast);

            if (!Array.isArray(result)) {
                console.error("Unexpected format for toppings data");
                return res.status(500).send("Internal Server Error");
            }

            rows = result;

            setInCache(queryDataBreakfast, rows, 30 * 60);
        }

        res.json(rows || []);
    } catch (err) {
        console.error("Error fetching toppings data:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getToppings };
