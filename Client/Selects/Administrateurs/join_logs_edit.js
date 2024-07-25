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

        if(interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
                ephemeral: true
            });
        };
        
        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
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