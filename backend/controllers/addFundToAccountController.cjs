const pool = require("../config/database.cjs");
const authService = require("../services/authenticationService.cjs");

const addFundToAccount = async (req, res) => {
    const data = req.body;
    const { user_id, username } = authService.authenticateUser(req);

    const amount = parseFloat(data.amount);

    const updateSql =
        "UPDATE accounts SET balance = balance + ? " + "WHERE user_id = ?";
    const updateValues = [amount, user_id];
    await pool.query(updateSql, updateValues);
    res.json({ message: "Amount added to account" });
};

module.exports = { addFundToAccount };
