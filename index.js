// Node Modules
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs")

// Create Client
const client = new Discord.Client();

// Bind some thinggys to client for global access to said thinggys
client.config = require('./config.json');
client.settings = new Enmap({name: "settings"});
client.guildUserData = new Enmap({name: "guildUserData"})
client.functions = require('./functions.js')
client.commands = new Discord.Collection();
global.antiSpamCache = {}

// Load Commands into cache
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const load = async () => {
    cmdFiles.forEach(file => {
        try {
            const f = require(`./commands/${file}`);
            client.commands.set(f.help.name, f);
        } catch (e) { 
            console.log(`Error in command ${file}`, e.stack);
        }
    });
};


// Load and bind events to event files in the event folder.
const evtFiles = fs.readdirSync("./events/").filter(file => file.endsWith('.js'));
evtFiles.forEach(file => {
    const evtName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(evtName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
})

process.on('unhandledRejection', console.log)

// Login to the bot user
client.login(client.config.token);

// Load the commands
load();