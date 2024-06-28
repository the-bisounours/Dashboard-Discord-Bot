const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const convert = require("../../Functions/Gestions/convert");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addrole-all")
        .setDescription("Permet de donner un rôle aux membres.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addRoleOption(option => option
            .setName("rôle")
            .setDescription("Le role a donner aux membres.")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("uniquement")
            .setDescription("Le role doit etre donner aux membres ou aux robots seulement")
            .setRequired(true)
            .addChoices(
                { name: "Tous le monde", value: "everyone" },
                { name: "Membres", value: "members" },
                { name: "Robots", value: "bots" },
            )
        )
        .addStringOption(option => option
            .setName("raison")
            .setDescription("La raison de donner le rôle aux membres.")
            .setRequired(false)
            .setMaxLength(200)
            .setMinLength(1)
        )
        .addAttachmentOption(option => option
            .setName("preuve")
            .setDescription("La preuve de donner le rôle aux membres.")
            .setRequired(false)
        ),

    category: "Modérations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const role = interaction.guild.roles.cache.get(interaction.options.getRole("rôle").id);
        const raison = interaction.options.getString("raison") ? interaction.options.getString("raison") : "aucune raison";
        const uniquement = interaction.options.getString("uniquement");

        const time = Date.now();
        let count = 0;
        await interaction.deferReply({ ephemeral: false });

        const members = await interaction.guild.members.fetch();
        const filterMembers = uniquement === "bots" ? members.filter(member => member.user.bot) : uniquement === "members" ? members.filter(member => !member.user.bot) : members
        const promises = filterMembers.map(async member => {
            if (member.user.id !== interaction.guild.ownerId && member.user.id !== client.user.id) {

                if (interaction.guild.members.me.roles.highest.comparePositionTo(member.roles.highest) > 0) {
                    if (interaction.guild.members.me.roles.highest.comparePositionTo(role) > 0) {

                        if (!member.roles.cache.has(role.id)) {
                            await interaction.guild.members.addRole({
                                user: member.user,
                                role: role,
                                reason: raison
                            })
                                .then(() => { count++; })
                                .catch(() => {});
                        };
                    };
                };
            };
        })

        await Promise.all(promises)
            .then(async () => {
                return await interaction.followUp({
                    content: `Vous avez donner \`${role.name}\` à \`${count}\` membres pour \`${raison}\`, réaliser en ${convert(Date.now() - time, "millisecondes")}.${interaction.options.getAttachment("preuve") ? ` [\`preuve\`](${interaction.options.getAttachment("preuve").url})` : ""}`,
                });
            })
            .catch(async err => {
                return await interaction.followUp({
                    content: `Une erreur s'est produite.`,
                    ephemeral: true
                });
            });
    }
};