const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/login', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const UserModel = mongoose.model("users", userSchema);

// POST /login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ message: "Login successful", success: true });
        } else {
            res.json({ message: "Invalid username or password", success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
