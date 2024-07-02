const { model, Schema } = require("mongoose");

const ticketSchema = new Schema({
    ticketId: {
        type: String,
        default: ""
    },
    guildId: {
        type: String,
        default: ""
    },
    channelId: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    reason: {
        type: String,
        default: ""
    },
    claimed: {
        type: Boolean,
        default: false
    },
    claimedId: {
        type: String,
        default: ""
    },
    closed: {
        type: Boolean,
        default: false
    },
    closeReason: {
        type: String,
        default: ""
    }
});

ticketSchema.indexes({ guildId: 1 });
module.exports = model("Tickets", ticketSchema);