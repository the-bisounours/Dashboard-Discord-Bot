const { Events, Client } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    name: Events.ClientReady,
    once: false,

    /**
     * 
     * @param {Client} client 
     */
    execute: async (client) => {
        client.emo = {};

        const emojisFolderPath = path.join(__dirname, "../../Emojis");
        const emojiFiles = fs.readdirSync(emojisFolderPath);
        let successCount = 0;

        for (const emojiFile of emojiFiles) {
            const emojiName = path.parse(emojiFile).name;
            const emojiPath = path.join(emojisFolderPath, emojiFile);

            const imageData = fs.readFileSync(emojiPath).toString('base64');

            try {
                await axios.post(
                    `https://discord.com/api/v10/applications/${client.user.id}/emojis`,
                    {
                        name: emojiName,
                        image: `data:image/png;base64,${imageData}`
                    },
                    {
                        headers: {
                            'Authorization': `Bot ${process.env.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } catch (error) {};
        };

        try {
            const response = await axios.get(
                `https://discord.com/api/v10/applications/${client.user.id}/emojis`,
                {
                    headers: {
                        'Authorization': `Bot ${process.env.token}`
                    }
                }
            );

            const emojis = response.data;
            for (const emoji of emojis.items) {
                client.emo[emoji.name] = `<:${emoji.name}:${emoji.id}>`;
                successCount++;
            };

            console.log(`${successCount} émojis ont été chargés avec succès.`);
        } catch (error) {
            console.log(error)
        };
    }
};