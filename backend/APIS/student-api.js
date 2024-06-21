const express = require('express');
const studentApp = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../Middlewares/verifyToken');

let studentsCollection;

studentApp.use((req, res, next) => {
    studentsCollection = req.app.get('studentsCollection');
    next();
});

studentApp.get('/test-student', (req, res) => {
    res.send("from student");
});




studentApp.post('/register', async (req, res) => {
    let newStudent = req.body;
    const student = await studentsCollection.findOne({ rollno: { $eq: newStudent.rollno } });
    if (!student) {
        let hashPassword = await bcryptjs.hash(newStudent.password, 6);
        newStudent.password = hashPassword;
        
        // Initializing companies as an empty object
        newStudent.companies = {};

        studentsCollection.insertOne(newStudent);
        res.send({ message: "new student created" });
    } else {
        res.send({ message: "already exists" });
    }
});


studentApp.post("/login", async (req, res) => {
    let studentLogin = req.body;
    let student = await studentsCollection.findOne({ rollno: studentLogin.rollno });
    if (!student) {
        return res.send({ message: "Student not found" });
    }
    let result = await bcryptjs.compare(studentLogin.password, student.password);
    if (!result) {
        return res.send({ message: "Password Incorrect" });
    }
    let signedToken = jwt.sign({ rollno: student.rollno },
        'abcd',
        { expiresIn: 1200 }
    );
    delete student.password;
    res.send({ message: "Login Successfully", token: signedToken, user: student });
});

studentApp.get('/placements/:id', verifyToken, async (req, res) => {
    let studentID = Number(req.params.id);
    console.log(studentID);

    try {
        let placementList = await studentsCollection.find({ rollno: studentID }).toArray();
        console.log(placementList);

        res.send({ message: "Placement list", payload: placementList });
    } catch (error) {
        console.error("Error fetching placement list:", error);
        res.status(500).send({ message: "Error fetching placement list" });
    }
});



module.exports = studentApp;
