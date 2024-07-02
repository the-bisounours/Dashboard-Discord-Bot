const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Warns } = require("../../Models");
const id = require("../../Functions/Gestions/id");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Permet de retirer un avertissement.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre a retirer l'avertissement du serveur discord.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("identifiant")
            .setDescription("L'identifiant de l'avertissement du membre.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison pour retirer l'avertissement du membre.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve pour retirer l'avertissement du membre.")
            .setRequired(false)
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";
        const warnId = interaction.options.getString("identifiant");

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas retirer un avertissement au propriétaire du serveur discord.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: ":x: Pourquoi essayez-vous de vous retirer un avertissement ?",
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas me retirer un avertissement, essayer la commande /leave.",
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas retirer un avertissement a un membre plus haut que vous.",
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Je ne peux pas retirer un avertissement a un membre plus haut que moi.",
                ephemeral: true
            });
        };

        const warn = await Warns.findOne({
            guildId: interaction.guild.id,
            userId: member.user.id,
            warnId: warnId
        });

        if (!warn) {
            return await interaction.reply({
                content: ":x: L'identifiant que vous avez renseigné n'est pas valide.",
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez été retirer d'un avertissement par \`${interaction.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
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
            } catch (err) { };
        };

        return await Warns.findOneAndDelete({
            guildId: interaction.guild.id,
            userId: member.user.id,
            warnId: warnId
        })
            .then(async () => {
                return await interaction.reply({
                    content: `Vous avez retirer un avertissement de \`${member.user.username}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été retirer d'un avertissement à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};