const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Permet de faire quitter le robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        await interaction.reply({
            content: `Au revoir ! 👋`,
            ephemeral: true
        });

        return await interaction.guild.leave()
            .then(async guild => {
                try {
                    return await interaction.member.send({
                        content: `J'ai quitter le serveur \`${guild.name}\``,
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
            })
            .catch(async err => {
                return await interaction.editReply({
                    content: `Je n'ai pas quitter le serveur à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};