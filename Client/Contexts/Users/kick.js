const { ContextMenuCommandBuilder, ApplicationCommandType, Client, ContextMenuCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("kick")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setType(ApplicationCommandType.User),

    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const member = interaction.guild.members.cache.get(interaction.targetId);

        if(!member) { 
            return await interaction.reply({
                content: `${client.emo.no} Je n'arrive pas a trouver le membre.`,
                ephemeral: true
            });
        };

        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas exclure propriétaire du serveur discord.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: ":x: Pourquoi essayez-vous de vous exclure ?",
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas m'exclure, essayer la commande /leave.",
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas exclure un membre plus haut que vous.",
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Je ne peux pas exclure un membre plus haut que moi.",
                ephemeral: true
            });
        };

        if (!member.kickable) {
            return await interaction.reply({
                content: ":x: Je ne peux pas exclure ce membre.",
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez été exclus par \`${interaction.user.displayName}\` pour \`aucune raison\`.`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("send")
.setStyle(ButtonStyle.Secondary)
                                    .setLabel(`Envoyé depuis ${interaction.guild.name}`)
                                    .setDisabled(true)
                            )
                    ]
                });
            } catch (err) {};
        };

        return await interaction.guild.members.kick(member.user.id, "aucune raison")
            .then(async kickInfo => {
                return await interaction.reply({
                    content: `Vous avez exclus \`${kickInfo.username}\` pour \`aucune raison\`.`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été exclus à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};