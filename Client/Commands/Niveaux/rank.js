const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { Users } = require("../../Models");
const { profileImage } = require("discord-arts")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Permet de s'informer de son expérience.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Permet de regarder les invitations du membre.")
            .setRequired(false)
        ),

    category: "Niveaux",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({
                content: `${client.emo.no} Je n'arrive pas a trouver le membre.`,
                ephemeral: true
            });
        };

        const data = await Users.findOne({
            userId: member.user.id,
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} L'utilisateur n'a aucun niveau.`,
                ephemeral: true
            });
        };

        await interaction.deferReply();

        const allUsers = await Users.find({ guildId: interaction.guild.id });
        const userList = allUsers.map(u => ({
            id: u.userId,
            xp: u.leveling.xp + (u.leveling.level * 1000)
        }));
        userList.sort((a, b) => b.xp - a.xp);
        const rank = userList.findIndex(u => u.id === member.user.id) + 1;

        const buffer = await profileImage(member.user.id, {
            customBadges: [],
            presenceStatus: "online",
            badgesFrame: true,
            moreBackgroundBlur: true,
            backgroundBrightness: 100,
            rankData: {
                currentXp: data.leveling.xp,
                requiredXp: data.leveling.level * 1000 + 1000,
                rank: rank,
                level: data.leveling.level,
                barColor: '#fcdce1',
                levelColor: '#ada8c6',
                autoColorRank: true
            }
        });

        return await interaction.editReply({
            files: [buffer]
        });
    }
};