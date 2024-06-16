const { REST, Routes, SlashCommandBuilder, Client, Events } = require("discord.js");
const fs = require("fs");

/**
 * 
 * @param {Client} client 
 */

module.exports = async (client) => {

    const loadItems = (path, collection) => {
        const categories = fs.readdirSync(path);
        categories.forEach(category => {

            const files = fs.readdirSync(`${path}/${category}`);
            files.forEach(file => {

                const item = require(`../${path.split('./Client/')[1]}/${category}/${file}`);
                if (item.id) collection.set(item.id, item);

                if (item.data && item.data.name) {

                    client.commands.set(item.data.name, item);
                    client.slashArray.push(item.data instanceof SlashCommandBuilder ? item.data.toJSON() : item.data);
                };
            });
        });
    };

    ['Buttons', 'Modals', 'Selects', 'Commands', 'Contexts'].forEach(type => {
        loadItems(`./Client/${type}`, client[type.toLowerCase()]);
    });

    const rest = new REST({ version: "10" }).setToken(process.env.token);

    client.on(Events.ClientReady, async () => {
        try {

            await rest.put(Routes.applicationCommands(client.user.id), { body: client.slashArray });
            console.log("\x1b[32m", "Les commandes slash ont été mises en place avec succès !");
    
        } catch (err) {
            console.error("\x1b[31m", "Erreur lors de la création des commandes Slash :", err);
        };
    });

    console.log("\x1b[34m", "\x1b[34mLes \x1b[31mboutons\x1b[37m\x1b[34m, les \x1b[31mmodales\x1b[37m\x1b[34m, les \x1b[31mselects\x1b[37m\x1b[34m, les \x1b[31mcommandes\x1b[37m \x1b[34met les \x1b[31mcontexts\x1b[37m \x1b[34mont bien été chargés avec succès!");
};