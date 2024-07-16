const { ContextMenuCommandBuilder, ApplicationCommandType, Client, ContextMenuCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { Giveaways } = require("../../Models");
const endGiveaway = require("../../Functions/Giveaways/endGiveaway");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Supprimé Giveaway")
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

        if (giveaway.messageId && giveaway.channelId && interaction.guild.channels.cache.get(giveaway.channelId)) {
            try {
                const channel = interaction.guild.channels.cache.get(giveaway.channelId);
                if (channel) {
                    const message = await channel.messages.fetch(giveaway.messageId).catch(err => {
                        return null;
                    });

                    if (message) {
                        await message.delete().catch(err => err);
                    };
                };
            } catch (err) { };
        };

        await interaction.reply({
            content: `Le giveaway avec l'identifiant \`${giveaway.giveawayId}\` a été supprimé.`
        });

        return await Giveaways.deleteOne({
            messageId: interaction.targetId
        });
    }
};