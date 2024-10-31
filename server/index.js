const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./model/User");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

mongoose.connect("mongodb+srv://ahmadehsanbishawi:Hm7532wbi0pny3oa@user.1bvbvtu.mongodb.net/User");

// Changed the /login route to use async/await
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
                res.json({ token });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "No user found with this email" });
        }
    } catch (err) {
        console.error("Login error: ", err);
        res.status(500).json({ error: err.message });
    }
});


// Updated register route to save hashed password under 'password' field
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            // Save the hashed password under the 'password' field
            UserModel.create({ name, email, password: hash })
                .then(user => res.json(user))
                .catch(err => res.json(err));
        })
        .catch(err => console.log(err.message));
});
app.get("/verifyToken", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.json({ message: "Token is valid" });
    });
});
    
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(3001, () => {
    console.log("Server is running");
});
