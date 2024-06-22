const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Permet jouer a slots.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    category: "Jeux",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */

    execute: async (client, interaction) => {

        const symbols = ["🍒", "🍋", "🍇"];

        const results = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];

        const win = results[0] === results[1] && results[1] === results[2];

        const embed = new EmbedBuilder()
            .setTitle("Machine à sous")
            .setDescription(`Résultats : ${results.join(" | ")}`)
            .setColor("Blurple") 
            .addFields(
                {
                    name: "Résultat",
                    value: win ? "Vous avez gagné!" : "Vous avez perdu!"
                }
            );

        return await interaction.reply({ embeds: [embed] });
    }
};