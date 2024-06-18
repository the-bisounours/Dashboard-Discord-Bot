const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, AutocompleteInteraction } = require("discord.js");
const convert = require("../../Functions/convert");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Permet de rendre muet un utilisateur du serveur discord.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Le membre à rendre muet du serveur discord.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("temps")
            .setDescription("La durée de la mise en sourdine du membre.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison de la mise en sourdine du membre.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve de la mise en sourdine du membre.")
            .setRequired(false)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const options = [
            { name: '60 secondes', value: "60000" },
            { name: '5 minutes', value: "300000" },
            { name: '10 minutes', value: "600000" },
            { name: '1 heure', value: "3600000" },
            { name: '1 jour', value: "86400000" },
            { name: '1 semaine', value: "604800000" }
        ];

        const focusedValue = interaction.options.getFocused();
        const filteredOptions = options.filter(option => 
            option.name.toLowerCase().includes(focusedValue.toLowerCase())
        );

        await interaction.respond(
            filteredOptions.map(option => ({
                name: option.name,
                value: option.value
            }))
        );
    },

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";
        const number = new Number(interaction.options.getString("temps"));

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        if (member.isCommunicationDisabled()) {
            return await interaction.reply({
                content: ":x: Le membre est actuellement muet.",
                ephemeral: true
            });
        };


        if (member.user.id === interaction.guild.ownerId) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas rendre muet propriétaire du serveur discord.",
                ephemeral: true
            });
        };

        if (member.user.id === interaction.user.id) {
            return await interaction.reply({
                content: ":x: Pourquoi essayez-vous de vous rendre muet ?",
                ephemeral: true
            });
        };

        if (member.user.id === client.user.id) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas me rendre muet, essayer la commande /leave.",
                ephemeral: true
            });
        };

        if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Vous ne pouvez pas rendre muet un membre plus haut que vous.",
                ephemeral: true
            });
        };

        if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return await interaction.reply({
                content: ":x: Je ne peux pas rendre muet un membre plus haut que moi.",
                ephemeral: true
            });
        };

        if (!member.user.bot) {
            try {
                await member.send({
                    content: `Vous avez été mis en sourdine par \`${interaction.user.displayName}\` pendant ${convert(number)} pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Secondary)
                                    .setLabel(`Envoyé depuis ${interaction.guild.name}`)
                                    .setDisabled(true)
                            )
                    ]
                });
            } catch (err) {};
        };

        return await member.timeout(number, raison)
            .then(async timeoutInfo => {
                return await interaction.reply({
                    content: `Vous avez mis en sourdine \`${timeoutInfo.user.displayName}\` pendant ${convert(number, "millisecondes")} pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été mis en sourdine à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};