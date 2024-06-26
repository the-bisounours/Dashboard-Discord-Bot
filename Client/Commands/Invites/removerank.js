const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removerank")
        .setDescription("Permet de retirer des récompenses.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addNumberOption(option => option
            .setName("invites")
            .setDescription("Permet de choisir la récompense a retirer.")
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

        const date = new Date();
        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        const rankIndex = data.invites.ranks.findIndex(rank => rank.invites === interaction.options.getNumber("invites"));
        if (rankIndex === -1) {
            return await interaction.reply({
                content: `La récompense avec \`${interaction.options.getNumber("invites")}\` invitations n'existe pas.`,
                ephemeral: true
            });
        };
        
        data.invites.ranks.splice(rankIndex, 1);
        await data.save();

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`✅ Vous avez retiré la récompense de \`${interaction.options.getNumber("invites")}\` invitations en \`${new Date() - date}\`ms.`)
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