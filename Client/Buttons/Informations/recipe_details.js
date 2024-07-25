const { Client, ButtonInteraction, EmbedBuilder } = require("discord.js");
const axios = require('axios');
const paginations = require("../../Functions/Gestions/paginations");

module.exports = {
    id: "recipe_details_",

    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {

        if (interaction.user.id !== interaction.message.interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'êtes pas l'auteur de cette commande.",
                ephemeral: true
            });
        };

        const response = await axios.request({
            method: 'GET',
            url: `https://all-in-one-recipe-api.p.rapidapi.com/details/${interaction.customId.split("_")[2]}`,
            headers: {
                'x-rapidapi-key': process.env.recipeAPI,
                'x-rapidapi-host': 'all-in-one-recipe-api.p.rapidapi.com'
            }
        });

        const recipe = response.data.recipe

        const embeds = [
            new EmbedBuilder()
                .setTitle(`Informations de la recette - ${recipe.data.Name}`)
                .setDescription(`> ${recipe.data.Description}\n\n**Informations du temps de la recette**\n${recipe.data.Time.map(time => `> \`${time}\``).join("\n")}\n\n**Informations des ingrédients**\n${recipe.data.Ingredients.map(ingredient => `> \`${ingredient}\``).join("\n")}`)
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL())
                .setColor("Blurple")
        ];

        for (let index = 0; index < recipe.data.Directions.length; index++) {
            const direction = recipe.data.Directions[index];
            embeds.push(
                new EmbedBuilder()
                    .setTitle(`Informations de la recette - ${recipe.data.Name}`)
                    .setDescription(`> - ${direction}`)
                    .setFooter({
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor("Blurple")
            );
        };

        return await paginations(interaction, embeds, 60 * 1000, true);
    }
};