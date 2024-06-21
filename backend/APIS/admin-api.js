const express = require('express');
const adminApp = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

let adminsCollection;

adminApp.use((req, res, next) => {
    adminsCollection = req.app.get('adminsCollection');
    next();
});

adminApp.post('/admin-register', async (req, res) => {
    try {
        const newAdmin = req.body;
        const admin = await adminsCollection.findOne({ username: newAdmin.username });
        
        if (!admin) {
            const hashPassword = await bcryptjs.hash(newAdmin.password, 10);
            newAdmin.password = hashPassword;
            await adminsCollection.insertOne(newAdmin);
            res.status(201).send({ message: "New admin created" });
        } else {
            res.status(400).send({ message: "Admin already exists" });
        }
    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

adminApp.post("/admin-login", async (req, res) => {
    try {
        const adminLogin = req.body;
        const admin = await adminsCollection.findOne({ username: adminLogin.username });

        if (!admin) {
            return res.status(404).send({ message: "Admin not found" });
        }

        const result = await bcryptjs.compare(adminLogin.password, admin.password);
        if (!result) {
            return res.status(401).send({ message: "Incorrect password" });
        }

        const token = jwt.sign({ username: admin.username }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).send({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = adminApp;
