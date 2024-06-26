const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: String,
        default: ""
    },
    invites: {
        join: {
            type: Number,
            default: 0
        },
        fake: {
            type: Number,
            default: 0
        },
        leave: {
            type: Number,
            default: 0
        },
        bonus: {
            type: Number,
            default: 0
        }
    }
});

userSchema.indexes({ userId: 1 });
module.exports = model("Users", userSchema);