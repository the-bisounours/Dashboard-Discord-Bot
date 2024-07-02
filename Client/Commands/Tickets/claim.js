const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js");
const { Guilds, Tickets } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-claim")
        .setDescription("Permet de réclamer un ticket.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    category: "Tickets",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
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

        const ticket = await Tickets.findOne({
            guildId: interaction.guild.id,
            channelId: interaction.channel.id
        });

        if (!ticket) {
            return await interaction.reply({
                content: "Le salon n'est pas un ticket.",
                ephemeral: true
            });
        };

        if (interaction.channel.type === ChannelType.PrivateThread || interaction.channel.type === ChannelType.PublicThread) {
            return await interaction.reply({
                content: "Le système pour réclamer ne fonctionne pas dans les threads.",
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