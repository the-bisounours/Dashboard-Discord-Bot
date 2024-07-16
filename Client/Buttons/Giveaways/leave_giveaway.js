const { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Giveaways, Users } = require("../../Models");

module.exports = {
    id: "leave_giveaway",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const giveaway = await Giveaways.findOne({
            messageId: interaction.message.reference.messageId
        });

        if (!giveaway) {
            return await interaction.reply({
                content: ":x: Le giveaway n'existe plus.",
                ephemeral: true
            });
        };

        if (!giveaway.participants.some(user => user.userId === interaction.user.id)) {
            return await interaction.reply({
                content: ":x: Vous ne participez pas a ce concours.",
                ephemeral: true
            });
        };

        giveaway.participants = giveaway.participants.filter(user => user.userId !== interaction.user.id);
        await giveaway.save();

        await interaction.update({ fetchReply: true });
        return await (await interaction.message.fetchReference()).edit({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("enter_giveaway")
                            .setLabel("Participer au giveaway")
                            .setDisabled(false)
                            .setEmoji("🎉")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("participants")
                            .setLabel(`${giveaway.participants.length} participant${giveaway.participants.length > 1 ? "s": ""}`)
                            .setDisabled(true)
                            .setEmoji("✏️")
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        });
    }
};