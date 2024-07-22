const { Events, Client, ChatInputCommandInteraction } = require("discord.js");
const { Users } = require("../../Models");

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async (client, interaction) => {

        if(interaction.user.bot) return;
        
        const data = await Users.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        if(!data) {
            await new Users({
                userId: interaction.user.id,
                guildId: interaction.guild.id
            }).save();
        };
    }
};