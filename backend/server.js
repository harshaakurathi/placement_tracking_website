const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const studentApp = require("./APIS/student-api");
const coordinatorApp = require("./APIS/coordinator-api");
const path = require('path');
const cors=require('cors');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(cors({
    origin:["https://deploy-mern-lwhq.versal.app"],
    methods:["POST","GET","PUT"],
    credentials:true
}))

const url = 'mongodb+srv://Placements:12345@cluster0.nfezvjl.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        const dbObj = client.db();
        const studentsCollection = dbObj.collection('students');
        const coordinatorsCollection = dbObj.collection('coordinators');
        const placementsCollection = dbObj.collection('placements');
        console.log("MongoDB connected successfully");

        app.set('studentsCollection', studentsCollection);
        app.set('coordinatorsCollection', coordinatorsCollection);
        app.set('placementsCollection', placementsCollection);
    })
    .catch(err => {
        console.error("Error in connecting to MongoDB Atlas: ", err);
        process.exit(1); // Exit the process with an error code
    });

app.use('/coordinator-api', coordinatorApp);
// app.use("/placement-api", placementApp);
app.use("/student-api", studentApp);

app.get('/', (req, res) => {
    res.send("GET Request Called")
})

const port = 4000;
app.listen(port, () => console.log(`Server is running at port ${port}`));
