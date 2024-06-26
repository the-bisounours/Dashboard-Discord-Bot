const { Events, Client, Invite } = require("discord.js");
const { Invites } = require("../../Models");

module.exports = {
    name: Events.InviteDelete,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Invite} invite 
     */
    execute: async (client, invite) => {

        await Invites.findOneAndDelete({
            guildId: invite.guild.id,
            code: invite.code
        });
    }
};