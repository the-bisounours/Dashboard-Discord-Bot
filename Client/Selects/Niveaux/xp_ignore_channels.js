const { Client, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuInteraction } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    id: "xp_ignore_channels",

    /**
     * 
     * @param {Client} client 
     * @param {ChannelSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        data.level.settings.ignore.channels =  interaction.values;
        await data.save();

        await interaction.reply({
            content: `${client.emo.yes} Les salons d'ignore ont été mis a jour.`,
            ephemeral: true
        });

        return await interaction.message.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Information du système de niveaux")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setDescription(`> ${client.emo.settings} **Système:** \`${data.level.settings.enabled ? "Activé" : "Désactivé"}\`\n> ${client.emo.messages} **Message:** ${data.level.settings.message.enabled ? `\`Activé\` ${data.level.settings.message.image ? `\`Image\`` : ""} ${data.level.settings.message.channel && interaction.guild.channels.cache.get(data.level.settings.message.channel) ? `${interaction.guild.channels.cache.get(data.level.settings.message.channel)}` : "\`Salon Actuel\`"}` : "\`Désactivé\`"}\n> ${client.emo.etoile} **Proportion:** entre \`${data.level.settings.ratio.min}\` et \`${data.level.settings.ratio.max}\`\n> ${client.emo.salon} **Ignore:** ${data.level.settings.ignore.ticket ? "\`Ticket\`" : ""} ${data.level.settings.ignore.channels.length > 0 ? `\`${data.level.settings.ignore.channels.length}\` salon${data.level.settings.ignore.channels.length > 1 ? "s" : ""}` : ""} ${data.level.settings.ignore.roles.length > 0 ? `\`${data.level.settings.ignore.roles.length}\` rôle${data.level.settings.ignore.roles.length > 1 ? "s" : ""}` : ""} ${!data.level.settings.ignore.ticket && data.level.settings.ignore.roles.length === 0 && data.level.settings.ignore.channels.length === 0 ? "\`Aucun\`" : ""}\n> ${client.emo.idee} **Bonus:** ${data.level.settings.bonus.channels.length > 0 ? `\`${data.level.settings.bonus.channels.length}\` salon${data.level.settings.bonus.channels.length > 1 ? "s" : ""}` : ""} ${data.level.settings.bonus.roles.length > 0 ? `\`${data.level.settings.bonus.roles.length}\` rôle${data.level.settings.bonus.roles.length > 1 ? "s" : ""}` : ""} ${data.level.settings.bonus.roles.length === 0 && data.level.settings.bonus.channels.length === 0 ? "\`Aucun\`" : ""}\n> ${client.emo.home} **Reset On Leave:** \`${data.level.settings.resetLeave ? "Activé" : "Désactivé"}\``)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("xp_config")
                            .setDisabled(false)
                            .setMaxValues(1)
                            .setMinValues(1)
                            .setPlaceholder("Permet de configurer le système d'expérience.")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_enabled")
                                    .setEmoji(`${data.level.settings.enabled ? client.emo.no : client.emo.yes}`)
                                    .setLabel(`${data.level.settings.enabled ? "Désactivé l'xp" : "Activé l'xp"}`),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_reset")
                                    .setEmoji(`${data.level.settings.resetLeave ? client.emo.no : client.emo.yes}`)
                                    .setLabel(`${data.level.settings.resetLeave ? "Ne pas réinitialiser l'xp en quittant" : "Réinitialiser l'xp en quittant"}`),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_message")
                                    .setEmoji(`${client.emo.messages}`)
                                    .setLabel("Système de message"),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_proportion")
                                    .setEmoji(`${client.emo.etoile}`)
                                    .setLabel("Système de proportion"),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_ignore")
                                    .setEmoji(`${client.emo.salon}`)
                                    .setLabel("Système d'ignore"),
                                new StringSelectMenuOptionBuilder()
                                    .setValue("xp_bonus")
                                    .setEmoji(`${client.emo.idee}`)
                                    .setLabel("Système de bonus")
                            )
                    )
            ]
        });
    }
};