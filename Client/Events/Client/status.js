const { Events, Client, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: (client) => {

        client.user.setActivity({
            name: "the_bisounours",
            type: ActivityType.Listening
        });
    }
};