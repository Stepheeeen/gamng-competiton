const express = require("express");
const multer = require("multer");
require("dotenv").config();
const bodyParser = require('body-parser');
const path = require("path")
const mongoose = require("mongoose");
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to the MongoDB database");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });
// create a schema

const notesSchema = new mongoose.Schema({
    first: String,
    last: String,
    other: String,
    email: String,
    date: String,
    state: String,
    street: String,
    city: String,
    ssn: String,
    teln: String,
    base64Data: String,
});

const Note = mongoose.model("Note", notesSchema);

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public"));
})

app.post("/upload", upload.array('images'), async (req, res) => {
    try {
        const mediaFile = [];

        // const base64Data = req.file.buffer.toString('base64');
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No image uploaded.');
        } 

        req.files.forEach(file => {
            const base64Data = file.buffer.toString('base64');

            mediaFile.push(base64Data);
        })

        let newNote = {
            first: req.body.first,
            last: req.body.last,
            other: req.body.other,
            email: req.body.email,
            date: req.body.date,
            state: req.body.state,
            street: req.body.street,
            city: req.body.city,
            ssn: req.body.ssn,
            teln: req.body.teln,
            mediaFile
        }

        await newNote.save();
        res.redirect("/public/index.html");
    } catch (error) {
        res.status(500).send('An error occurred while uploading user information and images.');
    }
});

app.use(express.static(__dirname + "/public"))
// Additional middleware and routes can be defined here

app.listen(3000, () => {
    console.log("server running on port");
})