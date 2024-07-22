const { Client, StringSelectMenuInteraction, EmbedBuilder } = require("discord.js");
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

        const model = models[interaction.values[0]];
        const datas = await model.find();

        if (datas.length === 0) {
            return await interaction.reply({
                content: `:x: Il n'y a aucune données pour \`${interaction.values[0]}\`.`,
                ephemeral: true
            });
        };

        const embeds = [];
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
        };

        return await paginations(interaction, embeds, 60 * 1000, true);
    }
};