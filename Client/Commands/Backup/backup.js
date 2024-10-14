const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder } = require("discord.js");
const backup = require("discord-backup");
const { Backups } = require("../../Models");
const paginations = require("../../Functions/Gestions/paginations");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("backup")
        .setDescription("Permet de faire une backup de son serveur discord.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub
            .setName("create")
            .setDescription("Permet de créer une backup de son serveur discord.")
            .addStringOption(option => option
                .setName("nobackup")
                .setDescription("Permet de choisir les options qu'on ne veut pas backup.")
                .addChoices(
                    {
                        name: "Rôles",
                        value: "roles"
                    },
                    {
                        name: "Salons",
                        value: "channels"
                    },
                    {
                        name: "Bannissement",
                        value: "bans"
                    }
                )
                .setRequired(false)
            )
            .addNumberOption(option => option
                .setName("messages")
                .setDescription("Permet de choisir le nombre de message a backup.")
                .setMinValue(1)
                .setMaxValue(25)
                .setRequired(false)
            )
        )
        .addSubcommand(sub => sub
            .setName("list")
            .setDescription("Permet de lister les backups de vos serveurs.")
        )
        .addSubcommand(sub => sub
            .setName("delete")
            .setDescription("Permet de supprimer une backup.")
            .addStringOption(option => option
                .setName("identifiant")
                .setDescription("Permet de choisir la backup a supprimer.")
                .setAutocomplete(true)
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("load")
            .setDescription("Permet de load une backup.")
            .addStringOption(option => option
                .setName("identifiant")
                .setDescription("Permet de choisir la backup a mettre.")
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addBooleanOption(option => option
                .setName("clear")
                .setDescription("Permet de choisir de supprimer le serveur ou non avant refonte.")
                .setRequired(false)
            )
        ),

    category: "Backup",

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const backups = await Backups.find({
            userId: interaction.user.id
        });

        const focusedValue = interaction.options.getFocused();
        const filtered = backups.filter(choice => choice.backupData.name.toLocaleLowerCase().includes(focusedValue.toLocaleLowerCase())).slice(0, 25);
        await interaction.respond(filtered.map(choice =>
            ({ name: `${choice.backupData.name} - ${choice.backupData.id}`, value: choice.backupData.id })
        ));
    },

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const backups = await Backups.find({
            userId: interaction.user.id
        });

        switch (interaction.options.getSubcommand()) {
            case "create":

                if (backups.length >= 5) {
                    return await interaction.reply({
                        content: `${client.emo.no} Vous avez déjà cinq backup de créer.`,
                        ephemeral: true
                    });
                };

                await interaction.deferReply({ ephemeral: true });
                backup.create(interaction.guild, {
                    maxMessagesPerChannel: interaction.options.getNumber("messages") ? interaction.options.getNumber("messages") : 0,
                    jsonSave: false,
                    jsonBeautify: true,
                    doNotBackup: interaction.options.getString("nobackup") ? [interaction.options.getString("nobackup"), "emojis"] : ["emojis"],
                    saveImages: "base64"
                }).then(async backupData => {

                    await new Backups({
                        userId: interaction.user.id,
                        backupData: backupData
                    }).save();

                    return await interaction.editReply({
                        content: `${client.emo.yes} Votre backup a bien été crée \`${backupData.id}\`.`
                    });
                });

                break;
            case "list":

                const embeds = [];
                for (let index = 0; index < backups.length; index++) {
                    const backup = backups[index];
                    
                    embeds.push(
                        new EmbedBuilder()
                            .setTitle(`Informations de la backup - ${backup.backupData.name}`)
                            .setDescription(`> ${client.emo.id} **Identifiant:** \`${backup.backupData.id}\`\n> ${client.emo.region} **Nom:** \`${backup.backupData.name}\`\n> ${client.emo.mention} **Rôles:** \`${backup.backupData.roles.length}\` rôle${backup.backupData.roles.length > 1 ? "s" : ""}\n> ${client.emo.salon} **Salons:** \`${backup.backupData.channels.categories.length + backup.backupData.channels.others.length}\` salon${backup.backupData.channels.categories.length + backup.backupData.channels.others.length > 1 ? "s" : ""}\n> ${client.emo.temp} **Date de création:** <t:${Math.round(backup.backupData.createdTimestamp / 1000)}:D> <t:${Math.round(backup.backupData.createdTimestamp / 1000)}:R>`)
                            .setFooter({
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setColor("Blurple")
                    );
                };
        
                return await paginations(interaction, embeds, 60 * 1000, false);

                break;
            case "delete":

                if (backups.length === 0) {
                    return interaction.reply({
                        content: `${client.emo.no} Vous n'avez aucune backup.`,
                        ephemeral: true
                    });
                };

                if (!backups.find(backup => backup.backupData.id === interaction.options.getString("identifiant"))) {
                    return await interaction.reply({
                        content: `${client.emo.no} La backup n'existe pas.`,
                        ephemeral: true
                    });
                };

                await Backups.findOneAndDelete({
                    userId: interaction.user.id,
                    [`backupData.id`]: interaction.options.getString("identifiant")
                });

                await interaction.reply({
                    content: `${client.emo.yes} La backup a bien été supprimé.`,
                    ephemeral: true
                });

                break;
            case "load":

                if (backups.length === 0) {
                    return interaction.reply({
                        content: `${client.emo.no} Vous n'avez aucune backup.`,
                        ephemeral: true
                    });
                };

                if (!backups.find(backup => backup.backupData.id === interaction.options.getString("identifiant"))) {
                    return await interaction.reply({
                        content: `${client.emo.no} La backup n'existe pas.`,
                        ephemeral: true
                    });
                };

                await interaction.deferReply({ ephemeral: true });
                await backup.load(backups.find(backup => backup.backupData.id === interaction.options.getString("identifiant")).backupData, interaction.guild, {
                    clearGuildBeforeRestore: interaction.options.getBoolean("clear")
                });

                break;
            default:
                break;
        }
    }
}