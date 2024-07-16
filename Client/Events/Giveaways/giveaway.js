const { Events, Client } = require("discord.js");
const { Giveaways } = require("../../Models");
const endGiveaway = require("../../Functions/Giveaways/endGiveaway");

module.exports = {
    name: Events.ClientReady,

    /**
     * 
     * @param {Client} client 
     */
    execute: async (client) => {

        const giveaways = await Giveaways.find({
            status: "started"
        });

        giveaways.forEach(giveaway => {

            const endTime = new Date(giveaway.endTime).getTime() - Date.now();

            setTimeout(async () => {
                return await endGiveaway(client, giveaway.giveawayId);
            }, endTime);
        });
    }
};