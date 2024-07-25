const { Client, ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");
const fakeMessage = require("../../Functions/Invites/fakeMessage");

module.exports = {
    id: "add_fake",

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
                content: ":x: Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        if (data.invites.fake.obligation.includes("1") && data.invites.fake.obligation.includes("2")) {
            return await interaction.reply({
                content: "Vous avez déjà mis toutes les possibilités.",
                ephemeral: true
            });
        };

        return await interaction.update({
            embeds: [],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("add_fake")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .addOptions(
                                data.invites.fake.obligation.includes("1") ?
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel(fakeMessage("2").replace("**", "").replace("**", ""))
                                        .setValue("2")
                                    : new StringSelectMenuOptionBuilder()
                                        .setLabel(fakeMessage("1").replace("**", "").replace("**", ""))
                                        .setValue("1"),

                                    !data.invites.fake.obligation.includes("1") && !data.invites.fake.obligation.includes("2") ?
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel(fakeMessage("2").replace("**", "").replace("**", ""))
                                        .setValue("2")
                                    : new StringSelectMenuOptionBuilder()
                                    .setLabel(fakeMessage("1").replace("**", "").replace("**", ""))
                                    .setValue("1")
                            )
                    ),
                new ActionRowBuilder()
                    .addComponents(
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