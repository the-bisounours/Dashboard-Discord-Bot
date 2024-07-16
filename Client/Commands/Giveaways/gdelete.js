const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder, AutocompleteInteraction } = require("discord.js");
const { Giveaways } = require("../../Models");
const paginations = require("../../Functions/Gestions/paginations");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gdelete")
        .setDescription("Permet de supprimer un giveaway.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(option => option
            .setName("identifiant")
            .setDescription("Permet de supprimer un giveaway.")
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
            guildId: interaction.guild.id
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

        if(giveaway.messageId && giveaway.channelId && interaction.guild.channels.cache.get(giveaway.channelId)) {
            try {
                const channel = interaction.guild.channels.cache.get(giveaway.channelId);
                if(channel) {
                    const message = await channel.messages.fetch(giveaway.messageId).catch(err => {
                        return null;
                    });
                
                    if (message) {
                        await message.delete().catch(err => err);
                    };
                };
            } catch (err) {};
        };

        await Giveaways.deleteOne({
            giveawayId: interaction.options.getString("identifiant")
        });

        return await interaction.reply({
            content: `Le giveaway avec l'identifiant \`${interaction.options.getString("identifiant")}\` a été supprimé.`
        });
    }
};