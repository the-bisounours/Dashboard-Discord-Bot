const { SlashCommandBuilder, Client, ChatInputCommandInteraction, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const models = require("../../Models");
const { default: mongoose } = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dbconfig")
        .setDescription("Permet de configurer la base de donnée.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    category: "Propriétaires",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== process.env.ownerId) {
            return await interaction.reply({
                content: ":x: Vous n'etes pas le propriétaire du robot.",
                ephemeral: true
            });
        };

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

        return await interaction.reply({
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
                            .setEmoji("🔄")
                            .setLabel("Réinitialiser la database")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};