const { Client, ButtonInteraction } = require("discord.js");

module.exports = {
    id: "delete",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        await interaction.update({ fetchReply: true });
        if (interaction.guild) {
            return await interaction.message.delete();
        } else {
            const channel = await client.channels.fetch(interaction.channelId);
            const message = await channel.messages.fetch(interaction.message.id);
            await message.delete();
        };
    }
};