const { SlashCommandBuilder, Client, ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const url = "https://all-in-one-recipe-api.p.rapidapi.com";
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recipe")
        .setDescription("Permet de s'informer d'une recette de cuisine.")
        .setDMPermission(true)
        .setDefaultMemberPermissions(null)
        .addSubcommand(sub => sub
            .setName("cuisine")
            .setDescription("Permet de s'informer d'une recette en fonction de la cuisine.")
            .addStringOption(option => option
                .setName("cuisine")
                .setDescription("Permet de mettre la cuisine.")
                .setAutocomplete(true)
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("categorie")
            .setDescription("Permet de s'informer d'une recette en fonction de la catégorie.")
            .addStringOption(option => option
                .setName("categorie")
                .setDescription("Permet de mettre la categorie.")
                .setAutocomplete(true)
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("search")
            .setDescription("Permet de s'informer d'une recette en fonction de la recherche.")
            .addStringOption(option => option
                .setName("search")
                .setDescription("Permet de mettre la recherche.")
                .setAutocomplete(false)
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("details")
            .setDescription("Permet de s'informer d'une recette en fonction de l'identifiant.")
            .addStringOption(option => option
                .setName("identifiant")
                .setDescription("Permet de mettre l'identifiant.")
                .setAutocomplete(false)
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName("random")
            .setDescription("Permet de s'informer d'une recette aléatoirement.")
        ),

    category: "Informations",

    /**
     * 
     * @param {Client} client 
     * @param {AutocompleteInteraction} interaction 
     */
    autocomplete: async (client, interaction) => {

        const focusedValue = interaction.options.getFocused();
        let options;
        let dataPath;

        switch (interaction.options.getSubcommand()) {
            case "cuisine":
                options = {
                    method: 'GET',
                    url: `${url}/cuisines`,
                    headers: {
                        'x-rapidapi-key': process.env.recipeAPI,
                        'x-rapidapi-host': 'all-in-one-recipe-api.p.rapidapi.com'
                    }
                };
                dataPath = "cuisines.data";
                break;
            case "categorie":
                options = {
                    method: 'GET',
                    url: `${url}/categories`,
                    headers: {
                        'x-rapidapi-key': process.env.recipeAPI,
                        'x-rapidapi-host': 'all-in-one-recipe-api.p.rapidapi.com'
                    }
                };
                dataPath = "categories.data";

                break;
            default:
                break;
        }

        try {
            const response = await axios.request(options);
            const data = dataPath.split('.').reduce((obj, key) => obj && obj[key], response.data);
            if (!data) return;

            const validChoices = data.filter(choice => choice !== null && choice !== undefined);
            const filtered = validChoices
                .filter(choice => choice.startsWith(focusedValue))
                .map(choice => choice.substring(0, 99))
                .slice(0, 25);

            const validLengthChoices = filtered.filter(choice => choice.length >= 1 && choice.length <= 99);
            await interaction.respond(validLengthChoices.map(choice => ({ name: choice, value: choice })));
        } catch (error) {
            await interaction.respond([{ name: error.response.data.message.slice(0, 99), value: error.response.data.message.slice(0, 99) }]);
        };
    },

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        try {
            switch (interaction.options.getSubcommand()) {
                case "cuisine":

                    const response = await axios.request({
                        method: 'GET',
                        url: `${url}/cuisines/${interaction.options.getString("cuisine")}`,
                        headers: {
                            'x-rapidapi-key': process.env.recipeAPI,
                            'x-rapidapi-host': 'all-in-one-recipe-api.p.rapidapi.com'
                        }
                    });

                    await interaction.reply({
                        content: `> **Identifiant:** \`${response.data.cuisines.data[1].id}\`\n> **Nom:** \`${response.data.cuisines.data[1].name}\``,
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`recipe_details_${response.data.cuisines.data[1].id}`)
                                        .setDisabled(false)
                                        .setEmoji("🍲")
                                        .setLabel("Voir les détails de la recette")
                                        .setStyle(ButtonStyle.Primary)
                                )
                        ]
                    });

                    break;
                case "categorie":

                    const response1 = await axios.request({
                        method: 'GET',
                        url: `${url}/categories/${interaction.options.getString("categorie")}`,
                        headers: {
                            'x-rapidapi-key': process.env.recipeAPI,
                            'x-rapidapi-host': 'all-in-one-recipe-api.p.rapidapi.com'
                        }
                    });

                    await interaction.reply({
                        content: `> **Identifiant:** \`${response1.data.categories.data[1].id}\`\n> **Nom:** \`${response1.data.categories.data[1].name}\``,
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`recipe_details_${response1.data.categories.data[1].id}`)
                                        .setDisabled(false)
                                        .setEmoji("🍲")
                                        .setLabel("Voir les détails de la recette")
                                        .setStyle(ButtonStyle.Primary)
                                )
                        ]
                    });
                    break;
                default:
                    break;
            }
        } catch (error) {
            const rateLimit = checkRateLimit(error.response);
            if (error.response.status === 429) {
                const resetTime = parseInt(rateLimit.reset, 10) * 1000;

                return await interaction.reply({
                    content: `:x: Vous avez utiliser les \`${rateLimit.limit - rateLimit.remaining}\`/\`${rateLimit.limit}\` requêtes, ils seront réinitialiser <t:${Math.round(new Date().setMilliseconds(resetTime + new Date().getMilliseconds()) / 1000)}:R>`,
                    ephemeral: true
                });
            } else {
                return await interaction.reply({
                    content: ":x: Une erreur s'est produite lors de la récupération de la recette. Veuillez réessayer plus tard.",
                    ephemeral: true
                });
            };
        };
    }
};

const checkRateLimit = (response) => {
    const rateLimit = {
        limit: response.headers['x-ratelimit-requests-limit'],
        remaining: response.headers['x-ratelimit-requests-remaining'],
        reset: response.headers['x-ratelimit-requests-reset']
    };

    return rateLimit;
};