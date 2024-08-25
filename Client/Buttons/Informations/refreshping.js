const { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    id: "refreshping",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const startTime = Date.now();
        await mongoose.connection.db.collection("admin").findOne();
        const ping = Date.now() - startTime;

        return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations des latences")
                    .setColor("Blurple")
                    .addFields(
                        {
                            name: `${client.emo.robot} Robot`,
                            value: `> \`${Date.now() - interaction.createdTimestamp}\` ms.`,
                            inline: true
                        },
                        {
                            name: `${client.emo.region} API Discord`,
                            value: `> \`${Math.round(client.ws.ping)}\` ms.`,
                            inline: true
                        },
                        {
                            name: `${client.emo.home} MongoDB`,
                            value: `> \`${ping}\` ms.`,
                            inline: true
                        }
                    )
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("refreshping")
                            .setDisabled(false)
                            .setEmoji("🔁")
                            .setLabel("Rafraîchir la latence")
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId("delete")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.delete}`)
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};