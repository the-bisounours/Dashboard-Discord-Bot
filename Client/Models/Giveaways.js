const { model, Schema } = require("mongoose");

const giveawaySchema = new Schema({
    guildId: {
        type: String,
        default: ""
    },
    messageId: {
        type: String,
        default: ""
    },
    channelId: {
        type: String,
        default: ""
    },
    pause: {
        type: Boolean,
        default: false
    },
    prize: {
        type: String,
        default: ""
    },
    endTime: {
        type: Date,
        default: Date.now()
    },
    participants: {
        type: [String],
        default: []
    },
    settings: {
        winners: {
            type: Number,
            default: 1
        },
        requiredGuild: {
            type: String,
            default: ""
        },
        inviteRequired: {
            type: Number,
            default: 0
        },
        bonus: {
            roles: {
                type: [String],
                default: []
            },
            users: {
                type: [String],
                default: []
            },
            number: {
                type: Number,
                default: 1
            }
        }
    }
});

giveawaySchema.indexes({ guildId: 1 });
module.exports = model("Giveaway", giveawaySchema);