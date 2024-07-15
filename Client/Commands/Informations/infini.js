const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { Guilds } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infini")
        .setDescription("Permet de configurer le système d'infini.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option => option
            .setName("option")
            .setDescription("Permet de choisir l'option de configuration.")
            .setRequired(true)
            .setAutocomplete(false)
            .addChoices(
                {
                    name: "Activé la maintenance",
                    value: "maintenance-on"
                },
                {
                    name: "Désactivé la maintenance",
                    value: "maintenance-off"
                },
                {
                    name: "Commencer",
                    value: "start"
                },
                {
                    name: "Terminer",
                    value: "end"
                }
            )
        )
        .addChannelOption(option => option
            .setName("salon")
            .setDescription("Permet de configurer le salon de l'infini")
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        ),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: ":x: Impossible de trouver la base de donnée du serveur.",
                ephemeral: true
            });
        };

        switch (interaction.options.getString("option")) {
            case "maintenance-on":

                if (!interaction.guild.channels.cache.get(data.infini.channel)) {
                    return await interaction.reply({
                        content: ":x: Le sysème d'infini n'est pas configuré.",
                        ephemeral: true
                    });
                };

                if (data.infini.maintenance) {
                    return await interaction.reply({
                        content: ":x: Le sysème d'infini est actuellement en maintenance.",
                        ephemeral: true
                    });
                };

                await interaction.guild.channels.cache.get(data.infini.channel).send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("> \`🟡\` Le système infini est actuellement en maintenance.")
                            .setColor("Yellow")
                    ]
                });

                data.infini.maintenance = true;
                await data.save();

                await interaction.reply({
                    content: `Vous avez activé la maintenance.`,
                    ephemeral: true
                });

                break;
            case "maintenance-off":

                if (!interaction.guild.channels.cache.get(data.infini.channel)) {
                    return await interaction.reply({
                        content: ":x: Le sysème d'infini n'est pas configuré.",
                        ephemeral: true
                    });
                };

                await interaction.guild.channels.cache.get(data.infini.channel).send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("> \`🟡\` Le système infini a terminé sa maintenance.")
                            .setColor("Yellow")
                    ]
                });

                data.infini.maintenance = false;
                await data.save();

                await interaction.reply({
                    content: `Vous avez désactivé la maintenance.`,
                    ephemeral: true
                });
                break;
            case "start":

                let channel = interaction.options.getChannel("salon");
                if(!channel) channel = interaction.channel;

                if (data.infini.channel && interaction.guild.channels.cache.get(data.infini.channel)) {
                    return await interaction.reply({
                        content: `:x: Le sysème d'infini a déjà commencé dans le salon ${interaction.guild.channels.cache.get(data.infini.channel)}.`,
                        ephemeral: true
                    });
                };

                data.infini.channel = channel.id;
                await data.save();

                await interaction.guild.channels.cache.get(data.infini.channel).send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("> \`🟢\` Le système infini peut commencer à compter depuis le début.")
                            .setColor("Green")
                    ]
                });

                await interaction.reply({
                    content: `Vous avez lancé le système d'infini dans le salon ${channel}`,
                    ephemeral: true
                });
                break;
            case "end":

                if (!interaction.guild.channels.cache.get(data.infini.channel)) {
                    return await interaction.reply({
                        content: ":x: Le sysème d'infini est déjà arrêté.",
                        ephemeral: true
                    });
                };

                await interaction.guild.channels.cache.get(data.infini.channel).send({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("> \`🔴\` Le système infini a été arrêté.")
                            .setColor("Red")
                    ]
                });

                data.infini.channel = "";
                await data.save();

                await interaction.reply({
                    content: `Vous avez arrêté le système d'infini.`,
                    ephemeral: true
                });
                break;
            default:
                break;
        };
    }
};