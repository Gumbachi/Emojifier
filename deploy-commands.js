const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

// load commands
const commands = [];
const moduleFiles = fs.readdirSync('./modules').filter(file => file.endsWith('.js'));
for (const file of moduleFiles) {
    const commandFile = require(`./modules/${file}`);
    commandFile.commands.forEach(command => {
        commands.push(command.data.toJSON());
    });
}

// Register commands
const rest = new REST({ version: '9' }).setToken(token);
(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();