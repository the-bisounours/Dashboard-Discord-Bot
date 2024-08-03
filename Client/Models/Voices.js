const { model, Schema } = require("mongoose");

const VoiceSchema = new Schema({
    guildId: {
        type: String,
        default: ""
    },
    voiceId: {
        type: String,
        default: ""
    },
    waitingId: {
        type: String,
        default: ""
    },
    threadId: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        default: ""
    },
    trust: {
        type: Array,
        default: []
    },
    block: {
        type: Array,
        default: []
    }
});

VoiceSchema.indexes({ guildId: 1 });
module.exports = model("Voices", VoiceSchema);