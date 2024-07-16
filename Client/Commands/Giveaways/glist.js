const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { Giveaways } = require("../../Models");
const paginations = require("../../Functions/Gestions/paginations");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("glist")
        .setDescription("Permet de voir la liste des giveaways en cours.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),

    category: "Giveaways",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const giveaways = await Giveaways.find({
            guildId: interaction.guild.id
        });

        if (giveaways.length === 0) {
            return await interaction.reply({
                content: ":x: Il y a aucun giveaway actuellement en cours.",
                ephemeral: true
            });
        };

        const embeds = [];
        for (let index = 0; index < giveaways.length; index++) {
            const giveaway = giveaways[index];

            embeds.push(
                new EmbedBuilder()
                    .setTitle(`Information du giveaway - ${giveaway.giveawayId}`)
                    .setColor("Blurple")
                    .addFields(
                        {
                            name: "Prix",
                            value: `\`${giveaway.prize}\``,
                            inline: true
                        },
                        {
                            name: "Gagnants",
                            value: `\`${giveaway.settings.winners} gagnant${giveaway.settings.winners > 1 ? "s" : ""}\``,
                            inline: true
                        },
                        {
                            name: "Fin",
                            value: `<t:${Math.round(giveaway.endTime / 1000)}:R>`,
                            inline: true
                        },
                        {
                            name: "Bonus",
                            value: `\`${giveaway.settings.bonus.number} bonus\``,
                            inline: true
                        },
                        {
                            name: "Rôles bonus",
                            value: `\`${giveaway.settings.bonus.roles.length} rôle${giveaway.settings.bonus.roles.length > 1 ? "s" : ""}\``,
                            inline: true
                        },
                        {
                            name: "User bonus",
                            value: `\`${giveaway.settings.bonus.users.length} utilisateur${giveaway.settings.bonus.users.length > 1 ? "s" : ""}\``,
                            inline: true
                        },
                        {
                            name: `Rôle requis`,
                            value: `\`${giveaway.settings.requiredRoles.length} rôle${giveaway.settings.requiredRoles.length > 1 ? "s" : ""}\``,
                            inline: true
                        },
                        {
                            name: `Invites requise`,
                            value: `\`${giveaway.settings.inviteRequired} invite${giveaway.settings.inviteRequired > 1 ? "s" : ""}\``,
                            inline: true
                        },
                        {
                            name: `Serveur requis`,
                            value: `\`${giveaway.settings.requiredGuild ? client.guilds.cache.get(giveaway.settings.requiredGuild).name : "Aucun"}\``,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: `Fait par the_bisounours - Giveaway lancer par ${interaction.guild.members.cache.get(giveaway.userId)?.displayName}`,
                        iconURL: client.user.displayAvatarURL()
                    })
            );
        };

        return await paginations(interaction, embeds, 60 * 1000, false);
    }
};