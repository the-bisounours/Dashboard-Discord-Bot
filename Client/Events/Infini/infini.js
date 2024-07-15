const { Events, Client, ActivityType, Message, EmbedBuilder } = require("discord.js");
const { Guilds } = require("../../Models");
const numbers = new RegExp('^[0-9]$');

module.exports = {
    name: Events.MessageCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message
     */
    execute: async (client, message) => {

        const data = await Guilds.findOne({
            guildId: message.guild.id
        });

        if (data && message.guild.channels.cache.get(data.infini.channel) && data.infini.channel === message.channel.id && message.author.id !== client.user.id && !message.author.bot) {
            
            if(data.infini.maintenance) return await message.delete();
            if(numbers.test(new Number(message.content))) {
                
                const messages = await message.channel.messages.fetch();
                const messageEmbed = messages.filter(message => message.embeds.length > 0 && message.author.id === client.user.id && message.embeds[0].description.includes("🔵")).first();

                if(messageEmbed) {

                    const lastNumber = messageEmbed.embeds[0].description.split("`")[3];
                    const lastUser = messageEmbed.embeds[0].description.split(" ")[2].replace("<@", "").replace(">", "");
                    const number = new Number(lastNumber) + 1;

                    if(lastUser === message.author.id) return await message.delete();
                    if(number.toString() !== new Number(message.content).toString()) return await message.delete();

                    await message.delete();
                    await message.guild.channels.cache.get(data.infini.channel).send({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`> \`🔵\` ${message.author} ➜ \`${message.content}\``)
                            .setColor("Blurple")
                        ]
                    });

                } else {
                    await message.delete();
                    if(message.content === "1") {
                        await message.guild.channels.cache.get(data.infini.channel).send({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`> \`🔵\` ${message.author} ➜ \`${message.content}\``)
                                .setColor("Blurple")
                            ]
                        });
                    };
                }

            } else return await message.delete();
        };
    }
};