const pool = require("../config/database.cjs");

const itemData = async (req, res) => {
    const { itemType, itemName } = req.params;

    try {
        const allowedTables = ["coffee", "non_caffeinated", "breakfast"];
        if (!allowedTables.includes(itemType)) {
            return res.status(400).json({ error: "Invalid item type" });
        }

        const query = `SELECT *
                       FROM ?? 
                       WHERE name = ?`;
        const [rows] = await pool.query(query, [itemType, itemName]);

        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: "No data found for this item" });
        }
    } catch (error) {
        console.error("Error fetching item data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { itemData };
