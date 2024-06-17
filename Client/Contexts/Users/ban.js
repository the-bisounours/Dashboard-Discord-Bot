const { ContextMenuCommandBuilder, ApplicationCommandType, Client, ContextMenuCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("ban")
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
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas bannir propriétaire du serveur discord.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: ":x: Pourquoi essayez-vous de vous bannir ?",
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas m'bannir, essayer la commande /leave.",
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas bannir un membre plus haut que vous.",
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Je ne peux pas bannir un membre plus haut que moi.",
                ephemeral: true
            });
        };

        if (!member.bannable) {
            return await interaction.reply({
                content: ":x: Je ne peux pas bannir ce membre.",
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez été bannis par \`${interaction.user.displayName}\` pour \`aucune raison\`.`,
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

        return await interaction.guild.members.ban(member.user.id, {
            deleteMessageSeconds: 604800,
            reason: "aucune raison"
        })
            .then(async banInfo => {
                return await interaction.reply({
                    content: `Vous avez bannis \`${banInfo.username}\` pour \`aucune raison\`.`,
                });
            })
            .catch(async err => {
                console.log(err)
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été bannis à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};