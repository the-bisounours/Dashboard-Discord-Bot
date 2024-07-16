const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Giveaways } = require("../../Models");
const endGiveaway = require("../../Functions/Giveaways/endGiveaway");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gend")
        .setDescription("Permet d'arrêter un giveaway.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(option => option
            .setName("identifiant")
            .setDescription("Permet d'arrêter un giveaway.")
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
            status: "started"
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
                content: ":x: Le giveaway n'existe pas.",
                ephemeral: true
            });
        };

        if(giveaway.status === "ended") {
            return await interaction.reply({
                content: ":x: Le giveaway est déjà terminé.",
                ephemeral: true
            });
        };

        await interaction.reply({
            content: "Le giveaway sera terminé dans quelques secondes.",
            ephemeral: true
        });

        return await endGiveaway(client, giveaway.giveawayId);
    }
};