const express = require("express");
const session = require("express-session");
const os = require("os");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const cluster = require("cluster");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

require("dotenv").config({ path: "../.env" });
const secretKey = process.env.SECRET_KEY;

app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
    }),
);

const apiRoutes = require("./routes/apiRoutes.cjs");

app.use("/api", apiRoutes);

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        worker.on("message", (message) => {
            if (message.type === "data") {
                console.log("Data from worker:", message.data);
            } else if (message.type === "error") {
                console.error("Error from worker:", message.error);
            }
        });
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const port = 5000;
    const host = "0.0.0.0";

    app.listen(port, host, () => {
        if (host === "0.0.0.0") {
            console.log("Server is accessible from any network interface");
            console.log(`- Local: http://localhost:${port}`);

            const interfaces = os.networkInterfaces();
            for (const iface of Object.values(interfaces)) {
                for (const alias of iface) {
                    if ("IPv4" !== alias.family || alias.internal !== false)
                        continue;
                    console.log(`- Network: http://${alias.address}:${port}`);
                }
            }
        } else {
            console.log(`Server running at http://${host}:${port}/`);
        }
    });
}
