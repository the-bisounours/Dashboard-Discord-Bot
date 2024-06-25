const { Client, ButtonInteraction, ActionRowBuilder, ChannelSelectMenuBuilder, ButtonStyle, ButtonBuilder, ChannelType } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "leave_logs_delete",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };
        
        data.invites.leaveChannel = "";
        await data.save();

        return await interaction.update({
            content: "Le salon de départ a été réinitialiser avec succès.",
            embeds: [],
            components: [],
            ephemeral: true
        });
    }
};