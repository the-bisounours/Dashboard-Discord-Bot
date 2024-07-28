const { Events, Client, CommandInteraction } = require("discord.js");

module.exports = {

    name: Events.InteractionCreate,
    once: false,

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.isCommand() && !interaction.isContextMenuCommand()) {

            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return await interaction.reply({
                    content: `${client.emo.no} Cette commande n'existe plus.`,
                    ephemeral: true
                });
            };

            try { 
                await command.execute(client, interaction);
            } catch (err) { 
                console.log("Une erreur est survenue lors de du lancement de la commande: ", err);
            };
        };
    }
};
