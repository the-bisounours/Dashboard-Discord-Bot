const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Users } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removeinvites")
        .setDescription("Permet de retirer des invitations.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Permet de retirer des invitations au membre.")
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName("bonus")
            .setDescription("Permet de retirer des invitations au membre.")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(1000)
        ),

    category: "Invites",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre");
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        const date = new Date();
        const data = await Users.findOne({
            userId: member.user.id,
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée de l'utilisateur.",
                ephemeral: true
            });
        };

        data.invites.bonus = data.invites.bonus - interaction.options.getNumber("bonus");
        await data.save();

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`✅ Vous avez supprimé avec succès \`${interaction.options.getNumber("bonus")}\` invitations bonus à ${member} en \`${new Date() - date}\`ms.`)
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