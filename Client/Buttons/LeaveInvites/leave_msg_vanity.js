const { Client, ButtonInteraction, ActionRowBuilder, ChannelSelectMenuBuilder, ButtonStyle, ButtonBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { Guilds, Users } = require("../../Models");
const replace = require("../../Functions/Gestions/replace");

module.exports = {
    id: "leave_msg_vanity",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de cette commande.`,
                ephemeral: true
            });
        };

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        const user = await Users.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations du message de départ")
                    .setColor("Blurple")
                    .setDescription(`Vous êtes en train de modifier les messages de départ (\`vanity\`). Il est actuellement défini sur:\n\`\`\`\n${data.invites.leaveMessage.vanity ? data.invites.leaveMessage.vanity : "Aucun"}\n\`\`\`\n\n**Aperçu du message:** \n${replace(data.invites.leaveMessage.vanity, {
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
                            .setCustomId("leave_vanity_edit")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.pencil}`)
                            .setLabel("Modifier")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("leave_vanity_reset")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.delete}`)
                            .setLabel("Réinitialiser")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("delete")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.no}`)
                            .setLabel("Annuler")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};