const { ActivityType } = require("discord.js");

/**
 * 
 * @param {ActivityType} activity 
 * @returns {String}
 */
module.exports = activity => {
    switch (activity) {
        case ActivityType.Competing:
            return "En compétition";
        break;
        case ActivityType.Listening:
            return "Ecoute";
        break;
        case ActivityType.Custom:
            return "Participant à :";
        break;
        case ActivityType.Playing:
            return "Joue";
        break;
        case ActivityType.Streaming:
            return "Stream";
        break;
        case ActivityType.Watching:
            return "Regarde";
        break;
        default:
            return 'Inconnu';
    };
};