const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { Guilds } = require("../../Models");
const fakeMessage = require("../../Functions/Invites/fakeMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("fakeconfig")
        .setDescription("Permet paramètrer le système de fausse invite.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    category: "Invites",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations du système de fausse invite")
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(`Le système est actuellement: ${data.invites.fake.enabled ? "✅" : "❌"} \`${data.invites.fake.enabled ? "Activé" : "Désactivé"}\` (\`${data.invites.fake.enabled ? "Les invitations doivent être considérées comme fausses en suivant les paramètres ci-dessous" : "Toutes les invitations sont considérées comme réelles"}\`)\n\n⛔ **Obligatoire:** (les utilisateurs doivent remplir toutes ces conditions)\n> - ${data.invites.fake.obligation.map(number => fakeMessage(number)).join("\n> - ")}\n\n🗑️ Réinitialiser le système par défaut`)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("fake_config")
                            .setDisabled(false)
                            .setEmoji(data.invites.fake.enabled ? "❌" : "✅")
                            .setLabel(data.invites.fake.enabled ? "Désactivé" : "Activé")
                            .setStyle(data.invites.fake.enabled ? ButtonStyle.Danger : ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("obligation_fake_edit")
                            .setDisabled(false)
                            .setEmoji("⛔")
                            .setLabel("Obligatoire")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("delete")
                            .setDisabled(false)
                            .setEmoji("❌")
                            .setLabel("Annuler")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};