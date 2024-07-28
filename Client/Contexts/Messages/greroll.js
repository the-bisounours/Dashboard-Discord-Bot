const { ContextMenuCommandBuilder, ApplicationCommandType, Client, ContextMenuCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { Giveaways } = require("../../Models");
const endGiveaway = require("../../Functions/Giveaways/endGiveaway");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Relancé Giveaway")
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
                content: `${client.emo.no} Le giveaway n'existe pas.`,
                ephemeral: true
            });
        };

        if(giveaway.status !== "ended") {
            return await interaction.reply({
                content: `${client.emo.no} Le giveaway n'est pas terminé.`,
                ephemeral: true
            });
        };

        await interaction.reply({
            content: `Le giveaway avec l'identifiant \`${giveaway.giveawayId}\` a été relancer.`
        });

        return await endGiveaway(client, giveaway.giveawayId, true);
    }
};