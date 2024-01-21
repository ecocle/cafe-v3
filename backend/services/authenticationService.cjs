const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;

const authenticateUser = (req) => {
    const authHeader = req.headers.authorization;
    let id = "";
    let username = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
            const decodedToken = jwt.verify(token, secretKey);
            username = decodedToken.username;
            id = decodedToken.id;
        } catch (error) {
            throw new Error("Invalid token");
        }
    }

    if (!username) {
        throw new Error("Authentication required");
    }

    return { id, username };
};

module.exports = { authenticateUser };
