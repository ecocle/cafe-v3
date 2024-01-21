const pool = require("../config/database.cjs");
const authService = require("../services/authenticationService.cjs");

const orders = async (req, res) => {
    const { username, id } = authService.authenticateUser(req);

    try {
        const date = req.query.date;
        let query = "";
        if (username === "Admin") {
            query = "SELECT * FROM Orders";
        } else {
            query = "SELECT * FROM Orders WHERE Order_ID = ?";
        }
        const queryParams = [id];

        if (date) {
            query += " WHERE DATE(order_time) = ?";
            queryParams.push(date);
        }

        query += " ORDER BY order_time DESC";

        const [results] = await pool.query(query, queryParams);
        res.json({ data: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { orders };
