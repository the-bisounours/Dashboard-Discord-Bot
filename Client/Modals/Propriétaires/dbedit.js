const { Client, ModalSubmitInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require("discord.js");
const models = require("../../Models");

module.exports = {
    id: "dbedit_",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de cette commande.`,
                ephemeral: true
            });
        };

        if (interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'etes pas le propriétaire du robot.`,
                ephemeral: true
            });
        };

        const customid = interaction.customId.split("_")
        const model = models[customid[1]];
        const datas = await model.find();

        if (datas.length === 0) {
            return await interaction.reply({
                content: `${client.emo.no} Il n'y a aucune données pour \`${customid[1]}\`.`,
                ephemeral: true
            });
        };

        const data = await model.findOne({
            _id: customid[2]
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Je ne retrouve pas le schema a modifier.`,
                ephemeral: true
            });
        };

        try {
            const newData = JSON.parse(interaction.fields.getTextInputValue("description"));
            Object.assign(data, newData);
            await data.save();

            const modelNames = Object.keys(models);
            if (modelNames.length === 0) {
                return await interaction.reply({
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
                                .setEmoji(`${client.emo.delete}`)
                                .setLabel("Réinitialiser la database")
                                .setStyle(ButtonStyle.Danger)
                        )
                ]
            });

        } catch (error) {
            return await interaction.reply({
                content: `${client.emo.no} Erreur lors de l'analyse des nouvelles données.`,
                ephemeral: true
            });
        };
    }
};