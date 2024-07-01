const { model, Schema } = require("mongoose");

const scheduleSchema = new Schema({
    userId: {
        type: String,
        default: ""
    },
    channelId: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    remindAt: {
        type: Date,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}).indexes({ userId: 1 });

module.exports = model("Schedule", scheduleSchema);