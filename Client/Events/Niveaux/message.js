const { Events, Client, Message } = require("discord.js");
const { profileImage } = require("discord-arts")
const { Guilds, Users, Tickets } = require("../../Models");
const replace = require("../../Functions/Gestions/replace");

module.exports = {

    name: Events.MessageCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    execute: async (client, message) => {

        if (!message || !message.author || message.author.bot) return;

        const data = await Guilds.findOne({
            guildId: message.guild.id
        });

        if (!data || !data.level.settings.enabled) return;
        if (data.level.settings.ignore.channels.includes(message.channel.id)) return;
        if (data.level.settings.ignore.roles.some(roleId => message.member.roles.cache.has(roleId))) return;
        if(data.level.settings.ignore.ticket) {
            const ticket = await Tickets.findOne({ 
                channelId: message.channel.id 
            });
            if(ticket) return;
        };

        let xp = Math.round(Math.random() * (data.level.settings.ratio.max - data.level.settings.ratio.min) + data.level.settings.ratio.min);
        if (data.level.settings.bonus.roles.some(roleId => message.member.roles.cache.has(roleId)) || data.level.settings.bonus.channels.includes(message.channel.id)) {
            xp += data.level.settings.ratio.max - data.level.settings.ratio.min
        };

        let user = await Users.findOne({
            guildId: message.guild.id,
            userId: message.author.id
        });
        if (!user) {
            user = await new Users({
                guildId: message.guild.id,
                userId: message.author.id,
                leveling: {
                    level: 0,
                    xp: xp
                }
            }).save();
        } else {
            user.leveling.xp += xp;

            let level = user.leveling.level;
            let currentXP = user.leveling.xp;

            let nextLevelXP = 1000 + level * 1000;
            while (currentXP >= nextLevelXP) {
                level++;
                currentXP -= nextLevelXP;
                nextLevelXP = 1000 + level * 1000;

                const allUsers = await Users.find({ guildId: message.guild.id });
                const userList = allUsers.map(u => ({
                    id: u.userId,
                    xp: u.leveling.xp + (u.leveling.level * 1000)
                }));
                userList.sort((a, b) => b.xp - a.xp);
                const rank = userList.findIndex(u => u.id === message.author.id) + 1;

                if (data.level.settings.message.enabled) {
                    const buffer = await profileImage(message.author.id, {
                        customBadges: [],
                        presenceStatus: "online",
                        badgesFrame: true,
                        moreBackgroundBlur: true,
                        backgroundBrightness: 100,
                        rankData: {
                            currentXp: currentXP,
                            requiredXp: nextLevelXP,
                            rank: rank,
                            level: level,
                            barColor: '#fcdce1',
                            levelColor: '#ada8c6',
                            autoColorRank: true
                        }
                    });

                    if (!data.level.settings.message.content && !data.level.settings.message.image) return;

                    data.level.settings.message.channel && message.guild.channels.cache.get(data.level.settings.message.channel)
                        ? message.guild.channels.cache.get(data.level.settings.message.channel).send({
                            content: data.level.settings.message.content ? replace(data.level.settings.message.content, {
                                member: message.member,
                                level: level,
                                xp: currentXP,
                                rank: rank
                            }) : "",
                            files: data.level.settings.message.image ? [buffer] : []
                        })
                        : message.reply({
                            content: data.level.settings.message.content ? replace(data.level.settings.message.content, {
                                member: message.member,
                                level: level,
                                xp: currentXP,
                                rank: rank
                            }) : "",
                            files: data.level.settings.message.image ? [buffer] : []
                        });
                };
            };

            user.leveling.level = level;
            user.leveling.xp = currentXP;
            await user.save();
        };
    }
};