const { Client } = require("discord.js");
const mongoose = require("mongoose");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    
    mongoose.connect(process.env.mongoDB);
    mongoose.connection.on("connected", () => {
        console.log("\x1b[36m", "La base de donnée est connectée.");
    });
};