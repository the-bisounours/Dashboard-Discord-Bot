const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Permet de s'informer sur un role.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addRoleOption(option => option
            .setName("role")
            .setDescription("Permet de s'informer sur un role.")
            .setRequired(false)
        ),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const role = interaction.guild.roles.cache.get(interaction.options.getRole("role").id);
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Informations sur le rôle ${role.name}`)
                    .addFields(
                        {
                            name: "Informations sur le rôle",
                            value: `> **Nom:** \`${role.name}\` ${role}\n> **Identifiant:** \`${role.id}\`\n> **Couleur:** \`#${role.hexColor}\`\n> **Position:** \`${role.position}\`/\`${role.rawPosition}\`\n> **Date de création:** <t:${Math.round(role.createdTimestamp / 1000)}:D> <t:${Math.round(role.createdTimestamp / 1000)}:R>`
                        },
                        {
                            name: "Informations sur les permissions",
                            value: `> **Rôle de robot:** \`${role.tags && role.tags.botId ? "oui" : "non"}\`\n> **Mentionnable:** \`${role.mentionable ? "oui" : "non"}\`\n> **Permissions:** ${role.permissions.toArray().length <= 0 ? "\`Aucune\`" : role.permissions.toArray().map(permission => `\`${permission}\``).join(" ")}`
                        }
                    )
                    .setColor("Blurple")
                    .setTimestamp()
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        });
    }
};