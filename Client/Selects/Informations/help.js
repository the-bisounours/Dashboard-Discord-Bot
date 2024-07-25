const { Client, StringSelectMenuInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    id: "help",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
                ephemeral: true
            });
        };
        
        const selectedCategory = interaction.values[0];
        const commands = client.commands.filter(cmd => cmd.category === selectedCategory);

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`Informations des commandes - ${selectedCategory}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(commands.map(cmd => `> \`${cmd.data.name}\`: ${cmd.data.description}`).join('\n'))
            .setTimestamp()
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.update({
            embeds: [embed]
        });
    }
};