const { Client, ModalSubmitInteraction, EmbedBuilder } = require("discord.js");
const activity = require("../../Functions/Gestions/activity");

module.exports = {
    id: "configDescription",

    /**
     * 
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
                ephemeral: true
            });
        };
        
        const description = interaction.fields.getTextInputValue("description");

        return await client.application.edit({
            description: description
        })
            .then(async clientInfo => {

                await interaction.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Informations du robot")
                            .setThumbnail(clientInfo.client.user.displayAvatarURL())
                            .setColor("Blurple")
                            .setFooter({
                                text: clientInfo.client.user.displayName,
                                iconURL: clientInfo.client.user.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setDescription(`> **Nom:** \`${clientInfo.client.user.username}\`\n> **Description:** \`${clientInfo.client.application.description ? clientInfo.client.application.description : "Aucune"}\`\n> **Avatar:** ${clientInfo.client.user.avatar ? `[\`clique ici\`](${clientInfo.client.user.displayAvatarURL()})` : "\`Aucun\`"}\n> **Bannière:** ${clientInfo.client.user.banner ? `[\`clique ici\`](${clientInfo.client.user.bannerURL()})` : "\`Aucune\`"}\n> **Satus:** \`${clientInfo.client.user.presence && clientInfo.client.user.presence.status ? clientInfo.client.user.presence.status : "Aucun"}\`\n> **Activité:** \`${clientInfo.client.user.presence && clientInfo.client.user.presence.activities.length > 0 ? `${activity(clientInfo.client.user.presence.activities[0].type)} ${clientInfo.client.user.presence.activities[0].name}` : "Aucune"}\``)
                    ]
                });

                return await interaction.reply({
                    content: `Le robot a changé de description: \`${clientInfo.client.application.description ? clientInfo.client.application.description : "Aucune"}\``,
                    ephemeral: true
                });
            })
            .catch(async err => {
                return await interaction.reply({
                    content: `Le robot n'a pas changé de description à cause d'une erreur.`,
                    ephemeral: true
                });
            });
    }
};