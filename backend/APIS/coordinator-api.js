const express = require('express');
const coordinatorApp = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../Middlewares/verifyToken');
// Define a route to process the CSV file and update student records
const fs = require('fs');
const multer = require('multer');
const csv = require('fast-csv');
const upload = multer({ dest: 'uploads/' });


let coordinatorsCollection;
let studentsCollection;

coordinatorApp.use((req, res, next) => {
    coordinatorsCollection = req.app.get('coordinatorsCollection');
    studentsCollection = req.app.get('studentsCollection');
    next();
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "21501a0503@pvpsit.ac.in",
        pass: "inip melk qfpg koqe",
    },
});

const sendPlacementUpdateEmail = (email, companyName, state) => {
    try {
        const mailOptions = {
            from: {
                name: "Placements",
                address: "21501a0503@pvpsit.ac.in"
            },
            to: email,
            subject: `Placement update from ${companyName}`,
            text: state,
            html: state
        };
        sendMail(transporter, mailOptions);
    } catch (error) {
        console.error("Error sending placement update email:", error);
    }
};

const sendMail = (transporter, mailOptions) => {
    try {
        transporter.sendMail(mailOptions);
        console.log("Email sent");
        res.send({message:"Email Sent"});
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

coordinatorApp.get('/test-coordinator', (req, res) => {
    res.send("from coordinator");
});

coordinatorApp.post('/register', async (req, res) => {
    console.log('hello');
    let newCoordinator = req.body;
    console.log(newCoordinator);

    const coordinator = await coordinatorsCollection.findOne({ rollno: { $eq: newCoordinator.rollno } });

    if (!coordinator) {
        let hashPassword = await bcryptjs.hash(newCoordinator.password, 6);
        newCoordinator.password = hashPassword;
        coordinatorsCollection.insertOne(newCoordinator);
        res.send({ message: "new coordinator created" });
    } else {
        res.send({ message: "already exists" });
    }
});




coordinatorApp.post("/login", async (req, res) => {
    let coordinatorLogin = req.body;
    console.log(coordinatorLogin);
    let coordinator = await coordinatorsCollection.findOne({ rollno: coordinatorLogin.rollno });
    console.log(coordinator);
    if (!coordinator) {
        return res.send({ message: "Coordinator not found" });
    }
    let result = await bcryptjs.compare(coordinatorLogin.password, coordinator.password);
    if (!result) {
        return res.send({ message: "Password Incorrect" });
    }
    let signedToken = jwt.sign({ rollno: coordinator.rollno },
        'abcd',
        { expiresIn: 1200 }
    );
    delete coordinator.password;
    res.send({ message: "Login Successfully", token: signedToken, user: coordinator });
});




coordinatorApp.get('/coordinator/:username', verifyToken, async (req, res) => {
    let coordinatorUsername = req.params.username;
    let coordinatorDetails = await coordinatorsCollection.find({ username: coordinatorUsername }).toArray();
    res.send({ message: "articles list", payload: coordinatorDetails })
})

coordinatorApp.get('/placements', async (req, res) => {
    try {
        let studentsList = await studentsCollection.find().toArray();

        res.send({ message: "Students list for placements", payload: studentsList });
    } catch (error) {
        console.error("Error fetching students for placements:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

coordinatorApp.put('/student-password-update/:id', async (req, res) => {
    const stuId = req.params.id;
    const data = req.body
    const newPassword=data.password
    console.log(newPassword)
    try {
        const existingStudent = await studentsCollection.findOne({ rollno: { $regex: new RegExp('^' + stuId + '$', 'i') } })
        console.log(existingStudent);
        if (!existingStudent) {
            console.log("Student not found");
            return res.status(404).send({ message: "Student not found" });
        }
        console.log("udating password")
        let hashPassword = await bcryptjs.hash(newPassword, 6);
        await studentsCollection.findOneAndUpdate({ rollno: { $regex: new RegExp('^' + stuId + '$', 'i') } },
            { $set:{ password: hashPassword }},
            { returnDocument: "after" })
        console.log("password changed");
        res.send({ message: "Password updated", payload: hashPassword });

    } catch(error) {
        console.error("Error fetching Student ", error);
        res.status(500).send({ message: "Internal server error" });
    }
})


coordinatorApp.put('/update/:id', async (req, res) => {
    const stuId = req.params.id;
    const newData = req.body;
    console.log("Received data:", newData);
    console.log("Student ID:", stuId);
    let state = "";
    if (newData.status > 0) {
        state = `<b> Congratulations You have selected for ${newData.companyName} company \n contact to college management for more details</b>`
    } else if (newData.status < 0) {
        state = `Your application was rejected ${newData.companyName}\n never loose the hope`
    }

    try {
        const existingStudent = await studentsCollection.findOne({ rollno: { $regex: new RegExp('^' + stuId + '$', 'i') } });
        console.log(existingStudent);
        if (!existingStudent) {
            console.log("Student not found");
            return res.status(404).send({ message: "Student not found" });
        }
        const updatedCompanies = { ...existingStudent.companies, ...newData.companies };
        const update = await studentsCollection.findOneAndUpdate(
            { rollno: { $regex: new RegExp('^' + stuId + '$', 'i') } },
            { $set: { companies: updatedCompanies } },
            { returnDocument: "after" }
        );

        console.log("Updated document:", update);
        // console.log(newData.email);

        // // Check if email field exists in req.body
        // if (newData.email) {
        //     // After updating, send an email
        //     const mailOptions = {
        //         from: {
        //             name: "Placements", // Sender's name
        //             address: "21501a0503@pvpsit.ac.in" // Sender's email address
        //         },
        //         to: newData.email, // Use email from req.body as recipient
        //         subject: `Placemnt update from ${newData.companyName}`,

        //         text: state,
        //         html: state
        //     };

        //     // Call the sendMail function
        //     sendMail(transporter, mailOptions);
        // }

        res.send({ message: "Student updated", payload: update });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).send({ message: "Error updating student" });
    }
});


coordinatorApp.post('/process-csv/:id', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const data = [];
        const status = Number(req.params.id)

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ message: 'Error parsing CSV' });
            })
            .on('data', row => {
                data.push(row);
                console.log(row.RollNo);
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');
                res.json({ message: 'CSV file processed successfully' });

                for (let i = 0; i < data.length; i++) {
                    try {
                        const existingStudent = await studentsCollection.findOne({ rollno: { $regex: new RegExp('^' + data[i].RollNo + '$', 'i') } });

                        console.log(existingStudent);
                        if (!existingStudent) {
                            console.log("Student not found");
                            return res.status(404).send({ message: "Student not found" });
                        }
                        email = existingStudent.email;
                        console.log(data[i]);
                        const newData = {
                            companies: {
                                [data[i].Companyname]: status ? parseInt(status) : null
                            }
                        };

                        const updatedCompanies = { ...existingStudent.companies, ...newData.companies };
                        const update = await studentsCollection.findOneAndUpdate(
                            { rollno: { $regex: new RegExp('^' + data[i].RollNo + '$', 'i') } },
                            { $set: { companies: updatedCompanies } },
                            { returnDocument: "after" }
                        );
                        state = `<b> Congratulations You have selected for ${data[i].Companyname} company \n contact to college management for more details</b>`

                        console.log("Updated document:", update);
                        //sendPlacementUpdateEmail(email, data[i].Companyname, state);
                    } catch (error) {
                        console.error("Error updating student:", error);
                    }
                }
            });
    } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).json({ message: 'Error processing CSV file' });
    }
});


