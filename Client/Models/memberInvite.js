const { model, Schema } = require("mongoose");

const inviteSchema = new Schema({
    memberId: {
        type: String,
        default: ""
    },
    inviterId: {
        type: String,
        default: ""
    },
    guildId: {
        type: String,
        default: ""
    }
}).indexes({ guildId: 1 });

module.exports = model("memberInvite", inviteSchema);