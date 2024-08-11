const { Client } = require("discord.js");
const mongoose = require("mongoose");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.dblogs = [];
    
    mongoose.connect(process.env.mongoDB);

    mongoose.set("debug", (collectionName, method, query, doc) => {
        client.dblogs.push(`${collectionName}.${method}${query ? ` ${JSON.stringify(query)}` : ""}${doc ? ` ${doc}` : ""}`)
    });
};