const jwt = require("jsonwebtoken");
const pool = require("../config/database.cjs");

const secretKey = process.env.SECRET_KEY;
const SELECT_USER_QUERY =
    "SELECT User_name, Balance, First_name, Last_name, Password, ID FROM Accounts WHERE User_name = ?";

const userData = async (req, res) => {
    const authHeader = req.headers.authorization;
    let username = req.session.username;

    if (!username && authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            username = getUsernameFromToken(token);
        } catch (error) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    if (!username) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const [rows] = await pool.query(SELECT_USER_QUERY, [username]);

        if (rows.length > 0) {
            const userData = rows[0];
            res.json({
                username: userData.User_name,
                balance: userData.Balance,
                firstName: userData.First_name,
                lastName: userData.Last_name,
                password: userData.Password,
                id: userData.ID,
            });
        } else {
            res.status(404).json({ error: "User data not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUsernameFromToken = (token) => {
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken.username;
};

module.exports = { userData };
