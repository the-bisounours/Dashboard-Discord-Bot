const { Client, ChannelSelectMenuInteraction } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "join_logs_edit",

    /**
     * 
     * @param {Client} client 
     * @param {ChannelSelectMenuInteraction} interaction 
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

        data.invites.joinChannel = interaction.values[0];
        await data.save();

        return await interaction.update({
            components: [],
            content: `Le nouveau salon d'arrivé a été défini avec succès sur: ${interaction.guild.channels.cache.get(interaction.values[0])}`
        });
    }
};