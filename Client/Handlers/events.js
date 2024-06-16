const { Client } = require("discord.js");
const fs = require("fs");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    

    const loadEvents = async (dir) => {
        const events = fs.readdirSync(`./Client/Events/${dir}`).filter(file => file.endsWith(".js"));

        for (const file of events) {
            const event = require(`../Events/${dir}/${file}`);

            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            };
        };
    };

    for (const dir of fs.readdirSync("./Client/Events")) {
        await loadEvents(dir);
    };

    console.log("\x1b[32m", "Les évènements ont été mis en place avec succès !");
};