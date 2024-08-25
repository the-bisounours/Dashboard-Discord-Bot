const { Client, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Guilds } = require("../../Models");
const fakeMessage = require("../../Functions/Invites/fakeMessage");

module.exports = {
    id: "add_fake",

    /**
     * 
     * @param {Client} client 
     * @param {StringSelectMenuInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if(interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: `${client.emo.no} Vous n'êtes pas l'auteur de cette commande.`,
                ephemeral: true
            });
        };
        
        const data = await Guilds.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: `${client.emo.no} Impossible de trouver la base de donnée du serveur.`,
                ephemeral: true
            });
        };

        if (data.invites.fake.obligation.includes(interaction.values[0])) {
            return await interaction.reply({
                content: "L'obligation existe déjà.",
                ephemeral: true
            });
        };

        data.invites.fake.obligation = [...data.invites.fake.obligation, interaction.values[0]];
        await data.save();

        return await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Informations du système de fausse invite")
                    .setColor("Blurple")
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(`Voici vos besoins actuels :\n> - ${data.invites.fake.obligation.map(number => fakeMessage(number)).join("\n> - ")}\n(\`Le membre qui rejoint doit tous les remplir pour que l'invitation soit prise en compte.\`)\n\n💠 Ajouter une nouvelle exigence\n🗑️ Supprimer une exigence\n❌ Annuler`)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("add_fake")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.plus}`)
                            .setLabel("Ajouter")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("remove_fake")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.delete}`)
                            .setLabel("Supprimer")
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId("delete")
                            .setDisabled(false)
                            .setEmoji(`${client.emo.no}`)
                            .setLabel("Annuler")
                            .setStyle(ButtonStyle.Danger)
                    )
            ]
        });
    }
};