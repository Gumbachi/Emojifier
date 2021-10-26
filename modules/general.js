const { SlashCommandBuilder } = require('@discordjs/builders');

const howdy = {
    data: new SlashCommandBuilder()
        .setName('howdy')
        .setDescription('You\'ve got a friend in me.'),
    async execute(interaction) {
        await interaction.reply(`Howdy, ${interaction.member}`);
    }
};

const ready = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

module.exports = {
    commands: [howdy],
    events: [ready]
};