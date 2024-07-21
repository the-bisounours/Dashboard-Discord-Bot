const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { Activity } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setstatus")
        .setDescription("Permet de modifier le status du robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("status")
            .setDescription("Permet de modifier le status du robot.")
            .setRequired(true)
            .addChoices(
                { name: "En ligne", value: "online" },
                { name: "Inactive", value: "idle" },
                { name: "Ne pas déranger", value: "dnd" }
            )
        ),

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

        client.user.setStatus(`${interaction.options.getString("status")}`);

        const activity = await Activity.findOne({ clientId: client.user.id });
        await activity.updateOne({
            status: interaction.options.getString("status")
        });

        return await interaction.reply({
            content: `Le robot a changé de status: \`${interaction.options.getString("status")}\``,
            ephemeral: true
        });
    }
};