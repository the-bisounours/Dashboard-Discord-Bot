const { Client, ButtonInteraction, ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle } = require("discord.js");
const models = require("../../Models");

module.exports = {
    id: "dbedit_",

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

        const data = await model.findOne({
            _id: customid[2]
        });

        if (!data) {
            return await interaction.reply({
                content: `:x: Je ne retrouve pas le schema a modifier.`,
                ephemeral: true
            });
        };

        await interaction.showModal(
            new ModalBuilder()
            .setCustomId(`dbedit_${customid[1]}_${customid[2]}`)
            .setTitle("Modifier le schema")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('description')
                            .setLabel("Quelle est le nouveau schema ?")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                    )
            )
        );
    }
};