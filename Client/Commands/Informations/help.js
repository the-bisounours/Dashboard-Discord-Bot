const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, AutocompleteInteraction, PermissionsBitField } = require("discord.js");
const PermissionFlags = require("../../Functions/PermissionFlags");

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
        const filtered = client.commands.filter(choice => choice.data.name.startsWith(focusedValue));
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

        if(interaction.options.getString("commande")) {
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
            let viewcommands;
            if(interaction.user.id !== process.env.ownerId) {
                viewcommands = client.commands.filter(cmd => cmd.category !== "Propriétaires");
            };
            viewcommands = viewcommands.map(cmd => interaction.member.permissions.has(new PermissionsBitField(cmd.permission)));
            const cmds = viewcommands.filter(c => c === true);

            const categories = [];
            client.commands.forEach(command => {
                if (!categories.includes(command.category)) categories.push(command.category);
            });

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`Informations des commandes du robot`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`- Commandes du robot : \`${client.commands.size}\`\n- Commandes disponibles pour [${interaction.user.displayName}](${process.env.supportInvite}) : \`${cmds.length}\``)
                .setTimestamp()
                .setFooter({ 
                    text: client.user.username, 
                    iconURL: client.user.displayAvatarURL() 
                });

            const categoryOrder = {
                'Propriétaires': 1, 
                'Modérations': 2, 
                'Informations': 3, 
                'Jeux': 4, 
                'Musiques': 5
            };

            categories.sort((a, b) => categoryOrder[a] - categoryOrder[b]).forEach(async category => {
                let commands = client.commands.filter(cmd => cmd.category === category);

                if(interaction.user.id !== process.env.ownerId) {
                    commands = commands.filter(cmd => cmd.category !== "Propriétaires");
                };

                const categoryEmpty = commands.map(cmd => interaction.member.permissions.has(new PermissionsBitField(cmd.permission)));

                if (categoryEmpty.every(element => element === false)) return;
                embed.addFields({
                    name: `${category} [\`${commands.size}\`]`, value: `>>> ${commands.map(cmd => `${interaction.member.permissions.has(new PermissionsBitField(cmd.permission)) ? `[\`${cmd.data.name}\`](${process.env.supportInvite})` : ""}`).join(" ")}`
                });
            });

            return await interaction.reply({ 
                embeds: [embed],
            });
        };
    }
};