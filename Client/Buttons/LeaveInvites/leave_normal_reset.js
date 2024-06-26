const { Client, ButtonInteraction, ActionRowBuilder, ChannelSelectMenuBuilder, ButtonStyle, ButtonBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { Guilds, Users } = require("../../Models");
const replace = require("../../Functions/replace");
const defaultDb = require("../../Functions/defaultDb");

module.exports = {
    id: "leave_normal_reset",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
                ephemeral: true
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        data.invites.leaveMessage.normal = defaultDb(Guilds.schema).invites.leaveMessage.normal
        await data.save();

        const user = await Users.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations du message de départ")
                    .setColor("Blurple")
                    .setDescription(`Vous êtes en train de modifier les messages de départ (\`normal\`). Il est actuellement défini sur:\n\`\`\`\n${data.invites.leaveMessage.normal ? data.invites.leaveMessage.normal : "Aucun"}\n\`\`\`\n\n**Aperçu du message:** \n${replace(data.invites.leaveMessage.normal, {
                        member: client,
                        invite: interaction.user,
                        invites: user ? user.invites : null,
                        guild: interaction.guild
                    })}\n\nCliquez sur le ✏️ pour le modifier.\nCliquez sur le 🗑️ pour le réinitialiser.\nCliquez sur le ❌ pour annuler.`)
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
                            .setCustomId("leave_normal_edit")
                            .setDisabled(false)
                            .setEmoji("✏️")
                            .setLabel("Modifier")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("leave_normal_reset")
                            .setDisabled(false)
                            .setEmoji("🗑️")
                            .setLabel("Réinitialiser")
                            .setStyle(ButtonStyle.Danger),
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