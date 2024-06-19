const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Warns } = require("../../Models");
const id = require("../../Functions/id");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Permet d'avertir un utilisateur du serveur discord.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à avertir du serveur discord.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison l'avertissement du membre.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve l'avertissement du membre.")
            .setRequired(false)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas avertir propriétaire du serveur discord.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: ":x: Pourquoi essayez-vous de vous avertir ?",
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas m'avertir, essayer la commande /leave.",
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas avertir un membre plus haut que vous.",
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Je ne peux pas avertir un membre plus haut que moi.",
                ephemeral: true
            });
        };
        
        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez été averti par \`${interaction.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel(`Envoyé depuis ${interaction.guild.name}`)
                                    .setDisabled(true)
                            )
                    ]
                });
            } catch (err) {};
        };

        return await new Warns({ 
            guildId: interaction.guild.id,
            userId: member.user.id,
            warnId: id("warn", 8), 
            raison: raison, 
            time: Date.now(),
            by: interaction.user.id,
            preuve: interaction.options.getAttachment("preuve") ? interaction.options.getAttachment("preuve").url : ""
        }).save()
            .then(async () => {
                return await interaction.reply({
                    content: `Vous avez averti \`${member.user.username}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été averti à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};