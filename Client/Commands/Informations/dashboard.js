const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dashboard")
        .setDescription("Permet d'afficher le lien du tableau de bord du serveur.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Tableau de bord du serveur ${interaction.guild.name}`)
                    .setDescription(`Cliquez sur le bouton ci-dessous pour accéder au tableau de bord du serveur ${interaction.guild.name}.\n\nSi vous rencontrez des problèmes lors de votre utilisation du tableau de bord, contactez l'équipe de ${client.user.displayName} sur le serveur support de [${client.user.displayName}](${process.env.supportInvite}).`)
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL(`${process.env.dashboard}/dashboard/${interaction.guild.id}`)
                            .setLabel("Tableau de board")
                    )
            ]
        });
    }
};