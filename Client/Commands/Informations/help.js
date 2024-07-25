const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, AutocompleteInteraction, PermissionsBitField, SlashCommandSubcommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, OAuth2Scopes, StringSelectMenuBuilder } = require("discord.js");
const PermissionFlags = require("../../Functions/Gestions/permissionFlags.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Permet d'obtenir des informations.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addStringOption(option => option
            .setName("commande")
            .setDescription("Informez-vous d'une commande en particulière.")
            .setAutocomplete(true)
            .setRequired(false)
        ),

    category: "Informations",

    /**
     * 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const focusedValue = interaction.options.getFocused();
        const commandsArray = Array.from(client.commands.values());
        const filtered = commandsArray.filter(choice => choice.data && choice.data.name && choice.data.name.startsWith(focusedValue)).slice(0, 25);
        await interaction.respond(filtered.map(choice =>
            ({ name: choice.data.name, value: choice.data.name })
        ));
    },

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */

    execute: async (client, interaction) => {

        if (interaction.options.getString("commande")) {
            const command = client.commands.filter(command => command.data.name === interaction.options.getString("commande")).first()
            if (!command) {
                return await interaction.reply({
                    content: `:x: Impossible de trouver la commande: \`${interaction.options.getString("commande")}\``,
                    ephemeral: true
                });
            };

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Information de la commande - ${command.data.name}`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor("Blurple")
                        .setFooter({
                            text: client.user.displayName,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTimestamp()
                        .setDescription(`> **Nom:** \`${command.data.name}\`\n> **Description:** \`${command.data.description}\`\n> **Catégorie:** \`${command.category}\`\n> **Prémium:** \`${command.premium ? 'oui' : 'non'}\`\n> **Message privé:** \`${command.data.dm_permission ? 'oui' : 'non'}\`\n> **NSFW:** \`${command.data.nsfw ? 'oui' : 'non'}\`\n> **Permissions Utilisateur:** \`${PermissionFlags(command.data.default_member_permissions)}\``)
                ]
            });
        } else {
            const totalCommandes = client.commands.map(command => {
                const subcommands = command.data.options
                    .filter(opt => opt instanceof SlashCommandSubcommandBuilder)
                    .map(sub => ({ ...command, data: { ...sub, name: `${command.data.name}-${sub.name}` } }));
                return [command, ...subcommands];
            }).flat();

            let viewcommands = totalCommandes;
            if (interaction.user.id !== process.env.ownerId) {
                viewcommands = viewcommands.filter(cmd => cmd.category !== "Propriétaires");
            };

            const cmds = viewcommands.filter(cmd => interaction.member.permissions.has(new PermissionsBitField(cmd.permission)));

            const categories = [];
            viewcommands.forEach(command => {
                if (!categories.includes(command.category)) categories.push(command.category);
            });

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`Informations des commandes du robot`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`- Commandes du robot : \`${totalCommandes.length}\`\n- Commandes disponibles pour [${interaction.user.displayName}](${process.env.supportInvite}) : \`${cmds.length}\``)
                .setTimestamp()
                .setFooter({
                    text: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                });

            const categoryOrder = {
                'Propriétaires': 1,
                'Modérations': 2,
                'Invites': 3,
                'Informations': 4,
                'Jeux': 5,
                'Musiques': 6,
                'Tickets': 7,
                'Giveaways': 8
            };

            categories.sort((a, b) => categoryOrder[a] - categoryOrder[b]);

            const menu = new StringSelectMenuBuilder()
                .setCustomId('help')
                .setPlaceholder('Choisissez une catégorie')
                .addOptions(categories.map(category => ({
                    label: category,
                    value: category
                })));

            await interaction.reply({
                embeds: [embed],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setEmoji("🔗")
                                .setLabel(`Invite ${client.user.displayName}`)
                                .setStyle(ButtonStyle.Link)
                                .setURL(client.generateInvite({
                                    scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
                                    permissions: [PermissionFlagsBits.Administrator]
                                })),
                            new ButtonBuilder()
                                .setEmoji("🔗")
                                .setLabel(`Support ${client.user.displayName}`)
                                .setStyle(ButtonStyle.Link)
                                .setURL(process.env.supportInvite)
                        ),
                    new ActionRowBuilder()
                        .addComponents(menu)
                ]
            });
        };
    }
};