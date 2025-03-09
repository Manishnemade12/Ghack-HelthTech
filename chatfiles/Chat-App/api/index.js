const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Message = require("./models/Message.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ws = require("ws");

// Initialize Express
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

// Middleware to verify token
async function getUserData(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (!token) return reject("No token provided");

        jwt.verify(token, jwtSecret, {}, (err, userdata) => {
            if (err) return reject("Invalid token");
            resolve(userdata);
        });
    });
}

// Test Route
app.get("/test", (req, res) => {
    res.json("test: ok");
});

// Get Messages for a User
app.get("/messages/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = await getUserData(req);
        const ourUserId = userData.userId;

        const messages = await Message.find({
            sender: { $in: [userId, ourUserId] },
            recipient: { $in: [userId, ourUserId] },
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
});

// Get List of People
app.get("/people", async (req, res) => {
    const users = await User.find({}, { _id: 1, username: 1 });
    res.json(users);
});

// Get Profile Data
app.get("/profile", async (req, res) => {
    try {
        const userData = await getUserData(req);
        res.json(userData);
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
});

// User Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });

    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie("token", token, { sameSite: "none", secure: true }).json({ id: foundUser._id });
            });
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// User Registration
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: "Username already taken" });
        }

        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({ username, password: hashedPassword });

        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie("token", token, { sameSite: "none", secure: true }).status(201).json({ id: createdUser._id });
        });
    } catch (err) {
        res.status(500).json({ error: `Internal Server Error ${err}`  });
    }
});

// Start Server
const server = app.listen(4040, () => console.log("🚀 Server running on port 4040"));

// WebSocket Server
const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(";").find(str => str.startsWith("token="));
        if (tokenCookieString) {
            const token = tokenCookieString.split("=")[1];
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if (err) throw err;
                    connection.userId = userData.userId;
                    connection.username = userData.username;
                });
            }
        }
    }

    connection.on("message", async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;

        if (recipient && text) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
            });

            [...wss.clients]
                .filter(c => c.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    _id: messageDoc._id,
                })));
        }
    });

    // Notify all clients about online users
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
            online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
        }));
    });
});
