const { Events, Client, Invite } = require("discord.js");

module.exports = {
    name: Events.InviteDelete,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Invite} invite 
     */
    execute: async (client, invite) => {

        await Invite.findOneAndDelete({
            guildId: invite.guild.id,
            code: invite.code
        });
    }
};