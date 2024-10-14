const { model, Schema } = require("mongoose");

const backupschema = new Schema({
    userId: {
        type: String,
        default: ""
    },
    backupData: {
        type: Object,
        default: {}
    }
});

backupschema.indexes({ userId: 1 });
module.exports = model("Backups", backupschema);