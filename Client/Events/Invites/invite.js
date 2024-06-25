const { Events, Client } = require("discord.js");
const Invite = require("../../Models");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: async (client) => {

        client.guilds.cache.forEach(async guild => {

            const invites = await guild.invites.fetch();
            invites.forEach(async invite => {

                const existingInvite = await Invite.findOne({
                    guildId: invite.guild.id,
                    code: invite.code
                });

                if (!existingInvite) {

                    const newInvite = new Invite({
                        guildId: invite.guild.id,
                        code: invite.code,
                        uses: invite.uses,
                        inviterId: invite.inviter.id
                    });
                    await newInvite.save();

                } else {

                    existingInvite.uses = invite.uses;
                    await existingInvite.save();
                };
            });
        });
    }
};