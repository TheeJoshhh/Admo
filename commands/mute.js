const Discord = require("discord.js");
const ms = require("ms")
module.exports.run = (client, message, args) => {
    
    const prefix = client.settings.get(message.guild.id, "prefix");
    let reason = 'No Reason Provided';
    let time = 0;
    let embed = new Discord.MessageEmbed();
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
    }

    if (!args[1]) {
        embed.setTitle("Error: Missing Parameters");
        embed.setDescription(`You must provide the amount of time you want to mute the user for, additionally if you want the reason to be logged in the logs channel you can add a reason on the end.\nFor Example:\n\`${prefix}mute @Joshhh 30m Spamming Chat\``);
        return message.channel.send(embed);
    }

    if (args[2]) {
        reason = args.join(" ").slice(args[0].length + args[1].length + 2);
    }

    const muteRole = client.settings.get(message.guild.id, "muteRole");

    if (!muteRole || muteRole === '') {
        embed.setTitle("Error: No Mute Role");
        embed.setDescription(`There is no mute role configured in this server.\nTo configure your mute role, please run the command: \`${prefix}setup mute\`\nOr if you haven't done any of the setup yet just run \`${prefix}setup\` and you will be helped through setting up the bot in your server!`);
        return message.channel.send(embed);
    } else {
        if (!message.guild.roles.find(role => role.id === muteRole)) {
            embed.setTitle("Error: No Mute Role");
            embed.setDescription(`The mute role previously configured in this server can no longer be found.\nTo reconfigure your mute role, please run the command: \`${prefix}setup mute\``);
            return message.channel.send(embed);
        } else {
            const muteMember = message.mentions.members.first() || message.guild.members.find(member => member.id === args[0]) || message.guild.members.find(member => member.displayName.toLowerCase() === args[0].toLowerCase() || member.user.username.toLowerCase() === args[0].toLowerCase());
            const muteRoleReal = message.guild.roles.get(muteRole)
            if (!muteMember) {
                embed.setTitle("Error: Member Not Found");
                embed.setDescription(`No members by the name of \`${args[0]}\` were found in this server!`);
                return message.channel.send(embed);
            } else {
                if (client.guildUserData.get(`${message.guild.id}-${muteMember.user.id}`, "muted.enabled") === true) {
                    embed.setTitle("Error: User Already Muted")
                    embed.setDescription("Please wait until the user is no longer muted before muting them again.")
                    return message.channel.send(embed)
                }
                time = args[1]
                if (!ms(time)) {
                    embed.setTitle("Invalid Time Formatting")
                    embed.setDescription("You formatted the time wrong!\nThe time must be formatted as one word, eg NOT `10m 30s` instead do `10.5m`.\nYou can use m for minutes, h for hours and d for days.")
                    return message.channel.send(embed)
                }
                if (ms(time) < ms("1m") || ms(time) > ms("3 months")) {
                    embed.setTitle("Invalid amount of time!")
                    embed.setDescription("You cannot mute a user for less than 1 minute or more than a year. This is to prevent discord API spam and to reduce the chance of the bot not unmuting someone because it went offline or restarted during the users mute period.")
                    return message.channel.send(embed)
                }

                try {
                    if (muteRoleReal.editable){
                        muteMember.roles.add(muteRoleReal.id)
                    } else {
                        embed.setTitle("Error: Cannot give the mute role to that user!")
                        embed.setDescription("I can't give the mute role to that user most likely due to my permissions or position in the hierarchy. If you don't understand how to fix this, feel free to join the support server using the `*support` command!")
                        return message.channel.send(embed)
                    }
                } catch (e) {
                    embed.setTitle("Error: Cannot give the mute role to that user!")
                    embed.setDescription("I can't give the mute role to that user most likely due to my permissions or position in the hierarchy. If you don't understand how to fix this, feel free to join the support server using the `*support` command!")
                    return message.channel.send(embed)
                }

                embed.setTitle(`Member \`${muteMember.displayName}\` has been muted for \`${ms(ms(time), {long: true})}\` by \`${message.author.tag}\``)
                embed.setDescription(`Reason: \`${reason}\``)
                message.channel.send(embed)
                embed.setTitle(`You have been muted for \`${ms(ms(time), {long: true})}\` by \`${message.author.tag}\` in the server \`${message.guild.name}\``)

                muteMember.send(embed)

                client.functions.log(client, message.guild, `User \`${muteMember.user.tag}\` was muted by \`${message.author.tag}\``, `Reason: \`${reason}\``)
                client.guildUserData.set(`${message.guild.id}-${muteMember.user.id}`, true, "muted.enabled")
                client.guildUserData.set(`${message.guild.id}-${muteMember.user.id}`, Date.now() + ms(time), "muted.endTime")

                setTimeout(function(){
                    try {
                        if (muteRoleReal.editable) {
                            muteMember.roles.remove(muteRoleReal.id)
                            client.functions.log(client, message.guild, `User ${muteMember.user.tag}'s mute period is over`, `The user has automatically been unmuted.`)
                            muteMember.send(`You are no longer muted in the server \`${message.guild.name}\`.`)
                            client.guildUserData.set(`${message.guild.id}-${muteMember.user.id}`, false, "muted.enabled")
                            client.guildUserData.set(`${message.guild.id}-${muteMember.user.id}`, false, "muted.endTime")
                        } else {
                            return client.functions.log(client, message.guild, `Error: Cannot remove the mute role from \`${muteMember.user.tag}\`!`, `${muteMember.tag}'s mute is up but I can't remove the mute role from them, most likely due to my permissions or position in the hierarchy. If you don't understand how to fix this, feel free to join the support server using the \`*support\` command!`)
                        }
                    } catch (e) {
                        console.log(e)
                        return client.functions.log(client, message.guild, `Error: Cannot remove the mute role from \`${muteMember.user.tag}\`!`, `${muteMember.user.tag}'s mute is up but I can't remove the mute role from them, most likely due to my permissions or position in the hierarchy. If you don't understand how to fix this, feel free to join the support server using the \`*support\` command!`)
                    }
                }, ms(time));

            }
        }
    }

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
