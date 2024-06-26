const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Users } = require("../../Models");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invites")
        .setDescription("Permet de regarder les invitations.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)
        .addUserOption(option => option
            .setName("membre")
            .setDescription("Permet de regarder les invitations du membre.")
            .setRequired(false)
        ),

    category: "Invites",

    /**
     * 
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute: async (client, interaction) => {

        const user = interaction.options.getUser("membre") ? interaction.options.getUser("membre") : interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return await interaction.reply({
                content: ":x: Je n'arrive pas a trouver le membre.",
                ephemeral: true
            });
        };

        const date = new Date();
        const data = await Users.findOne({
            userId: member.user.id,
            guildId: interaction.guild.id
        });

        if (!data) {
            return await interaction.reply({
                content: "Impossible de trouver la base de donnée de l'utilisateur.",
                ephemeral: true
            });
        };

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Informations des invites de ${member.user.displayName}`)
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription(`Votre nombre d'invitations a été généré en \`${new Date() - date}\`ms\n\n> ✅ \`${data.invites.join}\` joins\n> ❌ \`${data.invites.leave}\` leaves\n> 💩 \`${data.invites.fake}\` fake\n> ✨ \`${data.invites.bonus}\` bonus\n\nVous avez \`${data.invites.join + data.invites.bonus - data.invites.leave - data.invites.fake}\` invitations ! 👏\n\n💡 Saviez-vous que vous pouvez ajouter votre propre message personnalisé ici. Obtenez plus d’informations avec la commande \`/sources setmessage\`.`)
                .setFooter({
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp()
                .setColor("Blurple")
            ]
        });
    }
};