const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds, Tickets } = require("../../Models");

module.exports = {
    id: "claim",

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
                content: ":x: Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        const ticket = await Tickets.findOne({
            guildId: interaction.guild.id,
            channelId: interaction.channel.id
        });

        if (!ticket) {
            return await interaction.reply({
                content: "Impossible de trouver la base du ticket.",
                ephemeral: true
            });
        };

        if (ticket.claimed && interaction.guild.members.cache.get(ticket.claimedId)) {
            return await interaction.reply({
                content: `${interaction.guild.members.cache.get(ticket.claimedId)} à déjà réclamé le ticket.`,
                ephemeral: true
            });
        };

        ticket.claimed = true;
        ticket.claimedId = interaction.user.id;
        await ticket.save();

        await interaction.message.edit({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("close")
                            .setDisabled(false)
                            .setEmoji("🔒")
                            .setLabel("Fermé")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("close_reason")
                            .setDisabled(false)
                            .setEmoji("🔒")
                            .setLabel("Fermé avec raison")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ticket réclamé")
                    .setDescription(`Votre ticket sera traité par ${interaction.user}`)
                    .setColor("Blurple")
                    .setFooter({
                        text: "Fait par the_bisounours",
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        });
    }
};