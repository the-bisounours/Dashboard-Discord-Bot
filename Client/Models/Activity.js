const { ActivityType } = require("discord.js");
const { model, Schema } = require("mongoose");

const activitySchema = new Schema({
    clientId: {
        type: String,
        default: ""
    },
    type: {
        type: Number,
        default: ActivityType.Listening
    },
    name: {
        type: String,
        default: "the_bisounours"
    },
    url: {
        type: String,
        default: "https://www.twitch.tv/thebisoubours"
    },
    status: {
        type: String,
        default: "online"
    }
}).indexes({ clientId: 1 });

module.exports = model("Activity", activitySchema);