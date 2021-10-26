const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// add commands attr to client
client.commands = new Collection();

// Command/Event Handler
const moduleFiles = fs.readdirSync('./modules').filter(file => file.endsWith('.js'));
moduleFiles.forEach(file => {
    const module = require(`./modules/${file}`);

    // Load Commands
    module.commands.forEach(command => {
        client.commands.set(command.data.name, command);
    });

    // Load events
    module.events.forEach(event => {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    });
});

// Command Executor
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);