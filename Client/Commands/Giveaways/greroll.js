const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder, AutocompleteInteraction } = require("discord.js");
const { Giveaways } = require("../../Models");
const endGiveaway = require("../../Functions/Giveaways/endGiveaway");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("greroll")
        .setDescription("Permet de relancer un giveaway.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(option => option
            .setName("identifiant")
            .setDescription("Permet de relancer un giveaway.")
            .setAutocomplete(true)
            .setRequired(true)
        ),

    category: "Giveaways",

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const giveaways = await Giveaways.find({
            guildId: interaction.guild.id,
            status: "ended"
        });

        const focusedValue = interaction.options.getFocused();
        const filtered = giveaways.filter(choice => choice.prize.startsWith(focusedValue)).slice(0, 25);
        await interaction.respond(filtered.map(choice =>
            ({ name: `${choice.prize} - ${choice.giveawayId}`, value: choice.giveawayId })
        ));
    },

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const giveaway = await Giveaways.findOne({
            giveawayId: interaction.options.getString("identifiant")
        });

        if (!giveaway) {
            return await interaction.reply({
                content: `${client.emo.no} Le giveaway n'existe pas.`,
                ephemeral: true
            });
        };

        if(giveaway.status !== "ended") {
            return await interaction.reply({
                content: `${client.emo.no} Le giveaway n'est pas terminé.`,
                ephemeral: true
            });
        };

        await interaction.reply({
            content: `${client.emo.yes} Le giveaway avec l'identifiant \`${interaction.options.getString("identifiant")}\` a été relancer.`
        });

        return await endGiveaway(client, giveaway.giveawayId, true);
    }
};