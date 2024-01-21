const pool = require("../config/database.cjs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const signIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.execute(
            "SELECT * FROM Accounts WHERE User_name = ?",
            [username],
        );

        if (!user[0].length) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const storedPassword = user[0][0].Password;

        const isPasswordValid = await bcrypt.compare(password, storedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ username }, secretKey, { expiresIn: "30d" });

        return res.json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error logging in:", err);
        return res.status(500).json({ error: "Error logging in" });
    }
};

module.exports = { signIn };
