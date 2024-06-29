const { EmbedBuilder } = require("discord.js");

/**
 * 
 * @param {Object} panel 
 * @param {EmbedBuilder} embed
 * @returns Object
 */
module.exports = (button, embed) => {

    let color;
    switch (button.color) {
        case "1":
            color = "Bleu"
            break;
        case "2":
            color = "Gris"
            break;
        case "3":
            color = "Vert"
            break;
        case "4":
            color = "Rouge"
            break;
        default:
            break;
    }

    return embed.addFields(
        {
            name: `Bouton`,
            value: `> **Label:** \`${button.label}\`\n> **Couleur:** \`${color}\``
        }
    );
};