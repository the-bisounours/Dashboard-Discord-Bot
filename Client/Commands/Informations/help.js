const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, AutocompleteInteraction, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Permet d'obtenir des informations concernant les commandes disponibles du roclient.")
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

        if (!interaction.options.getString("commande")) {
            const activCmds = client.commands.map(cmd => interaction.member.permissions.has(new PermissionsBitField(cmd.permission)));
            const sortie = activCmds.filter(c => c === true);

            const categories = [];
            client.commands.forEach(command => {
                if (!categories.includes(command.category)) categories.push(command.category);
            });

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`Informations des commandes du robot`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Commandes du robot : \`${client.commands.size}\`\nCommandes disponibles pour ${interaction.member} : \`${sortie.length}\``)
                .setTimestamp()
                .setFooter({ text: `${client.user.username} - help`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            await categories.sort().forEach(async category => {
                const commands = client.commands.filter(cmd => cmd.category === category);
                const categoryEmpty = commands.map(cmd => interaction.member.permissions.has(new PermissionsBitField(cmd.permission)));

                if (categoryEmpty.every(element => element === false)) return;
                embed.addFields({
                    name: `${category}`, value: `>>> ${commands.map(cmd => `${interaction.member.permissions.has(new PermissionsBitField(cmd.permission)) ? `\`/${cmd.name}\` : ${cmd.description}\n` : ""}`).join("")}`
                });
            });

            return await interaction.reply({ 
                embeds: [embed],
            });
        } else {

            const command = client.commands.filter(command => command.data.name === interaction.options.getString("commande")).first()
            if (!command) {
                return await interaction.reply({
                    content: `Impossible de trouver la commande: \`${interaction.options.getString("commande")}\``,
                    ephemeral: true
                });
            };

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Information de la commande - ${command.data.name}`)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(user.customPreferences.couleur)
                        .setFooter({
                            text: client.user.displayName,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTimestamp()
                        .setDescription(`> **Nom:** \`${command.data.name}\`\n> **Description:** \`${command.data.description}\`\n> **Catégorie:** \`${command.category}\`\n> **Prémium:** \`${command.premium ? 'oui' : 'non'}\`\n> **Message privé:** \`${command.data.dm_permission ? 'oui' : 'non'}\`\n> **NSFW:** \`${command.data.nsfw ? 'oui' : 'non'}\`\n> **Permissions Utilisateur:** \`${await client.function.PermissionFlags([command.data.default_member_permissions])}\`\n> **Permissions Roclient:** ${await client.function.PermissionFlags(command.permissionsclient).map(permission => `\`${permission}\``).join(" ")}\n> **Permissions Salon:** ${await client.function.PermissionFlags(command.permissionsChannel).map(permission => `\`${permission}\``).join(" ")}`)
                ]
            });
        };
    }
};