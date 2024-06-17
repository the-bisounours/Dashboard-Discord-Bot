const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, AutocompleteInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Permet de débannir un utilisateur du serveur discord.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => option
            .setName("membre")
            .setDescription("Le membre à débannir du serveur discord.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison du débannissement du serveur discord.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve de débannissement du serveur discord.")
            .setRequired(false)
        ),

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        let bans = await interaction.guild.bans.fetch();
        if(bans.size <= 0) {
            bans = [
                {
                    user: {
                        username: "Il n'y a aucun bannissement sur le serveur discord.",
                        id: interaction.user.id
                    }
                }
            ];
        };
        
        const focusedValue = interaction.options.getFocused();
        const filteredOptions = bans.filter(ban => 
            ban.user.username.toLowerCase().includes(focusedValue.toLowerCase())
        );
    
        await interaction.respond(
            filteredOptions.map(ban => ({
                name: ban.user.username,
                value: ban.user.id
            }))
        );
    },

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const userId = interaction.options.getString("membre");
        const user = await client.users.fetch(userId);
        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";

        const bans = await interaction.guild.bans.fetch();
        if (!userId || !bans.find(ban => ban.user.id === userId)) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre/Le membre n'est pas bannis.",
                ephemeral: true
            });
        };

        if (user && !user.bot) {
            try {
                await user?.send({
                    content: `Vous avez été débannis par \`${interaction.user.displayName}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
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

        return await interaction.guild.members.unban(userId, raison)
            .then(async unbanInfo => {
                return await interaction.reply({
                    content: `Vous avez bannis \`${unbanInfo.username}\` pour \`${raison}\`.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `\`${member.user.displayName}\` n'a pas été débannis à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};