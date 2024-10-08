const { Client, StringSelectMenuInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const models = require("../../Models");
const paginations = require("../../Functions/Gestions/paginations");

module.exports = {
    id: "dbconfig",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
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
                content: `${client.emo.no} Vous n'êtes pas le propriétaire du robot.`,
                ephemeral: true
            });
        };

        const model = models[interaction.values[0]];
        const datas = await model.find();

        if (datas.length === 0) {
            return await interaction.reply({
                content: `${client.emo.no} Il n'y a aucune données pour \`${interaction.values[0]}\`.`,
                ephemeral: true
            });
        };

        const embeds = [];
        const buttons = [];
        for (let index = 0; index < datas.length; index++) {
            const data = datas[index];
            const jsonData = JSON.stringify(data, null, 2);

            embeds.push(
                new EmbedBuilder()
                    .setTitle(`Informations de la database - ${interaction.values[0]}`)
                    .setDescription(`\`\`\`json\n${jsonData}\n\`\`\``)
                    .setColor("Blurple")
                    .setTimestamp()
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
            );

            buttons.push(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`dbedit_${interaction.values[0]}_${data._id}`)
                            .setLabel("Modifier le schema")
                            .setEmoji(`${client.emo.pencil}`)
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`dbdelete_${interaction.values[0]}_${data._id}`)
                            .setLabel("Supprimer le schema")
                            .setEmoji(`${client.emo.delete}`)
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Danger)
                    )
            );
        };

        return await paginations(interaction, embeds, 60 * 1000, true, buttons);
    }
};