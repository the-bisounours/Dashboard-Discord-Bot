const { SlashCommandBuilder, Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rps")
        .setDescription("Permet jouer au rock, paper, scissors.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addUserOption(option => option
            .setName("opponent")
            .setDescription("Sélectionnez votre adversaire.")
            .setRequired(false)
        ),

    category: "Jeux",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.user;
        const opponent = interaction.options.getUser("opponent") || client.user;

        const choices = ["rock", "paper", "scissors"];

        const randomChoice = (array) => array[Math.floor(Math.random() * array.length)];

        const determineWinner = (userChoice, opponentChoice) => {
            if (userChoice === opponentChoice) {
                return "C'est une égalité!";
            } else if (
                (userChoice === "rock" && opponentChoice === "scissors") ||
                (userChoice === "paper" && opponentChoice === "rock") ||
                (userChoice === "scissors" && opponentChoice === "paper")
            ) {
                return `\`${user.displayName}\` a gagné!`;
            } else {
                return `${opponent || "L\'adversaire"} a gagné!`;
            };
        };

        const userChoice = randomChoice(choices);

        let opponentChoice;
        if (opponent) {
            opponentChoice = randomChoice(choices);
        } else {
            opponentChoice = randomChoice(choices);
        };

        const result = determineWinner(userChoice, opponentChoice);

        await interaction.reply({ 
            embeds: [
                new EmbedBuilder()
                .setColor("Blurple")
                .setTitle("Rock, Paper, Scissors")
                .setDescription(`\`${user.displayName}\` a choisi \`${userChoice}\`\n${opponent ? `\`${opponent.displayName}\` a choisi \`${opponentChoice}\`\n` : ""}${result}`)
            ]
        });
    }
};