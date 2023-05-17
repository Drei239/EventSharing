const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const dbConfig = process.env.DB_CONNECTION;

const connectDatabase = async () => {
    try {
        const connect = await mongoose.connect(dbConfig);
        console.log(`DATABASE CONNECTED: ${connect.connection.host}`);
    } catch (e) {
        console.log("ERROR CONNECT TO DATABASE!");
    }
}

module.exports = connectDatabase;