const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const duration = require("../../Functions/Gestions/duration");
const { Giveaways } = require("../../Models");
const id = require("../../Functions/Gestions/id");
const endGiveaway = require("../../Functions/Giveaways/endGiveaway");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gstart")
        .setDescription("Permet de commencer un giveaway.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
        .addStringOption(option => option
            .setName("prix")
            .setDescription("Permet de configurer le cadeau du giveaway.")
            .setAutocomplete(false)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("durée")
            .setDescription("Permet de configurer la durée du giveaway.")
            .setAutocomplete(false)
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName("gagnants")
            .setDescription("Permet de configurer le nombre de gagnant du giveaway.")
            .setRequired(true)
            .setMaxValue(50)
            .setMinValue(1)
        )
        .addNumberOption(option => option
            .setName("bonus")
            .setDescription("Permet de configurer le nombre de bonus du giveaway.")
            .setRequired(false)
            .setMaxValue(50)
            .setMinValue(1)
        )
        .addRoleOption(option => option
            .setName("rôle-bonus")
            .setDescription("Permet de configurer les rôles bonus du giveaway.")
            .setRequired(false)
        )
        .addUserOption(option => option
            .setName("utilisateur-bonus")
            .setDescription("Permet de configurer les utilisateurs bonus du giveaway.")
            .setRequired(false)
        )
        .addRoleOption(option => option
            .setName("rôle-requis")
            .setDescription("Permet de configurer les rôles requis du giveaway.")
            .setRequired(false)
        )
        .addNumberOption(option => option
            .setName("invite-requise")
            .setDescription("Permet de configurer le nombre d'invite requise du giveaway.")
            .setRequired(false)
            .setMaxValue(100)
            .setMinValue(1)
        )
        .addStringOption(option => option
            .setName("serveur-requis")
            .setDescription("Permet de configurer le serveur requis du giveaway.")
            .setAutocomplete(true)
            .setRequired(false)
        ),

    category: "Giveaways",

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const focusedValue = interaction.options.getFocused();
        const commandsArray = Array.from(client.guilds.cache.values());
        const filtered = commandsArray.filter(choice => choice.name.startsWith(focusedValue)).slice(0, 25);
        await interaction.respond(filtered.map(choice =>
            ({ name: choice.name, value: choice.id })
        ));
    },

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const prize = interaction.options.getString("prix");
        const winners = interaction.options.getNumber("gagnants");
        const bonus = interaction.options.getNumber("bonus");
        const roleBonus = interaction.options.getRole("rôle-bonus");
        const userBonus = interaction.options.getUser("utilisateur-bonus");
        const roleRequired = interaction.options.getRole("rôle-requis");
        const inviteRequired = interaction.options.getNumber("invite-requise");
        const serverRequired = interaction.options.getString("serveur-requis");
        const time = duration(interaction.options.getString("durée"));

        if (!time) {
            return await interaction.reply({
                content: ":x: La durée du giveaway est invalide. (ex: \`2d\` \`11h\` \`50m\` \`30s\`)",
                ephemeral: true
            });
        };

        const embed = new EmbedBuilder()
            .setTitle("Giveaway commencé")
            .setDescription(`Un nouveau concours vient d'être commencé, participe et tente de gagner: \`${prize}\`.`)
            .setColor("Blurple")
            .addFields(
                {
                    name: "Prix",
                    value: `\`${prize}\``,
                    inline: true
                },
                {
                    name: "Gagnants",
                    value: `\`${winners} gagnant${winners > 1 ? "s" : ""}\``,
                    inline: true
                },
                {
                    name: "Fin",
                    value: `<t:${Math.round(new Date().setMilliseconds(new Date().getMilliseconds() + time) / 1000)}:R>`,
                    inline: true
                }
            )
            .setFooter({
                text: `Giveaway lancer par ${interaction.user.displayName}`,
                iconURL: client.user.displayAvatarURL()
            });

        if (bonus && bonus > 0 && !roleBonus && !userBonus) {
            return await interaction.reply({
                content: ":x: Pour ajouter un bonus vous devez ajouter un rôle ou un utilisateur.",
                ephemeral: true
            });
        } else if (bonus) {

            embed.addFields(
                {
                    name: "Bonus",
                    value: `\`${bonus} bonus\``,
                    inline: true
                }
            );

            if (roleBonus) {
                embed.addFields(
                    {
                        name: "Rôle bonus",
                        value: `${roleBonus}`,
                        inline: true
                    }
                );
            };

            if (userBonus) {
                embed.addFields(
                    {
                        name: "User bonus",
                        value: `${userBonus}`,
                        inline: true
                    }
                );
            };

            if (!userBonus && roleBonus || !roleBonus && userBonus) {
                embed.addFields(
                    {
                        name: `\u200B`,
                        value: `\u200B`,
                        inline: true
                    }
                );
            };
        };

        let fieldCount = 0;
        if (roleRequired) {
            embed.addFields(
                {
                    name: `Rôle requis`,
                    value: `${roleRequired}`,
                    inline: true
                }
            );
            fieldCount++;
        };

        if (inviteRequired) {
            embed.addFields(
                {
                    name: `Invites requise`,
                    value: `\`${inviteRequired} invite${inviteRequired > 1 ? "s" : ""}\``,
                    inline: true
                }
            );
            fieldCount++;
        };

        if (serverRequired) {
            embed.addFields(
                {
                    name: `Serveur requis`,
                    value: `\`${client.guilds.cache.get(serverRequired).name}\``,
                    inline: true
                }
            );
            fieldCount++;
        };

        if (fieldCount === 1) {
            embed.addFields(
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                }
            );
        } else if (fieldCount === 2) {
            embed.addFields(
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true
                }
            );
        };

        await interaction.channel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("enter_giveaway")
                            .setLabel("Participer au giveaway")
                            .setDisabled(false)
                            .setEmoji("🎉")
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        })
            .then(async message => {

                const giveaway = new Giveaways({
                    guildId: interaction.guild.id,
                    giveawayId: id("GIVEAWAY", 8),
                    messageId: message.id,
                    channelId: interaction.channel.id,
                    userId: interaction.user.id,
                    pause: false,
                    prize: prize,
                    endTime: new Date().setMilliseconds(new Date().getMilliseconds() + time),
                    participants: [],
                    settings: {
                        winners: winners ? winners : 1,
                        requiredGuild: serverRequired ? serverRequired : "",
                        inviteRequired: inviteRequired ? inviteRequired : 0,
                        requiredRoles: roleRequired ? [roleRequired.id] : [],
                        bonus: {
                            roles: roleBonus ? [roleBonus.id] : [],
                            users: userBonus ? [userBonus.id] : [],
                            number: bonus ? bonus : 0
                        }
                    }
                });
                await giveaway.save();

                await interaction.reply({
                    content: `Un giveaway pour \`${prize}\` a été créé avec l'identifiant suivant: \`${giveaway.giveawayId}\`\nÇa finira <t:${Math.round(new Date().setMilliseconds(new Date().getMilliseconds() + time) / 1000)}:R>`,
                    ephemeral: true
                });

                const endTime = new Date(giveaway.endTime).getTime() - Date.now();
                setTimeout(async () => {
                    return await endGiveaway(client, giveaway.giveawayId, false);
                }, endTime);
            })
            .catch(async err => {
                return await interaction.reply({
                    content: ":x: Une erreur est survenue lors du lancement du giveaway.",
                    ephemeral: true
                });
            });
    }
};