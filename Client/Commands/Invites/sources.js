const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Guilds } = require("../../Models");
const defaultDb = require("../../Functions/Gestions/defaultDb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sources")
        .setDescription("Permet de configurer les invitations.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub
            .setName("setmessage")
            .setDescription("Permet de mettre un message personnalisé.")
            .addStringOption(option => option
                .setName("message")
                .setDescription("Permet de mettre un message personnalisé.")
                .setRequired(true)
                .setMinLength(10)
                .setMaxLength(200)
            )
        )
        .addSubcommand(sub => sub
            .setName("resetmessage")
            .setDescription("Réinitialise le message personnalisé.")
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

        switch (interaction.options.getSubcommand()) {
            case "setmessage":

                data.invites.message = interaction.options.getString("message");
                await data.save();

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`${client.emo.yes} Le message a été ajouté avec succès en \`${new Date() - date}\`ms.`)
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setColor("Blurple")
                    ]
                });

            break;
            case "resetmessage":

                data.invites.message = defaultDb(Guilds.schema).invites.message;
                await data.save();

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`${client.emo.yes} Le message a été réinitialiser avec succès en \`${new Date() - date}\`ms.`)
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