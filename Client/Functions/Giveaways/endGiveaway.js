const { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } = require("discord.js");
const { Giveaways } = require("../../Models");
const selectWinners = require("./selectWinners");
const filterParticipants = require("./filterParticipants");

/**
 * 
 * @param {Client} client 
 * @param {String} id
 * @returns
 */
module.exports = async (client, id) => {

    const giveaway = await Giveaways.findOne({
        giveawayId: id
    });

    if (!giveaway.guildId || !client.guilds.cache.get(giveaway.guildId)) return;
    const guild = client.guilds.cache.get(giveaway.guildId);

    if (!giveaway.channelId || !guild.channels.cache.get(giveaway.channelId)) return;
    const channel = guild.channels.cache.get(giveaway.channelId);

    if (!giveaway.messageId) return;
    const message = await channel.messages.fetch(giveaway.messageId).catch(err => {
        return null;
    });
    if (!message) return;

    const participants = await filterParticipants(client, guild, giveaway);
    if (participants.length === 0) {
        await editComponentsAndStatus(message, giveaway);
        return await message.reply({
            content: `${giveaway.participants.length === 0 ? ":x: Aucune personne n'a participer a ce concours." : `:x: ${giveaway.participants.length === 1 ? "Le participant n'a pas" : `Les \`${giveaway.participants.length}\` participants n'ont pas`} les conditions pour gagner le concours.`}`
        });
    };

    const winners = selectWinners(participants, giveaway.settings.winners);
    if (winners.length === 0) {
        await editComponentsAndStatus(message, giveaway);
        return await message.reply({
            content: `:x: Aucune personne n'a gagner a ce concours.`
        });
    };

    await editComponentsAndStatus(message, giveaway);
    const winnerUsers = await Promise.all(winners.map(id => client.users.fetch(id)));
    return await message.reply({
        content: `🎉 Le${winners.length > 1 ? "s": ""} gagant${winners.length > 1 ? "s": ""} pour \`${giveaway.prize}\` ${winners.length > 1 ? "sont": "est"} ${winnerUsers.map(user => user).join(" ")} !`
    });
};


/**
 * 
 * @param {Message} message 
 * @param {Object} giveaway 
 */
async function editComponentsAndStatus(message, giveaway) {

    giveaway.status = "ended";
    await giveaway.save();

    await message.edit({
        components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("enter_giveaway")
                        .setLabel("Giveaway terminé !")
                        .setDisabled(true)
                        .setEmoji("🎉")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("participants")
                        .setLabel(`${giveaway.participants.length} participant${giveaway.participants.length > 1 ? "s" : ""}`)
                        .setDisabled(true)
                        .setEmoji("✏️")
                        .setStyle(ButtonStyle.Secondary)
                )
        ]
    });
};