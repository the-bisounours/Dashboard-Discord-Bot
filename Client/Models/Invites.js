const { model, Schema } = require("mongoose");

const inviteSchema = new Schema({
    guildId: {
        type: String,
        default: ""
    },
    code: {
        type: String,
        default: ""
    },
    uses: { 
        type: Number, 
        default: 0 
    },
    inviterId: {
        type: String,
        default: ""
    }
});

inviteSchema.indexes({ guildId: 1 });
module.exports = model("Invite", inviteSchema);