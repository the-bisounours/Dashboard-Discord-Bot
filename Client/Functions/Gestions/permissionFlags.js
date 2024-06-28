const { PermissionFlagsBits } = require("discord.js");

/**
 * 
 * @param {PermissionFlagsBits} permission 
 * @returns {String}
 */
module.exports = permission => {

    switch (permission) {
        case PermissionFlagsBits.AddReactions.toString():
            return "Ajouter des réactions";
        break;
        case PermissionFlagsBits.Administrator.toString():
            return "Administrateur";
        break;
        case PermissionFlagsBits.AttachFiles.toString():
            return "Attacher des fichiers";
        break;
        case PermissionFlagsBits.BanMembers.toString():
            return "Bannir des membres";
        break;
        case PermissionFlagsBits.ChangeNickname.toString():
            return "Changer le pseudonyme";
        break;
        case PermissionFlagsBits.Connect.toString():
            return "Se connecter";
        break;
        case PermissionFlagsBits.CreateEvents.toString():
            return "Créer des événements";
        break;
        case PermissionFlagsBits.CreateGuildExpressions.toString():
            return "Créer des expressions de guilde";
        break;
        case PermissionFlagsBits.CreateInstantInvite.toString():
            return "Créer une invitation instantanée";
        break;
        case PermissionFlagsBits.CreatePrivateThreads.toString():
            return "Créer des threads privés";
        break;
        case PermissionFlagsBits.CreatePublicThreads.toString():
            return "Créer des threads publics";
        break;
        case PermissionFlagsBits.DeafenMembers.toString():
            return "Rendre sourd les membres";
        break;
        case PermissionFlagsBits.EmbedLinks.toString():
            return "Intégrer des liens";
        break;
        case PermissionFlagsBits.KickMembers.toString():
            return "Expulser des membres";
        break;
        case PermissionFlagsBits.ManageChannels.toString():
            return "Gérer les canaux";
        break;
        case PermissionFlagsBits.ManageEvents.toString():
            return "Gérer les événements";
        break;
        case PermissionFlagsBits.ManageGuild.toString():
            return "Gérer la guilde";
        break;
        case PermissionFlagsBits.ManageGuildExpressions.toString():
            return "Gérer les expressions de guilde";
        break;
        case PermissionFlagsBits.ManageMessages.toString():
            return "Gérer les messages";
        break;
        case PermissionFlagsBits.ManageNicknames.toString():
            return "Gérer les pseudonymes";
        break;
        case PermissionFlagsBits.ManageRoles.toString():
            return "Gérer les rôles";
        break;
        case PermissionFlagsBits.ManageThreads.toString():
            return "Gérer les threads";
        break;
        case PermissionFlagsBits.ManageWebhooks.toString():
            return "Gérer les webhooks";
        break;
        case PermissionFlagsBits.MentionEveryone.toString():
            return "Mentionner @everyone";
        break;
        case PermissionFlagsBits.ModerateMembers.toString():
            return "Modérer les membres";
        break;
        case PermissionFlagsBits.MoveMembers.toString():
            return "Déplacer des membres";
        break;
        case PermissionFlagsBits.MuteMembers.toString():
            return "Muter les membres";
        break;
        case PermissionFlagsBits.PrioritySpeaker.toString():
            return "Orateur prioritaire";
        break;
        case PermissionFlagsBits.ReadMessageHistory.toString():
            return "Lire l'historique des messages";
        break;
        case PermissionFlagsBits.RequestToSpeak.toString():
            return "Demander à parler";
        break;
        case PermissionFlagsBits.SendMessages.toString():
            return "Envoyer des messages";
        break;
        case PermissionFlagsBits.SendMessagesInThreads.toString():
            return "Envoyer des messages dans les threads";
        break;
        case PermissionFlagsBits.SendPolls.toString():
            return "Envoyer des sondages";
        break;
        case PermissionFlagsBits.SendTTSMessages.toString():
            return "Envoyer des messages TTS";
        break;
        case PermissionFlagsBits.SendVoiceMessages.toString():
            return "Envoyer des messages vocaux";
        break;
        case PermissionFlagsBits.Speak.toString():
            return "Parler";
        break;
        case PermissionFlagsBits.Stream.toString():
            return "Diffuser";
        break;
        case PermissionFlagsBits.UseApplicationCommands.toString():
            return "Utiliser les commandes d'application";
            break;
        case PermissionFlagsBits.UseEmbeddedActivities.toString():
            return "Utiliser les activités intégrées";
        break;
        case PermissionFlagsBits.UseExternalEmojis.toString():
            return "Utiliser des emojis externes";
        break;
        case PermissionFlagsBits.UseExternalSounds.toString():
            return "Utiliser des sons externes";
        break;
        case PermissionFlagsBits.UseVAD.toString():
            return "Utiliser le VAD (détection de voix)";
        break;
        case PermissionFlagsBits.ViewAuditLog.toString():
            return "Voir le journal d'audit";
            break;
        case PermissionFlagsBits.ViewChannel.toString():
            return "Voir le canal";
        break;
        case PermissionFlagsBits.ViewCreatorMonetizationAnalytics.toString():
            return "Voir les analyses de monétisation du créateur";
        break;
        case PermissionFlagsBits.ViewGuildInsights.toString():
            return "Voir les statistiques de guilde";
        break;
        default:
        return 'Inconnu';
        break;
    };
};