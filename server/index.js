const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./model/User");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

mongoose.connect("mongodb+srv://ahmadehsanbishawi:Hm7532wbi0pny3oa@user.1bvbvtu.mongodb.net/User");

// Changed the /login route to use async/await
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            // Use the comparePassword method to check if the password is correct
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                res.json("Success");
            } else {
                res.json("The password is incorrect");
            }
        } else {
            res.json("No record existed");
        }
    } catch (err) {
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

    
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(3001, () => {
    console.log("Server is running");
});
