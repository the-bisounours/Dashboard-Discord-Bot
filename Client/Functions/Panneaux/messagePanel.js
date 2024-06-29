const { ButtonInteraction } = require("discord.js");

/**
 * 
 * @param {Object} panel 
 * @param {ButtonInteraction} interaction 
 * @returns Object
 */
module.exports = (panel, interaction) => {
    return {
        name: `Identifiant \`${panel.panelId}\``,
        value: `> **Salon:** ${panel.channelId && interaction.guild.channels.cache.get(panel.channelId) ? `${interaction.guild.channels.cache.get(panel.channelId)} (\`${panel.channelId}\`)` : `\`Aucun\``}\n> **Catégorie:** ${panel.categoryId && interaction.guild.channels.cache.get(panel.categoryId) ? `\`${interaction.guild.channels.cache.get(panel.categoryId).name}\` (\`${panel.categoryId}\`)` : `\`Aucun\``}\n> **Rôles:** ${panel.roles.length > 0 ? `${panel.roles.map(roleId => interaction.guild.roles.cache.get(roleId)).join(" ")}` : "\`Aucun\`"}\n> **Nom:** \`${panel.name}\`\n> **Boutons:** \`${panel.buttons.length} bouton${panel.buttons.length > 1 ? "s" : ""}\``
    }
};