const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Users } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetxp")
        .setDescription("Permet de réinitialiser l'expérience.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub
            .setName("all")
            .setDescription("Réinitialise l'expérience de tous le monde.")
        )
        .addSubcommand(sub => sub
            .setName("user")
            .setDescription("Réinitialise l'expérience d'une personne.")
            .addUserOption(option => option
                .setName("membre")
                .setDescription("Permet de réinitialiser l'expérience du membre.")
                .setRequired(true)
            )
        ),

    category: "Niveaux",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const date = new Date();
        switch (interaction.options.getSubcommand()) {
            case "all":

                await interaction.deferReply();

                const dataAll = await Users.find({
                    guildId: interaction.guild.id
                });

                await Promise.all(dataAll.map(async data => {
                    data.leveling.xp = 0;
                    data.leveling.level = 0;
                    await data.save();
                }));

                return await interaction.editReply({
                    content: `${client.emo.yes} \`${dataAll.length}\` ont été réinitialiser avec succès en \`${new Date() - date}\`ms.`
                });

            break;
            case "user":

                const user = interaction.options.getUser("membre");
                const member = interaction.guild.members.cache.get(user.id);

                if (!member) {
                    return await interaction.reply({
                        content: `${client.emo.no} Je n'arrive pas a trouver le membre.`,
                        ephemeral: true
                    });
                };

                const data = await Users.findOne({
                    userId: member.user.id,
                    guildId: interaction.guild.id
                });

                if (!data) {
                    return await interaction.reply({
                        content: `${client.emo.no} L'utilisateur n'a aucun niveau.`,
                        ephemeral: true
                    });
                };

                data.leveling.xp = 0;
                data.leveling.level = 0;
                await data.save();

                return await interaction.reply({
                    content: `${client.emo.yes} ${member} a été réinitialiser avec succès en \`${new Date() - date}\`ms.`
                });
            break;
            default:
                break;
        };
    }
};