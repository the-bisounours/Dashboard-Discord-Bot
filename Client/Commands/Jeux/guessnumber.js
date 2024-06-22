const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("guessnumber")
        .setDescription("Permet jouer a guessnumber.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null),

    category: "Jeux",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const secretNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 5; 
        let message = ""; 

        const handleGuess = async (guess) => {
            const userNumber = parseInt(guess);

            if (isNaN(userNumber)) {
                return await interaction.reply("Veuillez entrer un nombre valide.");
            };

            attempts--;

            if (userNumber === secretNumber) {
                message = `Félicitations ! Vous avez deviné le nombre \`${secretNumber}\` correctement ! 🎉`;
            } else if (userNumber < secretNumber) {
                message = `Le nombre que vous avez deviné est trop bas. Essayez encore! (\`${attempts}\` essais restants)`;
            } else {
                message = `Le nombre que vous avez deviné est trop élevé. Essayez encore! (\`${attempts}\` essais restants)`;
            };

            if (attempts > 0 && userNumber !== secretNumber) {
                await interaction.editReply(message);
            } else {
                if (userNumber !== secretNumber) {
                    message = `Désolé, vous avez épuisé tous vos essais. Le nombre secret était \`${secretNumber}\`.`;
                }
                await interaction.editReply(message);
            };
        };

        await interaction.reply("Devinez le nombre entre \`1\` et \`100\`.");

        const collector = interaction.channel.createMessageCollector({
            filter: (msg) => msg.author.id === interaction.user.id,
            time: 60000 
        });

        collector.on("collect", async (msg) => {
            await handleGuess(msg.content);
        });

        collector.on("end", async () => {
            if (attempts > 0) {
                return await interaction.followUp("Le jeu a expiré. Utilisez la commande à nouveau pour jouer.");
            };
        });
    }
};