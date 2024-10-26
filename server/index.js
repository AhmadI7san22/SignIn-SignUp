const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./model/User");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure secret key

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
                // Generate JWT token on successful login
                const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
                res.json({ message: "Success", token });
            } else {
                res.status(400).json({ message: "The password is incorrect" });
            }
        } else {
            res.status(400).json({ message: "No record existed" });
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
                .catch(err => res.status(400).json({ error: err.message }));
        })
        .catch(err => console.log(err.message));
});

app.get("/verifyToken", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.json({ message: "Token is valid", decoded });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(3001, () => {
    console.log("Server is running");
});
