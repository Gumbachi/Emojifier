const { SlashCommandBuilder } = require('@discordjs/builders');
const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');

async function resizeImage(buffer, size = 240) {
    const image = await Canvas.loadImage(buffer);
    const aspectRatio = image.width / image.height; // 0.xx for vertical 1.xx

    // normalize dimensions while maintaining aspect ratio
    const width = (aspectRatio >= 1) ? size : Math.floor(size / aspectRatio);
    const height = (aspectRatio >= 1) ? Math.floor(size / aspectRatio) : size;

    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toBuffer();
}

const emojify = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Converts a provided image into an emoji')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The id of the message containing the image')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the emoji')),
    async execute(interaction) {
        const messageId = interaction.options.getString('id');
        const message = await interaction.channel.messages.fetch(messageId);
        const file = message.attachments.first();
        const name = interaction.options.getString('name') || file.name.split('.')[0];

        if (file.size <= 256000) {
            const emoji = await interaction.guild.emojis.create(file.attachment, name);
            return await interaction.reply(`Finished - ${emoji}`);
        }

        const fixedImage = await resizeImage(file.attachment, 240);
        const emoji = await interaction.guild.emojis.create(fixedImage, name);
        await interaction.reply(`Finished - ${emoji}`);
    }
}

module.exports = {
    commands: [emojify],
    events: []
};