const { model, Schema } = require("mongoose");

const guildSchema = new Schema({
    guildId: {
        type: String,
        default: ""
    },
    invites: {
        joinChannel: {
            type: String,
            default: ""
        },
        joinMessage: {
            normal: {
                type: String,
                default: "**{memberMention}** vient de rejoindre. Il a été invité par **{inviterName}** qui a maintenant **{inviteCount} invites** !"
            },
            self: {
                type: String,
                default: "**{memberName}** s'est invité."
            },
            unknown: {
                type: String,
                default: "**{memberName}** viens de rejoindre mais je n'arrive pas à savoir qui l'a invité. Assurez-vous d’éviter les invitations à usage unique et le bouton d’invitation rapide."
            },
            vanity: {
                type: String,
                default: "**{memberName}** est arrivé en utilisant l'invitation personnalisée **{inviteCode}**."
            }
        },
        leaveChannel: {
            type: String,
            default: ""
        },
        leaveMessage: {
            normal: {
                type: String,
                default: "**{memberName}** est parti. Il a été invité par **{inviterName}**."
            },
            unknown: {
                type: String,
                default: "**{memberName}** est parti mais je n'ai pas enregistré qui a invité."
            },
            vanity: {
                type: String,
                default: "**{memberName}** est parti. Il a été invité à l’aide d’une invitation personnalisée."
            }
        },
        message: {
            type: String,
            default: "💡 Saviez-vous que vous pouvez ajouter votre propre message personnalisé ici. Obtenez plus d’informations avec la commande \`/sources-setmessage\`."
        },
        ranks: {
            type: Array,
            default: []
        },
        fake: {
            enabled: {
                type: Boolean,
                default: true
            },
            obligation: {
                type: Array,
                default: [1, 2]
            }
        }
    },
    tickets: {
        settings: {
            autoclose: {
                type: Boolean,
                default: false
            },
            support: {
                type: String,
                default: ""
            },
            openedTicketPerUser: {
                type: Number,
                default: 1
            }
        },
        panels: {
            type: [{
                panelId: String,
                channelId: String,
                categoryId: String,
                roles: Array,
                name: String,
                buttons: Object
            }],
            default: []
        }
    }
});

guildSchema.indexes({ guildId: 1 });
module.exports = model("Guilds", guildSchema);