
/**
 * 
 * @param {Number} number 
 * @param {String} unit 
 * @returns {String}
 */
module.exports = (number, unit) => {

    switch (unit) {
        case 'millisecondes':
            number;
        case 'secondes':
            number = number * 1000;
        case 'mimutes':
            number = number * 1000 * 60;
        case 'heures':
            number = number * 1000 * 60 * 60;
        case 'jours':
            number = number * 1000 * 60 * 60 * 24;
        default:
            number;
        break;
    };

    const day = 24 * 60 * 60 * 1000;
    const hour = 60 * 60 * 1000;
    const minute = 60 * 1000;
    const second = 1000;

    const days = Math.floor(number / day);
    number -= days * day;

    const hours = Math.floor(number / hour);
    number -= hours * hour;

    const minutes = Math.floor(number / minute);
    number -= minutes * minute;

    const seconds = Math.floor(number / second);

    let result = "";
    if (days > 0) {
        result += `\`${days}\` jour${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
        result += `\`${hours}\` heure${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
        result += `\`${minutes}\` minute${minutes > 1 ? 's' : ''} `;
    }
    if (seconds > 0 || result === "") {
        result += `\`${seconds}\` seconde${seconds > 1 ? 's' : ''} `;
    };

    return result.trim();
};