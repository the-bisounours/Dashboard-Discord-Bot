const { Client, ButtonInteraction, EmbedBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const models = require("../../Models");

module.exports = {
    id: "dbdelete_",

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

        if (interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: ":x: Vous n'etes pas le propriétaire du robot.",
                ephemeral: true
            });
        };

        const customid = interaction.customId.split("_")
        const model = models[customid[1]];
        const datas = await model.find();

        if (datas.length === 0) {
            return await interaction.reply({
                content: `:x: Il n'y a aucune données pour \`${customid[1]}\`.`,
                ephemeral: true
            });
        };

        await model.findOneAndDelete({
            _id: customid[2]
        });

        const modelNames = Object.keys(models);
        if (modelNames.length === 0) {
            return await interaction.reply({
                content: ":x: La database ne possède aucun model.",
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

        return await interaction.update({
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
            ]
        });
    }
};