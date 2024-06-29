const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

/**
 * 
 * @param {Object} panel 
 * @returns Array
 */
module.exports = (panel) => {

    const components = [];
    
    let currentActionRow = new ActionRowBuilder();
    let buttonCount = 0;

    panel.buttons.forEach((button, index) => {
        const buttonBuilder = new ButtonBuilder()
            .setCustomId(button.customId)
            .setLabel(button.label)
            .setStyle(color(button.color));

        currentActionRow.addComponents(buttonBuilder);
        buttonCount++;

        if (buttonCount === 5 || index === panel.buttons.length - 1) {
            components.push(currentActionRow);
            currentActionRow = new ActionRowBuilder();
            buttonCount = 0;
        };
    });

    return components;

};

/**
 * 
 * @param {String} color 
 * @returns {ButtonStyle}
 */
function color(color) {
    switch (color) {
        case "1":
            return ButtonStyle.Primary;
        case "2":
            return ButtonStyle.Secondary;
        case "3":
            return ButtonStyle.Success;
        case "4":
            return ButtonStyle.Danger;
        default:
            return ButtonStyle.Primary;
    }
}