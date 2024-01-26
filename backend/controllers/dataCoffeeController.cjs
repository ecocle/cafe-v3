const { getFromCache, setInCache } = require("../services/cacheService.cjs");
const pool = require("../config/database.cjs");

const getDataCoffee = async (req, res) => {
    try {
        const queryDataCoffee = "SELECT * FROM coffee";

        const cachedResults = getFromCache(queryDataCoffee);
        let rows;

        if (cachedResults) {
            rows = cachedResults;
        } else {
            const [result] = await pool.query(queryDataCoffee);

            if (!Array.isArray(result)) {
                console.error("Unexpected format for Coffee data");
                res.status(500).send("Internal Server Error");
                return;
            }

            rows = result;

            setInCache(queryDataCoffee, rows, 30 * 60);
        }

        res.json(rows || []);
    } catch (err) {
        console.error("Error fetching coffee data:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getDataCoffee };
