const { Events, Client, ActivityType } = require("discord.js");
const { Schedule } = require("../../Models");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: async (client) => {

        const checkReminders = async () => {
            const now = new Date();
            const reminders = await Schedule.find({ remindAt: { $lte: now } });

            for (const reminder of reminders) {
                const channel = await client.channels.fetch(reminder.channelId);
                if (channel) {
                    channel.send({
                        content: `<@${reminder.userId}> Rappel: ${reminder.message}`
                    });
                    await reminder.deleteOne();
                };
            };
        };

        setInterval(checkReminders, 60000);
    }
};