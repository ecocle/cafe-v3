const bcrypt = require("bcrypt");
const pool = require("../config/database.cjs");

const signUp = async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    try {
        const checkUserSql = "SELECT * FROM Accounts WHERE User_name = ?";
        const [existingUser] = await pool.execute(checkUserSql, [username]);

        if (existingUser.length > 0) {
            console.log("Username already exists");
            return res.status(400).json({ error: "Username already exists" });
        }

        const saltRounds = 10;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const insertUserSql =
            "INSERT INTO Accounts (User_name, Password, First_name, Last_name) VALUES (?, ?, ?, ?)";
        await pool.execute(insertUserSql, [
            username,
            encryptedPassword,
            firstName,
            lastName,
        ]);

        return res.json({ message: "Account created successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Error registering user" });
    }
};

module.exports = { signUp };
