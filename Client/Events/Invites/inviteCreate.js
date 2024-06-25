const { Events, Client, Invite } = require("discord.js");
const { Invites } = require("../../Models");

module.exports = {
    name: Events.InviteCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Invite} invite 
     */
    execute: async (client, invite) => {
        console.log("ok", invite.code);

        const newInvite = new Invites({
            guildId: invite.guild.id,
            code: invite.code,
            uses: invite.uses,
            inviterId: invite.inviter.id
        });
        await newInvite.save();
    }
};