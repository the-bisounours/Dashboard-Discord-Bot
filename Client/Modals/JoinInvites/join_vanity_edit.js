const { Client, ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds, Users } = require("../../Models");
const replace = require("../../Functions/replace");

module.exports = {
    id: "join_vanity_edit",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
                ephemeral: true
            });
        };

        let data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        data.invites.joinMessage.vanity =  interaction.fields.getTextInputValue("message");
        await data.save();

        const user = await Users.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations du message d'arrivé")
                    .setColor("Blurple")
                    .setDescription(`Vous êtes en train de modifier les messages d'arrivés (\`vanity\`). Il est actuellement défini sur:\n\`\`\`\n${data.invites.joinMessage.vanity ? data.invites.joinMessage.vanity : "Aucun"}\n\`\`\`\n\n**Aperçu du message:** \n${replace(data.invites.joinMessage.vanity, {
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
                            .setCustomId("join_vanity_edit")
                            .setDisabled(false)
                            .setEmoji("✏️")
                            .setLabel("Modifier")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("join_vanity_reset")
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