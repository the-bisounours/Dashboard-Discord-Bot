const { Events, Client, Invite } = require("discord.js");
const Invite = require("../../Models");

module.exports = {
    name: Events.InviteCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Invite} invite 
     */
    execute: async (client, invite) => {

        const newInvite = new Invite({
            guildId: invite.guild.id,
            code: invite.code,
            uses: invite.uses,
            inviterId: invite.inviter.id
        });
        await newInvite.save();
    }
};