coordinatorApp.post('/process-csv-rejected/:id', upload.single('file'), async (req, res) => {
    try {
        const status = Number(req.params.id)
        const filePath = req.file.path;
        const data = [];

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ message: 'Error parsing CSV' });
            })
            .on('data', row => {
                data.push(row);
                console.log(row.RollNo);
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');
                res.json({ message: 'CSV file processed successfully' });

                for (let i = 0; i < data.length; i++) {
                    try {
                        const existingStudent = await studentsCollection.findOne({ rollno: { $regex: new RegExp('^' + data[i].RollNo + '$', 'i') } });
                        email = existingStudent.email;
                        console.log(existingStudent);
                        if (!existingStudent) {
                            console.log("Student not found");
                            return res.status(404).send({ message: "Student not found" });
                        }
                        console.log(data[i]);
                        const newData = {
                            companies: {
                                [data[i].Companyname]: status ? parseInt(status) : null
                            }
                        };

                        const updatedCompanies = { ...existingStudent.companies, ...newData.companies };
                        const update = await studentsCollection.findOneAndUpdate(
                            { rollno: { $regex: new RegExp('^' + data[i].RollNo + '$', 'i') } },
                            { $set: { companies: updatedCompanies } },
                            { returnDocument: "after" }
                        );
                        state = `Your application was rejected ${data[i].Companyname}\n never loose the hope`

                        console.log("Updated document:", update);
                       // sendPlacementUpdateEmail(email, data[i].Companyname, state);

                    } catch (error) {
                        console.error("Error updating student:", error);
                    }
                }
            });
    } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).json({ message: 'Error processing CSV file' });
    }
});


coordinatorApp.post('/process-csv-pending/:id', upload.single('file'), async (req, res) => {
    try {
        const status = null
        const filePath = req.file.path;
        const data = [];

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error('Error parsing CSV:', error);
                res.status(500).json({ message: 'Error parsing CSV' });
            })
            .on('data', row => {
                data.push(row);
                console.log(row.RollNo);
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');
                res.json({ message: 'CSV file processed successfully' });

                for (let i = 0; i < data.length; i++) {
                    try {
                        const existingStudent = await studentsCollection.findOne({ rollno: { $regex: new RegExp('^' + data[i].RollNo + '$', 'i') } });
                        console.log(existingStudent);
                        if (!existingStudent) {
                            console.log("Student not found");
                            return res.status(404).send({ message: "Student not found" });
                        }
                        console.log(data[i]);
                        const newData = {
                            companies: {
                                [data[i].Companyname]: status ? parseInt(status) : null
                            }
                        };

                        const updatedCompanies = { ...existingStudent.companies, ...newData.companies };
                        const update = await studentsCollection.findOneAndUpdate(
                            { rollno: { $regex: new RegExp('^' + data[i].RollNo + '$', 'i') } },
                            { $set: { companies: updatedCompanies } },
                            { returnDocument: "after" }
                        );

                        console.log("Updated document:", update);
                    } catch (error) {
                        console.error("Error updating student:", error);
                    }
                }
            });
    } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).json({ message: 'Error processing CSV file' });
    }
});



module.exports = coordinatorApp;
