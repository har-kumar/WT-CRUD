const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Airline")
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.log("Database connection error:", err);
    });

// Define the User model
const User = mongoose.model('User', { fullName: String, email: String, password: String, phone: String, destination: String, travelDate: Date });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register User
app.post('/register', (req, res) => {
    const { fullName, email, password, phone, destination, travelDate } = req.body;

    // Create a new user instance
    const newUser = new User({ fullName, email, password, phone, destination, travelDate });

    // Save the user to the database
    newUser.save()
        .then(() => {
            console.log("User registered successfully");
            res.status(200).json({ message: 'User registered successfully' });
        })
        .catch(error => {
            console.error("Error registering user:", error);
            res.status(500).json({ message: 'An error occurred' });
        });
});

// Login User
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password }).exec();
        if (user) {
            console.log("Login successful");
            res.status(200).json({ message: 'Login successful' });
        } else {
            console.log("Incorrect email or password");
            res.status(401).json({ message: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: 'An error occurred' });
    }
});
// Update User
app.post('/update', async (req, res) => {
    const { email, password, newFullName, newEmail, newPassword, newPhone, newDestination, newTravelDate } = req.body;
    try {
        const user = await User.findOne({ email, password }).exec();
        if (user) {
            // Update user's information
            user.fullName = newFullName || user.fullName;
            user.email = newEmail || user.email;
            user.password = newPassword || user.password;
            user.phone = newPhone || user.phone;
            user.destination = newDestination || user.destination;
            user.travelDate = newTravelDate || user.travelDate;
            await user.save();
            console.log("User updated successfully");
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            console.log("Incorrect email or password");
            res.status(401).json({ message: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Delete User
app.post('/delete', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password }).exec();
        if (user) {
            // Delete user
            await User.deleteOne({ email, password });
            console.log("User deleted successfully");
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            console.log("Incorrect email or password");
            res.status(401).json({ message: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
