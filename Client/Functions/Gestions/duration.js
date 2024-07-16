const regex = /(\d+d)?\s*(\d+h)?\s*(\d+m)?\s*(\d+s)?/;

/**
 * 
 * @param {String} duration 
 * @returns {Number}
 */
module.exports = duration => {

    const matches = duration.match(regex);
    if (!matches) return null;

    const days = matches[1] ? parseInt(matches[1].replace('d', '')) : 0;
    const hours = matches[2] ? parseInt(matches[2].replace('h', '')) : 0;
    const minutes = matches[3] ? parseInt(matches[3].replace('m', '')) : 0;
    const seconds = matches[4] ? parseInt(matches[4].replace('s', '')) : 0;
    
    return (days * 86400000) + (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
};