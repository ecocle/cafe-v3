const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const authenticateUser = (req) => {
    const authHeader = req.headers.authorization;
    let user_id = "";
    let username = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
            user_id = decodedToken.user_id;
        } catch (error) {
            throw new Error("Invalid token");
        }
    }

    if (!username) {
        throw new Error("Authentication required");
    }

    return { user_id, username };
};

module.exports = { authenticateUser };
