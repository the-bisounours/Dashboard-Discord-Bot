const { SlashCommandBuilder, Client, ChatInputCommandInteraction, Events } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Permet de générer un évènement.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("event")
            .setDescription("Permet de générer un évènement.")
            .setRequired(true)
            .addChoices(
                { name: "guildMemberAdd", value: "guildMemberAdd" },
                { name: "guildMemberRemove", value: "guildMemberRemove" }
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

        const eventType = interaction.options.getString("event");

        switch (eventType) {
            case "guildMemberAdd":
                client.emit(Events.GuildMemberAdd, interaction.member);
            break;
            case "guildMemberRemove":
                client.emit(Events.GuildMemberRemove, { client: client, member: interaction.member });
            break;
            default:
            break;
        };

        return await interaction.reply({
            content: `Événement \`${eventType}\` généré avec succès.`,
            ephemeral: true
        });
    }
};