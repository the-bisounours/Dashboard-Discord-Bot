const { ContextMenuCommandBuilder, ApplicationCommandType, Client, ContextMenuCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { Giveaways } = require("../../Models");
const endGiveaway = require("../../Functions/Giveaways/endGiveaway");

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("Terminé Giveaway")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .setType(ApplicationCommandType.Message),

    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const giveaway = await Giveaways.findOne({
            messageId: interaction.targetId
        });

        if (!giveaway) {
            return await interaction.reply({
                content: ":x: Le giveaway n'existe pas.",
                ephemeral: true
            });
        };

        if(giveaway.status === "ended") {
            return await interaction.reply({
                content: ":x: Le giveaway est déjà terminé.",
                ephemeral: true
            });
        };

        await interaction.reply({
            content: "Le giveaway sera terminé dans quelques secondes.",
            ephemeral: true
        });

        return await endGiveaway(client, giveaway.giveawayId, false);
    }
};