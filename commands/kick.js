const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {

    let isMod = false;

    const kicker = message.member;

    kicker.roles.forEach(role => {
        if (client.settings.get(message.guild.id, "modCommandPerms.roles").includes(role.id)) {
            isMod = true
        }
    });

    if (client.settings.get(message.guild.id, "modCommandPerms.users").includes(message.author.id)) isMod = true

    if (isMod === true || message.member.hasPermission("ADMINISTRATOR")) {
        
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
            .setTitle("Error: You must provide a user to kick!")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("You can use either an @mention of a user or their ID\n\nUsage: `*kick [User] [Reason]`\nExample 1: `\*kick @Joshhh Spamming Chat`\nExample 2: `\*kick 176896182465986561 Spamming Chat`");
            return message.channel.send(embed);
        }

        const kickedMember = message.mentions.members.first() || message.guild.members.find(member => member.id === args[0]);

        if (!kickedMember) {
            const embed = new Discord.MessageEmbed()
            .setTitle("Error: Couldn't find that user!")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("You can use either an @mention of a user or their ID\n\nUsage: `*kick [User] [Reason]`\nExample 1: `\*kick @Joshhh Spamming Chat`\nExample 2: `\*kick 176896182465986561 Spamming Chat`");
            return message.channel.send(embed);
        }
    
        const reason = args.join(" ").slice(args[0].length + 1);

        if (reason.length > 1000) {
            const embed = new Discord.MessageEmbed()
            .setTitle("Error: Reason too long!")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("Your reason must be less than 1000 characters in length.");
            return message.channel.send(embed);
        }
    
        if (kickedMember.id === message.author.id) {
            const embed = new Discord.MessageEmbed()
            .setTitle("Error: You can't kick yourself!")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("Nice try, better luck next time~");
            return message.channel.send(embed);
        }
        
        if (!kickedMember.kickable) {
            const embed = new Discord.MessageEmbed()
            .setTitle("Error: Not enough permissions")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("Please make sure I have permissions to kick this user.");
            return message.channel.send(embed);    
        }

        if (!reason) {
            const embed = new Discord.MessageEmbed()
            .setTitle("Error: You must provide a reason!")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("You can use either an @mention of a user or their ID\n\nUsage: `*kick [User] [Reason]`\nExample 1: `\*kick @Joshhh Spamming Chat`\nExample 2: `\*kick 176896182465986561 Spamming Chat`");
            return message.channel.send(embed)
        }

        kickedMember.kick()
        const embed = new Discord.MessageEmbed()
        .setTitle(`${kickedMember.user.tag} was kicked.`)
        .setColor(client.settings.get(message.guild.id, "embedColour"))
        .addField("Reason", reason)
        .setFooter(`Kicked by ${message.author.tag}`, message.author.avatarURL())
        client.functions.log(client, message.guild, `${kickedMember.user.tag} was kicked.`, `Reason: \`${reason}\`\n\nKicked By: \`${message.author.tag}\``)
        message.channel.send(embed)
        embed.setTitle(`You were kicked from the guild \`${message.guild.name}\``)
        return kickedMember.send(embed)
            .catch(() => {
                return;
            });

    } else {
        const embed = new Discord.MessageEmbed()
        .setTitle("Error: You don't have enough permissions!")
        .setColor(client.settings.get(message.guild.id, "embedColour"))
        .setDescription("");
        return message.channel.send(embed)
    }



    }
    

    module.exports.help = {
        name: "kick",
        aliases: [],
        class: "moderation",
        usage: `*kick [User] [Reason]`,
        description: "Kick a user in a server.",
        status: "Working",
        guildOnly: true
    }
