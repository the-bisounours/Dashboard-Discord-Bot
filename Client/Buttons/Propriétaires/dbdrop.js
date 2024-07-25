const { Client, ButtonInteraction, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const mongoose = require('mongoose');
const models = require("../../Models");

module.exports = {
    id: "dbdrop",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `Vous n'êtes pas l'auteur de cette commande.`,
                ephemeral: true
            });
        };

        if (interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'etes pas le propriétaire du robot.`,
                ephemeral: true
            });
        };

        await interaction.deferUpdate({ fetchReply: true });
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
        };
        await mongoose.disconnect();
        await mongoose.connect(process.env.mongoDB);

        const modelNames = Object.keys(models);
        if (modelNames.length === 0) {
            return await interaction.editReply({
                content: `${client.emo.no} La database ne possède aucun model.`,
                ephemeral: true
            });
        };

        const options = [];
        const embed = new EmbedBuilder();
        for (let index = 0; index < modelNames.length; index++) {

            const modelName = modelNames[index];
            const model = models[modelName];
            const data = await model.find();

            options.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`${modelName} - ${data.length} entrée${data.length > 1 ? "s" : ""}`)
                    .setValue(modelName)
            );

            embed.addFields(
                {
                    name: modelName,
                    value: `\`${data.length} entrée${data.length > 1 ? "s" : ""}\``,
                    inline: true
                }
            );
        };

        await interaction.editReply({
            embeds: [embed
                .setTitle(`Information de la database - ${client.user.displayName}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setColor("Blurple")
                .setTimestamp()
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("dbconfig")
                            .setPlaceholder("Permet de modifier les informations des models.")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .addOptions(options)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("dblogs")
                            .setDisabled(false)
                            .setEmoji("🔸")
                            .setLabel("Voir les derniers logs de la database")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("dbrestart")
                            .setDisabled(false)
                            .setEmoji("🔄")
                            .setLabel("Relancer la database")
                            .setStyle(ButtonStyle.Primary)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("dbdrop")
                            .setDisabled(false)
                            .setEmoji("🗑️")
                            .setLabel("Réinitialiser la database")
                            .setStyle(ButtonStyle.Danger)
                    )
            ],
            fetchReply: true
        });
    }
};