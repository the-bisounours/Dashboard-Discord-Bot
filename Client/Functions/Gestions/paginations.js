const { ButtonInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } = require("discord.js");

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {[EmbedBuilder]} pages 
 * @param {Number} time 
 * @param {Boolean} editMessage 
 * @param {[[ButtonBuilder]]} buttons 
 */

module.exports = async (interaction, pages, time = 30 * 1000, editMessage, buttons = []) => {
    try {
        if (!interaction || !pages || pages.length === 0) throw new Error("Erreur de fonction (pagination).");

        if (!editMessage) {
            await interaction.deferReply();
        }

        if (pages.length === 1) {
            if (editMessage) {
                return await interaction.update({ content: "", embeds: pages, components: buttons.length > 0 ? [buttons[0]] : [], fetchReply: true });
            } else {
                return await interaction.editReply({ content: "", embeds: pages, components: buttons.length > 0 ? [buttons[0]] : [], fetchReply: true });
            }
        }

        let index = 0;

        const updateButtons = (index) => {
            const navButtons = [
                new ButtonBuilder()
                    .setCustomId("pagefirst")
                    .setEmoji("⏪")
                    .setLabel("First")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(index === 0),

                new ButtonBuilder()
                    .setCustomId("pageprev")
                    .setEmoji("◀️")
                    .setLabel("Previous")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(index === 0),

                new ButtonBuilder()
                    .setCustomId("pagecount")
                    .setLabel(`${index + 1}/${pages.length}`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId("pagenext")
                    .setEmoji("▶️")
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(index === pages.length - 1),

                new ButtonBuilder()
                    .setCustomId("pagelast")
                    .setEmoji("⏩")
                    .setLabel("Last")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(index === pages.length - 1)
            ];

            return new ActionRowBuilder().addComponents(navButtons);
        };

        const createMessage = async (edit = false) => {
            const method = edit ? 'update' : 'editReply';
            return await interaction[method]({
                content: "",
                embeds: [pages[index]],
                components: [updateButtons(index), ...(buttons[index] ? [buttons[index]] : [])],
                fetchReply: true
            });
        };

        const msg = await createMessage(editMessage);

        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: time
        });

        collector.on("collect", async i => {
            if (i.user.id !== interaction.user.id) {
                return await i.reply({
                    content: `Cette interaction n'est pas à vous.`,
                    ephemeral: true
                });
            }

            await i.deferUpdate();

            switch (i.customId) {
                case "pagefirst":
                    index = 0;
                    break;
                case "pageprev":
                    if (index > 0) index--;
                    break;
                case "pagenext":
                    if (index < pages.length - 1) index++;
                    break;
                case "pagelast":
                    index = pages.length - 1;
                    break;
            }

            await msg.edit({
                content: "",
                embeds: [pages[index]],
                components: [updateButtons(index), ...(buttons[index] ? [buttons[index]] : [])]
            }).catch(err => console.log(err));

            collector.resetTimer();
        });

        collector.on("end", async () => {
            await msg.edit({
                content: "",
                embeds: [pages[index]],
                components: []
            }).catch(err => console.log(err));
        });

        return msg;

    } catch (e) {
        console.log(e);
    }
};