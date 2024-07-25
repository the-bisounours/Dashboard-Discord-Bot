const { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Giveaways, Users } = require("../../Models");

module.exports = {
    id: "enter_giveaway",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const giveaway = await Giveaways.findOne({
            messageId: interaction.message.id
        });

        if (!giveaway) {
            return await interaction.reply({
                content: `${client.emo.no} Le giveaway n'existe plus.`,
                ephemeral: true
            });
        };

        if (giveaway.participants.some(user => user.userId === interaction.user.id)) {
            return await interaction.reply({
                content: `${client.emo.no} Vous avez déjà participé à ce concours !`,
                ephemeral: true,
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("leave_giveaway")
                                .setDisabled(false)
                                .setEmoji("❌")
                                .setLabel("Quitter le giveaway")
                                .setStyle(ButtonStyle.Danger)
                        )
                ]
            });
        };

        if (giveaway.settings.inviteRequired !== 0) {
            const user = await Users.findOne({
                guildId: interaction.guild.id,
                userId: interaction.user.id
            });

            const realInvites = user.invites.bonus + user.invites.join - user.invites.fake - user.invites.leave;

            if (realInvites < giveaway.settings.inviteRequired) {
                return await interaction.reply({
                    content: `${client.emo.no} Vous n'avez pas assez d'invitation pour participer au giveaway \`${realInvites}\`/\`${giveaway.settings.inviteRequired}\`.`,
                    ephemeral: true
                });
            };
        };

        if (giveaway.settings.requiredGuild && client.guilds.cache.get(giveaway.settings.requiredGuild)) {

            if (client.guilds.cache.get(giveaway.settings.requiredGuild).members.cache.get(interaction.user.id)) {
                return await interaction.reply({
                    content: `${client.emo.no} Vous devez rejoindre le serveur \`${client.guilds.cache.get(giveaway.settings.requiredGuild).name}\` pour participer au giveaway.`,
                    ephemeral: true
                });
            };
        };

        for (let index = 0; index < giveaway.settings.requiredRoles.length; index++) {
            const requiredRole = giveaway.settings.requiredRoles[index];
            const role = interaction.guild.roles.cache.get(requiredRole);

            if (role && !interaction.member.roles.cache.has(role.id)) {
                return await interaction.reply({
                    content: `${client.emo.no} Vous devez avoir le rôle ${role} pour participer au giveaway.`,
                    ephemeral: true
                });
            };
        };

        let bonus = 0;
        for (let index = 0; index < giveaway.settings.bonus.roles.length; index++) {
            const roleBonus = giveaway.settings.bonus.roles[index];
            const role = interaction.guild.roles.cache.get(roleBonus);
            if (role && interaction.member.roles.cache.has(role.id)) bonus = bonus + giveaway.settings.bonus.number;
        };

        if (giveaway.settings.bonus.users.includes(interaction.user.id)) bonus = bonus + giveaway.settings.bonus.number;

        giveaway.participants.push({
            userId: interaction.user.id,
            bonus: bonus
        });
        await giveaway.save();

        return await interaction.update({
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("enter_giveaway")
                            .setLabel("Participer au giveaway")
                            .setDisabled(false)
                            .setEmoji("🎉")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("participants")
                            .setLabel(`${giveaway.participants.length} participant${giveaway.participants.length > 1 ? "s": ""}`)
                            .setDisabled(true)
                            .setEmoji("✏️")
                            .setStyle(ButtonStyle.Secondary)
                    )
            ]
        });
    }
};