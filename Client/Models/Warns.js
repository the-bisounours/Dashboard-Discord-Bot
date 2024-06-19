const { model, Schema } = require("mongoose");

const warnSchema = new Schema({
    userId: {
        type: String,
        default: ""
    },
    guildId: {
        type: String,
        default: ""
    },
    warnId: {
        type: String,
        default: ""
    },
    raison: {
        type: String,
        default: ""
    },
    time: {
        type: Number,
        default: Date.now()
    },
    by: {
        type: String,
        default: ""
    },
    preuve: {
        type: String,
        default: ""
    }
});

warnSchema.indexes({ warnId: 1 });
module.exports = model("warns", warnSchema);