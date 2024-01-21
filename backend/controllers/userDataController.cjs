const pool = require("../config/database.cjs");
const authService = require("../services/authenticationService.cjs");

const SELECT_USER_QUERY =
    "SELECT User_name, Balance, First_name, Last_name, Password, ID FROM Accounts WHERE User_name = ?";

const userData = async (req, res) => {
    const { username, id } = authService.authenticateUser(req);

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

module.exports = { userData };
