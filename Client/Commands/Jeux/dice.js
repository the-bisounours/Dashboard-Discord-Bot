const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Permet jouer a dice.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addIntegerOption(option => option
            .setName("faces")
            .setDescription("Nombre de faces du dé (maximum 100).")
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(100)
        ),

    category: "Jeux",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const faces = interaction.options.getInteger("faces");
        const result = Math.floor(Math.random() * faces) + 1;

        return await interaction.reply({
            content: `Vous avez lancé un dé à \`${faces}\` faces et obtenu \`${result}\`.`
        });
    }
};