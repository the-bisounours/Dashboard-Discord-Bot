const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js");
const { Guilds, Tickets } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-transfer")
        .setDescription("Permet de transférer la réclamation d'un ticket.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Permet de transférer la réclamation a l'utilisateur.")
            .setRequired(true)
        ),

    category: "Tickets",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

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
                content: ":x: Le salon n'est pas un ticket.",
                ephemeral: true
            });
        };

        if (interaction.channel.type === ChannelType.PrivateThread || interaction.channel.type === ChannelType.PublicThread) {
            return await interaction.reply({
                content: ":x: Le système pour réclamer ne fonctionne pas dans les threads.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: `:x: Vous ne pouvez vous transférer la réclamation du ticket.`,
                ephemeral: true
            });
        };

        if (member.user.bot) {
            return await interaction.reply({
                content: `:x: Vous ne pouvez pas transférer la réclamation a un bot.`,
                ephemeral: true
            });
        };

        if (!ticket.claimed || !interaction.guild.members.cache.get(ticket.claimedId)) {
            return await interaction.reply({
                content: `:x: Personne ne s'occupe du ticket.`,
                ephemeral: true
            });
        };

        ticket.claimed = true;
        ticket.claimedId = member.user.id;
        await ticket.save();

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Ticket réclamé")
                    .setDescription(`Votre ticket sera traité par ${member.user}`)
                    .setColor("Blurple")
                    .setFooter({
                        text: "Fait par the_bisounours",
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        });
    }
};