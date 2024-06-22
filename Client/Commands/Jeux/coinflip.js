const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Permet jouer a coinflip.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    category: "Jeux",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const sides = ["pile", "face"];
        const result = sides[Math.floor(Math.random() * sides.length)];

        return await interaction.reply({
            content: `Vous avez lancé une pièce et obtenu \`${result}\`.`
        });
    }
};