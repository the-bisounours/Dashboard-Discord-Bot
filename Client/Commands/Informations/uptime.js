const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const convert = require("../../Functions/Gestions/convert");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Permet de connaitre depuis combien de temps le robot est en ligne.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        return await interaction.reply({
            content: `Le robot est en ligne depuis ${convert(client.uptime, "millisecondes")}.`,
            ephemeral: true
        });
    }
};