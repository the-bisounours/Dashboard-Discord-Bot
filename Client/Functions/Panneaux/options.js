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
        
        embed.addFields(
            {
                name: `Bouton [\`${index + 1}\`]`,
                value: `> **Label:** \`${button.label}\`\n> **Couleur:** \`${color}\``
            }
        );
    };

    return embed;
};