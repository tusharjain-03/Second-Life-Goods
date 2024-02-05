const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

// connection object
const connection = mongoose.connection;

connection.on('connected', () => {
    console.log("Mongo DB connection successful");
});

connection.on('error', () => {
    console.log("Mongo DB connection failed");
});

module.exports = connection;

