const { Events, Client, ActivityType } = require("discord.js");
const { Activity } = require("../../Models");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: async (client) => {

        setTimeout(async () => {
            let activity = await Activity.findOne({ clientId: client.user.id });
            if (!activity) {
                activity = await new Activity({
                    clientId: client.user.id
                }).save();
            };

            client.user.setStatus(`${activity.status}`);
        }, 2000);
    }
};