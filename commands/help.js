const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {

    const { commands } = message.client;
    const embed = new Discord.MessageEmbed()
    .setColor('82CAFA')
    .setFooter(`${client.user.username} | Build Version: ${client.config.version}`, client.user.avatarURL)

        if (!args[0]) {
            if (message.guild) {
            const fun = commands.filter(command => command.help.class === 'fun')
            const utility = commands.filter(command => command.help.class === 'utility')
            const disabled = commands.filter(command => command.help.class === 'disabled')
            const moderation = commands.filter(command => command.help.class === 'moderation')

            if (utility.size > 0) embed.addField("\> Utility", "`" + utility.map(command => command.help.name).join('`, `') + "`");
            if (moderation.size > 0) embed.addField("\> Moderation", "`" + moderation.map(command => command.help.name).join('`, `') + "`");
            if (fun.size > 0) embed.addField("\> Fun", "`" + fun.map(command => command.help.name).join('`, `') + "`");
            if (disabled.size > 0) embed.addField("\> Disabled", "`" + disabled.map(command => command.help.name).join('`, `') + "`");

            embed.setTitle("Help Menu")
            return message.channel.send(embed)
            
            } else {
            const fun = commands.filter(command => command.help.class === 'fun' && command.help.guildOnly === false)
            const utility = commands.filter(command => command.help.class === 'utility' && command.help.guildOnly === false)
            const disabled = commands.filter(command => command.help.class === 'disabled' && command.help.guildOnly === false)
            const moderation = commands.filter(command => command.help.class === 'moderation' && command.help.guildOnly === false)

            if (utility.size > 0) embed.addField("\> Utility", "`" + utility.map(command => command.help.name).join('`, `') + "`");
            if (moderation.size > 0) embed.addField("\> Moderation", "`" + moderation.map(command => command.help.name).join('`, `') + "`");
            if (fun.size > 0) embed.addField("\> Fun", "`" + fun.map(command => command.help.name).join('`, `') + "`");
            if (disabled.size > 0) embed.addField("\> Disabled", "`" + disabled.map(command => command.help.name).join('`, `') + "`");

            embed.setTitle("Help Menu")
            embed.setDescription(`You're currently seeing a shortened help menu as all the following commands are commands that will work in direct messages with the bot, to see all of the commands run \`${client.config.defaultPrefix}help --full\` or run the help command in a server.`)
            return message.channel.send(embed)
            }
        }

    if (args[0] === '--full') {
        const fun = commands.filter(command => command.help.class === 'fun')
        const utility = commands.filter(command => command.help.class === 'utility')
        const disabled = commands.filter(command => command.help.class === 'disabled')
        const moderation = commands.filter(command => command.help.class === 'moderation')

        if (utility.size > 0) embed.addField("\> Utility", "`" + utility.map(command => command.help.name).join('`, `') + "`");
        if (moderation.size > 0) embed.addField("\> Moderation", "`" + moderation.map(command => command.help.name).join('`, `') + "`");
        if (fun.size > 0) embed.addField("\> Fun", "`" + fun.map(command => command.help.name).join('`, `') + "`");
        if (disabled.size > 0) embed.addField("\> Disabled", "`" + disabled.map(command => command.help.name).join('`, `') + "`");

        embed.setTitle("Help Menu")
        return message.channel.send(embed)
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.help.aliases && c.help.aliases.includes(name));

    if (!command) {
        return message.channel.send(`Cannot find command "${name}"`);
    }

    embed.setTitle(command.help.name.charAt(0).toUpperCase() + command.help.name.slice(1) + ' command');
    if (command.help.description) embed.addField(`Description`, command.help.description);
    if (command.help.aliases.length > 0) embed.addField(`Aliases`, command.help.aliases.join(', '));
    if (command.help.class.length > 0) embed.addField(`Class`, command.help.class.charAt(0).toUpperCase() + command.help.class.slice(1));
    if (command.help.usage) embed.addField(`Usage`, command.help.usage);
    if (command.help.guildOnly) embed.addField(`Servers Only (Won't work in DM's)`, command.help.guildOnly)

    message.channel.send(embed);

    }

  module.exports.help = {
        name: "help",
        aliases: ['halp'],
        class: "utility",
        usage: `;help [Command]`,
        description: "Why are you even here.",
        guildOnly: false,
        status: "Working"
    }