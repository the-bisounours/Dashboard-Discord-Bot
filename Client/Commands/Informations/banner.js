const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banner")
        .setDescription("Permet de recupérer une bannière.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Permet de recupérer l'avatar.")
            .setRequired(false)
        ),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre");
        
        if(user && !user.banner) {
            return await interaction.reply({
                content: `\`${user.displayName}\` ne possède pas de bannière.`,
                ephemeral: true
            });
        };

        if(!user && !interaction.guild.banner) {
            return await interaction.reply({
                content: `${client.emo.no} Le serveur ne possède pas de bannière.`,
                ephemeral: true
            });
        };

        return await interaction.reply({
            content: `${user ? user.bannerURL() : interaction.guild.bannerURL()}`,
            ephemeral: true
        });
    }
};