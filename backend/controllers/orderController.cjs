const pool = require("../config/database.cjs");
const authService = require("../services/authenticationService.cjs");

const order = async (req, res) => {
    const data = req.body;

    const { username, user_id } = authService.authenticateUser(req);

    try {
        const result = await orderResult(data, user_id);
        res.json({ message: "Order placed successfully", result });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            error: "Error placing order",
            details: error.message,
        });
    }
};

const orderResult = async (data, user_id) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const selectedToppings = data.selectedToppings
            ? data.selectedToppings.join(",")
            : "";

        const sql = `
            INSERT INTO orders (first_name, last_name, item_type, temperature, size,
                                toppings, price, order_time, comments, cup, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
        `;

        const values = [
            data.firstName,
            data.lastName,
            data.name,
            data.temperature,
            data.selectedSize,
            selectedToppings,
            data.price,
            data.comments,
            data.useCup,
            user_id,
        ];

        const [result] = await pool.query(sql, values);

        const updateSql =
            "UPDATE accounts SET Balance = ? WHERE First_name = ?";
        const updateValues = [data.balance, data.firstName];

        await pool.query(updateSql, updateValues);

        return result;
    } catch (error) {
        console.error("Error in SQL execution or balance update:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = { order };
