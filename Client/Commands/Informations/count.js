const { SlashCommandBuilder, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("count")
        .setDescription("Permet de compter les membres.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const members = await interaction.guild.members.fetch();

        return await interaction.reply({
            content: `Nous sommes \`${interaction.guild.memberCount}\` au total sur le serveur dont \`${members.filter(member => member.user.bot).size}\` robot et \`${members.filter(member => !member.user.bot).size}\` membres.`
        });
    }
};