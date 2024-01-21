const pool = require("../config/database.cjs");
const authService = require("../services/authenticationService.cjs");

const addFundToAccount = async (req, res) => {
    try {
        // Authenticate user and obtain user information
        const { id, username } = authService.authenticateUser(req);

        // Check if user is authenticated
        if (username) {
            const data = req.body;
            const amount = parseFloat(data.amount);

            // Validate the amount (you can add more validation if needed)
            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: "Invalid amount" });
            }

            // Update user's balance
            const updateSql =
                "UPDATE Accounts SET Balance = Balance + ? " +
                "WHERE User_name = ?";
            const updateValues = [amount, username];
            await pool.query(updateSql, updateValues);

            // Respond with success message
            res.json({ message: "Amount added to account" });
        } else {
            // User not authenticated
            res.status(401).json({ error: "User not logged in" });
        }
    } catch (error) {
        // Handle unexpected errors
        console.error("Error adding fund to account:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addFundToAccount };
