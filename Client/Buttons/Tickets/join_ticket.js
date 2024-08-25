const { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    id: "join_ticket_",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const threadChannel = interaction.guild.channels.cache.get(interaction.customId.split("_")[2]);
        if(!threadChannel) {
            return await interaction.reply({
                content: `${client.emo.no} Le salon n'existe plus.`,
                ephemeral: true
            });
        };

        await threadChannel.members.add(interaction.user).catch(async err => {
            return await interaction.reply({
                content: `${client.emo.no} Je ne vous ai pas ajouter au ticket à cause d'une erreur.`,
                ephemeral: true
            });
        });

        return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Rejoindre le ticket")
                    .setColor("Blurple")
                    .setFooter({
                        text: "Fait par the_bisounours",
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription("Un ticket a été ouvert. Appuyez sur le bouton ci-dessous pour le rejoindre.")
                    .addFields(
                        {
                            name: "Ouvert par",
                            value: `${interaction.message.embeds[0].fields[0].value}`,
                            inline: true
                        },
                        {
                            name: "Panneau",
                            value: `${interaction.message.embeds[0].fields[1].value}`,
                            inline: true
                        },
                        {
                            name: "Staff en Ticket",
                            value: `\`${threadChannel.members.cache.filter(member => !member.user.bot && member.user.id !== interaction.message.embeds[0].fields[0].value.replace("<", "").replace("@", "").replace(">", "")).size}\``,
                            inline: true
                        }
                    )
            ]
        });
    }
};