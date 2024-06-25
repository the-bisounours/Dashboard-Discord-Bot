const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const duration = require("../../Functions/duration");
const { Schedule } = require("../../Models");
const paginations = require("../../Functions/paginations");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("Permet de mettre rappel.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addSubcommand(sub => sub
            .setName("create")
            .setDescription("Permet de créer un rappel.")
            .addStringOption(option => option
                .setName("duration")
                .setDescription("La durée du rappel")
                .setRequired(true)
                .setAutocomplete(false)
            )
            .addStringOption(option => option
                .setName("message")
                .setDescription("Le message du rappel")
                .setRequired(true)
                .setAutocomplete(false)
            )
        )
        .addSubcommand(sub => sub
            .setName("delete")
            .setDescription("Permet de supprimer un rappel.")
            .addStringOption(option => option
                .setName("message")
                .setDescription("Le message du rappel")
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("list")
            .setDescription("Permet de lister les rappels.")
        ),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        switch (interaction.options.getSubcommand()) {
            case "create":

                const remindTime = duration(interaction.options.getString("duration"));

                if (!remindTime) {
                    return await interaction.reply({
                        content: "La durée du rappel est invalide. (ex: \`2d\` \`11h\` \`50m\` \`30s\`)",
                        ephemeral: true
                    });
                };

                new Schedule({
                    userId: interaction.user.id,
                    channelId: interaction.channel.id,
                    message: interaction.options.getString("message"),
                    remindAt: new Date(Date.now() + remindTime),
                }).save();

                await interaction.reply({
                    content: `Rappel configuré <t:${Math.round(new Date(Date.now() + remindTime) / 1000)}:R>`,
                    ephemeral: true
                });

            break;
            case "delete":

                const scheduleMessage = interaction.options.getString("message");

                const reminder = await Schedule.findOneAndDelete({
                    userId: interaction.user.id,
                    message: scheduleMessage,
                });

                if (!reminder) {
                    return await interaction.reply({
                        content: "Le rappel n'a pas été trouvé.",
                        ephemeral: true
                    });
                };

                await interaction.reply({
                    content: "Le rappel a bien été supprimé.",
                    ephemeral: true
                });

            break;
            case "list":

                const reminders = await Schedule.find({
                    userId: interaction.user.id
                });

                if(reminders.length === 0) {
                    return await interaction.reply({
                        content: "Vous n'avez aucun rappel.",
                        ephemeral: true
                    });
                };

                const embeds = [];

                for (let index = 0; index < reminders.length; index++) {
                    const reminder = reminders[index];
                    embeds.push(
                        new EmbedBuilder()
                            .setTitle("Information de la liste des rappels")
                            .setColor("Blurple")
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setThumbnail(interaction.user.displayAvatarURL())
                            .setDescription(`> **Message:** \`${reminder.message}\`\n> **Durée:** <t:${Math.round(reminder.remindAt / 1000)}:D> <t:${Math.round(reminder.remindAt / 1000)}:R>\n> **Salon:** ${interaction.guild.channels.cache.get(reminder.channelId)}\n> **Date de création:** <t:${Math.round(reminder.createdAt / 1000)}:D> <t:${Math.round(reminder.createdAt / 1000)}:R>`)
                    )
                };

                await paginations(interaction, embeds, 60 * 1000, false);

            break;
            default:
            break;
        }
    }
};