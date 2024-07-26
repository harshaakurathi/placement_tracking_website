const express = require('express');
const app = express();
const mongoose = require('mongoose');
const studentApp = require("./APIS/student-api");
const coordinatorApp = require("./APIS/coordinator-api");
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));



// MongoDB Atlas connection string
const url = 'mongodb+srv://Placements:12345@cluster0.nfezvjl.mongodb.net/placements?retryWrites=true&w=majority';

// Connect to MongoDB using Mongoose
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected successfully");

    // Define your collections after successful connection
    const db = mongoose.connection.db;
    const studentsCollection = db.collection('students');
    const coordinatorsCollection = db.collection('coordinators');
    const placementsCollection = db.collection('placements');

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
});

const port = 4000;
app.listen(port, () => console.log(`Server is running at port ${port}`));
