const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Permet de connaitre la latence du robot.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const startTime = Date.now();
        await mongoose.connection.db.collection("admin").findOne();
        const ping = Date.now() - startTime;

        return await interaction.reply({
            content: `La latence du robot est de ${Date.now() - interaction.createdTimestamp} millisecondes, la latence de l'API Discord est de ${Math.round(client.ws.ping)} millisecondes et la latence de la base de donnée est de ${ping} millisecondes`
        });
    }
};