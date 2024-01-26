const pool = require("../config/database.cjs");
const authService = require("../services/authenticationService.cjs");

const SELECT_USER_QUERY =
    "SELECT username, balance, first_name, last_name, password, user_id FROM accounts WHERE user_id = ?";

const userData = async (req, res) => {
    const { username, user_id } = authService.authenticateUser(req);

    try {
        const [rows] = await pool.query(SELECT_USER_QUERY, [user_id]);

        if (rows.length > 0) {
            const userData = rows[0];
            res.json({
                username: userData.username,
                balance: userData.balance,
                firstName: userData.first_name,
                lastName: userData.last_name,
                password: userData.password,
                id: user_id,
            });
        } else {
            res.status(404).json({ error: "User data not found" });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { userData };
