/**
 * 
 * @param {Array} participants 
 * @param {Number} numWinners
 * @returns {Array}
 */
module.exports = (participants, numWinners) => {

    let weightedParticipants = [];

    participants.forEach(participant => {
        for (let i = 0; i < participant.bonus + 1; i++) {
            weightedParticipants.push(participant.userId);
        };
    });
    console.log(weightedParticipants)

    const winners = new Set();
    while (winners.size < numWinners && weightedParticipants.length > 0) {

        const winnerIndex = Math.floor(Math.random() * weightedParticipants.length);
        const winnerUserId = weightedParticipants[winnerIndex];
        winners.add(winnerUserId);

        weightedParticipants = weightedParticipants.filter(user => user.userId !== winnerUserId);
    };

    return Array.from(winners);
};