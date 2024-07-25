const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrank")
        .setDescription("Permet d'ajouter des récompenses.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addRoleOption(option => option
            .setName("role")
            .setDescription("Permet le rôle de la récompenses.")
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName("invites")
            .setDescription("Permet de définir le nombre d'invitation pour la récompense.")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(1000)
        )
        .addStringOption(option => option
            .setName("description")
            .setDescription("Permet de définir la description de la récompense.")
            .setRequired(false)
            .setMinLength(10)
            .setMaxLength(100)
        ),

    category: "Invites",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const date = new Date();
        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        if (data.invites.ranks.filter(rank => rank.invites === interaction.options.getNumber("invites")).length !== 0) {
            return await interaction.reply({
                content: `Une récompense est déjà présente pour \`${interaction.options.getNumber("invites")}\` invitations.`,
                ephemeral: true
            });
        };

        data.invites.ranks.push({
            roleId: interaction.options.getRole("role").id,
            invites: interaction.options.getNumber("invites"),
            description: interaction.options.getString("description") || ""
        });

        await data.save();

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`✅ Vous avez ajouté le rôle ${interaction.options.getRole("role")} pour \`${interaction.options.getNumber("invites")}\` invitations en \`${new Date() - date}\`ms.`)
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp()
                .setColor("Blurple")
            ]
        });
    }
};