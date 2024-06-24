const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ActivityType } = require("discord.js");
const { Activity } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setactivity")
        .setDescription("Permet de modifier l'activité du robot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("type")
            .setDescription("Permet de modifier l'activité du robot.")
            .setRequired(true)
            .addChoices(
                { name: "Participant à", value: `${ActivityType.Competing}` },
                { name: "Personnalisé", value: `${ActivityType.Custom}` },
                { name: "Ecoute", value: `${ActivityType.Listening}` },
                { name: "Joue", value: `${ActivityType.Playing}` },
                { name: "Stream", value: `${ActivityType.Streaming}` },
                { name: "Regarde", value: `${ActivityType.Watching}` }
            )
        )
        .addStringOption(option => option
            .setName("nom")
            .setDescription("Permet de modifier l'activité du robot.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("url")
            .setDescription("Permet de modifier l'activité du robot.")
            .setRequired(false)
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
                content: "Vous n'etes pas le propriétaire du robot.",
                ephemeral: true
            });
        };

        if(interaction.options.getString("type") === ActivityType.Streaming.toString()) {
            if(!interaction.options.getString("url") || !interaction.options.getString("url").includes("https://www.twitch.tv/")) {
                return await interaction.reply({
                    content: `Vous devez mettre un lien du stream.`,
                    ephemeral: true
                });
            };
        };

        client.user.setActivity(
            interaction.options.getString("type") === ActivityType.Streaming.toString() ?
            {
                type: ActivityType[ActivityType[interaction.options.getString("type")]],
                name: interaction.options.getString("nom"),
                url: interaction.options.getString("url")
            } :
            {
                type: ActivityType[ActivityType[interaction.options.getString("type")]],
                name: interaction.options.getString("nom")
            }
        )

        const activity = await Activity.findOne({ clientId: client.user.id });
        await activity.updateOne({
            name: interaction.options.getString("nom"),
            type: interaction.options.getString("type"),
            url: interaction.options.getString("url") ? interaction.options.getString("url") : activity.url
        });

        return await interaction.reply({
            content: `Le robot a changé d'activité: \`${ActivityType[interaction.options.getString("type")]} ${interaction.options.getString("nom")}\``,
            ephemeral: true
        });
    }
};