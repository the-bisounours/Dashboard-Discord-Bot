const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    id: "dblogs",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de cette commande.`,
                ephemeral: true
            });
        };

        if (interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'etes pas le propriétaire du robot.`,
                ephemeral: true
            });
        };

        if (client.dblogs.length === 0) {
            return await interaction.reply({
                content: `${client.emo.no} Il n'y a aucun logs de la database.`,
                ephemeral: true
            });
        };

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Information des logs de la database - ${client.user.displayName}`)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setTimestamp()
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`\`\`\`js\n${client.dblogs.reverse().map(log => log).join("\n").slice(0, 3800)}\n\`\`\``)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("logsreload")
                            .setDisabled(false)
                            .setEmoji("🔄")
                            .setLabel("Rafraîchir les derniers logs de la database")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("return_dbconfig")
                            .setDisabled(false)
                            .setEmoji("◀️")
                            .setLabel("Retourner au menu principal")
                            .setStyle(ButtonStyle.Secondary)
                    )
            ],
            fetchReply: true
        });
    }
};