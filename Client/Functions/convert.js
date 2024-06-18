
/**
 * 
 * @param {Number} ms 
 * @returns {String}
 */
module.exports = ms => {
    const day = 24 * 60 * 60 * 1000;
    const hour = 60 * 60 * 1000;
    const minute = 60 * 1000;
    const second = 1000;

    const days = Math.floor(ms / day);
    ms -= days * day;

    const hours = Math.floor(ms / hour);
    ms -= hours * hour;

    const minutes = Math.floor(ms / minute);
    ms -= minutes * minute;

    const seconds = Math.floor(ms / second);

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