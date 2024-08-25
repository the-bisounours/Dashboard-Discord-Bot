const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Permet de connaitre la latence.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const startTime = Date.now();
        await mongoose.connection.db.collection("admin").findOne();
        const ping = Date.now() - startTime;

        return await interaction.reply({
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