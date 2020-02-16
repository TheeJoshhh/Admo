// Mute Settings parameters

/*

settings.time = Length of mute
settings.reason = Reason for mute
settings.channel = The channel ID of the channel the user was muted in.

*/

const Discord = require("discord.js");
const ms = require("ms")
module.exports.run = (client, message, args) => {
    
    const prefix = client.settings.get(message.guild.id, "prefix");
    let embed = new Discord.MessageEmbed();
    let settings = {};
    let member = '';
    embed.setColor(client.settings.get(message.guild.id, "embedColour"));

    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        embed.setTitle("Error: Missing Permissions");
        embed.setDescription("You must have the manage messages permission to complete this action.");
        return message.channel.send(embed);
    }

    if (!args[0]) {
        embed.setTitle("Error: Missing Parameters");
        embed.setDescription(`You must provide the ID, Username, Nickname or an @mention of the user you wish to mute and the amount of time you wish to mute them for, additionally if you want the reason to be logged in the logs channel you can add a reason on the end.\nFor Example:\n\`${prefix}mute @Joshhh 30m Spamming Chat\``);
        return message.channel.send(embed);
    } else {
        member = message.mentions.members.first() || message.guild.members.find(member => member.id === args[0]) || message.guild.members.find(member => member.displayName === args[0]);
    }


    if (!member) {
        embed.setTitle("Error: Member Not Found");
        embed.setDescription(`You must provide the ID, Username, Nickname or an @mention of the user you wish to mute.`);
        return message.channel.send(embed);
    }

    if (!args[1]) {
        embed.setTitle("Error: Missing Parameters");
        embed.setDescription(`You must provide the amount of time you want to mute the user for, additionally if you want the reason to be logged in the logs channel you can add a reason on the end.\nFor Example:\n\`${prefix}mute @Joshhh 30m Spamming Chat\``);
        return message.channel.send(embed);
    } else settings.time = ms(args[1])

    if (settings.time === undefined) {
        embed.setTitle("Error: Invalid Time Format");
        embed.setDescription(`You must provide a number in a valif format e.g 1m (1 minute), 3y (3 years) or 12d (12 days)\nFull Example:\`${prefix}mute @Joshhh 30m Spamming Chat\``);
        return message.channel.send(embed);
    }

    if (settings.time > 15552000000 || settings.time < 60000) {
        embed.setTitle("Error: Invalid Amount of Time");
        embed.setDescription(`You cannot mute a user for more than 180 days (about 6 months) or less than a minute.`);
        return message.channel.send(embed);
    }

    if (args[2]) {
        settings.reason = args.join(" ").slice(args[0].length + args[1].length + 2);
    } else settings.reason = 'No Reason Provided';

    const muteRole = client.settings.get(message.guild.id, "muteRole");

    if (!muteRole || muteRole === '') {
        embed.setTitle("Error: No Mute Role");
        embed.setDescription(`There is no mute role configured in this server.\nTo configure your mute role, please run the command: \`${prefix}setup mute\`\nOr if you haven't done any of the setup yet just run \`${prefix}setup\` and you will be helped through setting up the bot in your server!`);
        return message.channel.send(embed);
    }

    if (message.member.roles.has(muteRole)) {
        embed.setTitle("Error: User Already Muted");
        embed.setDescription(`The user you're trying to mute already has this servers designated mute role. \`${prefix}setup mute\` to re-configure the mute role / settings`);
        return message.channel.send(embed);
    }
     
    settings.channel = message.channel.id
    
    client.functions.mute(client, message.guild, member, message.member, settings)
    
}

  module.exports.help = {
        name: "mute",
        aliases: ['tempmute'],
        class: "moderation",
        usage: `*mute [User] [Time] [Reason]\nFor example \`*mute @Joshhh 30m Spamming Chat\``,
        description: "Mute a member in the server.",
        status: "Working",
        guildOnly: true
    }
