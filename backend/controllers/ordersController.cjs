const pool = require("../config/database.cjs");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const orders = async (req, res) => {
    const authHeader = req.headers.authorization;
    const id = req.headers.userinformation;
    let username = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    if (!username) {
        return res.status(401).json({ error: "Authentication required" });
    }

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
