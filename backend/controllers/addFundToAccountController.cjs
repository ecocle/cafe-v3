const pool = require("../config/database.cjs");
const authService = require("../services/authenticationService.cjs");

const addFundToAccount = async (req, res) => {
    const data = req.body;
    const { id, username } = authService.authenticateUser(req);

    const amount = parseFloat(data.amount);

    const updateSql =
        "UPDATE Accounts SET Balance = Balance + ? " + "WHERE User_name = ?";
    const updateValues = [amount, username];
    await pool.query(updateSql, updateValues);
    res.json({ message: "Amount added to account" });
};

module.exports = { addFundToAccount };
