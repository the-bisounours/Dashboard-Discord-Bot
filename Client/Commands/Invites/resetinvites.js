const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Users } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetinvites")
        .setDescription("Permet de réinitialiser les invitations.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub
            .setName("all")
            .setDescription("Réinitialise les invitations de tous le monde.")
        )
        .addSubcommand(sub => sub
            .setName("user")
            .setDescription("Réinitialise les invitations d'une personne.")
            .addUserOption(option => option
                .setName("membre")
                .setDescription("Permet de réinitialiser les invitations du membre.")
                .setRequired(true)
            )
        ),

    category: "Invites",

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
                    data.invites = {
                        join: 0,
                        leave: 0,
                        fake: 0,
                        bonus: 0
                    };
                    
                    await data.save();
                }));

                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`✅ \`${dataAll.length}\` ont été réinitialiser avec succès en \`${new Date() - date}\`ms.`)
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setColor("Blurple")
                    ]
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
                        content: "Impossible de trouver la base de donnée de l'utilisateur.",
                        ephemeral: true
                    });
                };

                data.invites = {
                    join: 0,
                    leave: 0,
                    fake: 0,
                    bonus: 0
                };

                await data.save();

                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`✅ ${member} a été réinitialiser avec succès en \`${new Date() - date}\`ms.`)
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setColor("Blurple")
                    ]
                });
            break;
            default:
                break;
        };
    }
};