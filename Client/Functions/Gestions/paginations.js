const { ButtonInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } = require("discord.js")

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {[EmbedBuilder]} pages 
 * @param {Number} time 
 * @param {Boolean} editMessage 
 */

module.exports = async (interaction, pages, time = 30 * 1000, editMessage) => {

    try {

        if (!interaction || !pages || !pages > 0) throw new Error("Erreur de fonction (pagination).");

        if(!editMessage) {
            await interaction.deferReply();
        };

        if (pages.length === 1) {
            if(editMessage) {
                return await interaction.update({ embeds: pages, components: [], fetchReply: true });
            } else {
                return await interaction.editReply({ embeds: pages, fetchReply: true });
            }
        };

        var index = 0;

        const first = new ButtonBuilder()
            .setCustomId("pagefirst")
            .setEmoji("⏪")
            .setLabel("First")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const prev = new ButtonBuilder()
            .setCustomId("pageprev")
            .setEmoji("◀️")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const pageCount = new ButtonBuilder()
            .setCustomId("pagecount")
            .setLabel(`1/${pages.length}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId("pagenext")
            .setEmoji("▶️")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)

        const last = new ButtonBuilder()
            .setCustomId("pagelast")
            .setEmoji("⏩")
            .setLabel("Last")
            .setStyle(ButtonStyle.Primary)

        const buttons = new ActionRowBuilder()
            .addComponents([first, prev, pageCount, next, last]);

        if(editMessage) {
            const msg = await interaction.update({
                embeds: [pages[index]],
                components: [buttons], 
                fetchReply: true
            });

            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: time
            });
    
            collector.on("collect", async i => {
    
                if(i.user.id !== interaction.user.id) {
                    return await i.reply({
                        content: `Cette interaction n'est pas a vous.`,
                        ephemeral: true
                    });
                };
    
                await i.deferUpdate();
                if(i.customId === "pagefirst") {
                    index = 0;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                };
    
                if(i.customId === "pageprev") {
                    if(index > 0) index--;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
    
                } else if(i.customId === "pagenext") {
                    if(index < pages.length - 1) {
                        index++;
                        pageCount.setLabel(`${index + 1}/${pages.length}`);
                    };
                } else if(i.customId === "pagelast") {
                    index = pages.length - 1;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                };
    
                if(index === 0) {
                    first.setDisabled(true);
                    prev.setDisabled(true);
                } else {
                    first.setDisabled(false);
                    prev.setDisabled(false);
                };
    
                if(index === pages.length - 1) {
                    next.setDisabled(true);
                    last.setDisabled(true);
                } else {
                    next.setDisabled(false);
                    last.setDisabled(false);
                };
    
                await msg.edit({
                    embeds: [pages[index]],
                    components: [buttons]
                }).catch(err => {});
    
                collector.resetTimer();
            });
    
            collector.on("end", async () => {
                await msg.edit({
                    embeds: [pages[index]],
                    components: []
                }).catch(err => {});
            });
    
            return msg;
        } else {
            const msg = await interaction.editReply({
                embeds: [pages[index]],
                components: [buttons], 
                fetchReply: true
            });

            const collector = msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: time
            });
    
            collector.on("collect", async i => {
    
                if(i.user.id !== interaction.user.id) {
                    return await i.reply({
                        content: `Cette interaction n'est pas a vous.`,
                        ephemeral: true
                    });
                };
    
                await i.deferUpdate();
                if(i.customId === "pagefirst") {
                    index = 0;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                };
    
                if(i.customId === "pageprev") {
                    if(index > 0) index--;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
    
                } else if(i.customId === "pagenext") {
                    if(index < pages.length - 1) {
                        index++;
                        pageCount.setLabel(`${index + 1}/${pages.length}`);
                    };
                } else if(i.customId === "pagelast") {
                    index = pages.length - 1;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                };
    
                if(index === 0) {
                    first.setDisabled(true);
                    prev.setDisabled(true);
                } else {
                    first.setDisabled(false);
                    prev.setDisabled(false);
                };
    
                if(index === pages.length - 1) {
                    next.setDisabled(true);
                    last.setDisabled(true);
                } else {
                    next.setDisabled(false);
                    last.setDisabled(false);
                };
    
                await msg.edit({
                    embeds: [pages[index]],
                    components: [buttons]
                }).catch(err => {});
    
                collector.resetTimer();
            });
    
            collector.on("end", async () => {
                await msg.edit({
                    embeds: [pages[index]],
                    components: []
                }).catch(err => {});
            });
    
            return msg;
        };

    } catch (e) {
        console.log(e);
    };
};