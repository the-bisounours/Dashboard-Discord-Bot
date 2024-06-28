const { EmbedBuilder } = require("discord.js");

/**
 * 
 * @param {Object} panel 
 * @param {EmbedBuilder} embed
 * @returns Object
 */
module.exports = (panel, embed) => {
    for (let index = 0; index < panel.buttons.length; index++) {
        const button = panel.buttons[index];
        console.log(button);
        embed.addFields(
            {
                name: `\`${button}\``,
                value: `> **Salon:** ${panel.channelId && interaction.guild.channels.cache.get(panel.channelId) ? `${interaction.guild.channels.cache.get(panel.channelId)} (\`${panel.channelId}\`)` : `\`Aucun\``}\n> **Catégorie:** ${panel.categoryId && interaction.guild.channels.cache.get(panel.categoryId) ? `\`${interaction.guild.channels.cache.get(panel.categoryId).name}\` (\`${panel.categoryId}\`)` : `\`Aucun\``}\n> **Rôles:** ${panel.roles.length > 0 ? `${panel.roles.map(roleId => interaction.guild.roles.cache.get(roleId)).join(" ")}` : "\`Aucun\`"}\n> **Nom:** \`${panel.name}\`\n> **Boutons:** \`${panel.buttons.length}\``
            }
        )
    };

    return embed;
};