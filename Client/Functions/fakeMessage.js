const regex = /(\d+d)?\s*(\d+h)?\s*(\d+m)?/;

/**
 * 
 * @param {Number} number 
 * @returns {String}
 */
module.exports = number => {

    let message = "";
    switch (number) {
        case 1:
            message = "Le compte doit **dater de plus de 7 jours**"
        break;
        case 2:
            message = "Doit avoir une **photo de profil personnalisée**"
        break;
        default:
            break;
    }
    
    return message;
};