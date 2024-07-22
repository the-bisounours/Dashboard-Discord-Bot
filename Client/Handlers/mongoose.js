const { Client } = require("discord.js");
const mongoose = require("mongoose");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    client.dblogs = [];
    
    mongoose.connect(process.env.mongoDB);

    mongoose.connection.on("connected", () => {
        console.log("La base de donnée est connectée.");
    });

    mongoose.connection.on("error", (err) => {
        console.error("Erreur de connexion à la base de données:", err);
    });

    mongoose.set("debug", (collectionName, method, query, doc) => {
        client.dblogs.push(`${collectionName}.${method}${query ? ` ${JSON.stringify(query)}` : ""}${doc ? ` ${doc}` : ""}`)
    });
};