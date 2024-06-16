const { model, Schema } = require("mongoose");

const guildSchema = new Schema({
    guildId: {
        type: String,
        default: ""
    }
});

guildSchema.indexes({ guildId: 1 });
module.exports = model("Guilds", guildSchema);