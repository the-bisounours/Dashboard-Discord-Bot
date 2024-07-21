const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const activity = require("../../Functions/Gestions/activity");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Permet d'évaluer un code.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("code")
            .setDescription("Permet d'évaluer un code.")
            .setRequired(true)
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

        let evaled = eval(interaction.options.getString("code"));
        if (typeof evaled !== "string") {
            evaled = require('util').inspect(evaled);
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Evaluation d'un code")
                .setColor("Blurple")
                .addFields(
                    {
                        name: "Informations du code",
                        value: `\`\`\`js\n${interaction.options.getString("code")}\n\`\`\``
                    }, 
                    {
                        name: "Information du résultat",
                        value: `\`\`\`js\n${evaled}\n\`\`\``
                    }
                )
            ],
            ephemeral: true
        });
    }
};