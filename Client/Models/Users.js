const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: String,
        default: ""
    }
});

userSchema.indexes({ userId: 1 });
module.exports = model("Users", userSchema);