const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {

    const prefix = client.settings.get(message.guild.id, "prefix");
    const permissions = client.settings.get(message.guild.id, "modCommandPerms");
    const antiswearEnabled = client.settings.get(message.guild.id, "antiswear.enabled")
    const swearWords = client.settings.get(message.guild.id, "swearwords")
    const embed = new Discord.MessageEmbed();
    let wordArray = [];
    swearWords.forEach(word => {
        wordArray.push(word.word)    
    });

    embed.setColor(client.settings.get(message.guild.id, "embedColour"))

    if (permissions.users.includes(message.author.id) || message.member.roles.find(role => permissions.roles.includes(role.id)) || message.member.hasPermission("ADMINISTRATOR")) {
        if (!args[0]) return message.channel.send(`Not enough input!\nIf you're not sure how to use this command run \`${prefix}help\``)
            
        if (args[0] === 'anti-swear' || args[0] === 'antiswear') { // ANTI-SWEAR
            if (args[1] === 'enable' || args[1] === 'on') { // Enable Anti-Swear
                if (antiswearEnabled !== true) { // Anti-Swear is currently not enabled
                    client.settings.set(message.guild.id, true, "antiswear.enabled")
                    embed.setTitle("Anti-Swear is now Enabled");
                    embed.setDescription(`To learn how to configure Anti-Swear run \`${prefix}help anti-swear\``);
                    return message.channel.send(embed)
                } else { // Anti-Swear is already enabled
                    embed.setTitle("Anti-Swear is already Enabled!");
                    embed.setDescription(`To learn how to configure Anti-Swear run \`${prefix}help anti-swear\``);
                    return message.channel.send(embed)
                }
            } else if (args[1] === 'disable' || args[1] === 'off') { // Disable Anti-Swear
                if (antiswearEnabled !== false) { // Anti-Swear is currently not enabled
                    client.settings.set(message.guild.id, false, "antiswear.enabled")
                    embed.setTitle("Anti-Swear is now Disabled");
                    embed.setDescription(`To learn how to configure Anti-Swear run \`${prefix}help anti-swear\``);
                    return message.channel.send(embed)
                } else { // Anti-Swear is already disabled
                    embed.setTitle("Anti-Swear is already Disabled!");
                    embed.setDescription(`To learn how to configure Anti-Swear run \`${prefix}help anti-swear\``);
                    return message.channel.send(embed)
                }
            } else if (args[1] === 'add' || args[1] === 'addword' || args[1] === 'ban') { // Add swear word
                if (!args[2]) {
                    embed.setTitle("Missing Parameters!")
                    embed.setDescription("You must provide a word to ban!")
                    return message.channel.send(embed)
                } else if (wordArray.includes(args[2])) {
                    embed.setTitle("Invalid Word!")
                    embed.setDescription("That word is already banned!")
                    return message.channel.send(embed);
                } else if (args[2].length > 20 || args[2].length < 2) {
                        embed.setTitle("You cannot ban a word of that size!")
                        embed.setDescription("You cannot ban a word longer than 20 characters or less than 2 sorry.\nIf you're trying to ban a link try the automod link banner!")
                        return message.channel.send(embed);
                } else {
                    if (!args[3]) {
                        client.settings.push(message.guild.id, {word: args[2].toLowerCase(), aliasWords: [], punishment: "default", punishmentSettings: "default"}, "swearwords")
                        embed.setTitle("The word is now banned!")
                        embed.addField("Punishment", `No punishment supplied so defaulting to guilds default(${client.settings.get(message.guild.id, "antiswear.defaultPunishment")})`)
                        embed.setDescription(`To check the correct word has been banned or just to get a list of banned words run \`${prefix}automod antiswear list\``)
                        return message.channel.send(embed)
                    } else {
                        if (args[3].toLowerCase() === 'warning') {
                            if (!args[4]) {
                                embed.setTitle("The word is now banned")
                            } else {

                            }
                        } else if (args[3].toLowerCase() === 'default') {
                            client.settings.push(message.guild.id, {name: args[2].toLowerCase(), aliases: [], punishment: "default", punishmentSettings: "default"}, "swearwords")
                            embed.setTitle("The word is now banned!")
                            embed.addField("Punishment", `Guilds default(${client.settings.get(message.guild.id, "antiswear.defaultPunishment")})`)
                            embed.setDescription(`To check the correct word has been banned or just to get a list of banned words run \`${prefix}automod antiswear list\` in an NSFW channel.`)
                            return message.channel.send(embed)
                        } else if (args[3].toLowerCase() === "mute") {
                            
                        } else if (args[3].toLowerCase() === "kick") {

                        } else if (args[3].toLowerCase() === "ban") {

                        } else if (args[3].toLowerCase === "nothing") {

                        } else {
                            embed.setTitle(`Invalid Punishment "${args[3]}"`)
                            embed.setDescription(`Valid punishments are warning, kick, mute, nothing, ban, or leaving the punishment blank or as "default" will default the punishment to the guilds default punishment.`)
                            return message.channel.send(embed);
                        }
                    }
                } 
            } else if (args[1] === 'remove' || args[1] === 'removeword' || args[1] === 'unban') { // Remove swear word
                if (!args[2]) {
                    embed.setTitle("Missing Parameters!")
                    embed.setDescription("You must provide a word to unban!")
                    return message.channel.send(embed)
                }
                if (wordArray.includes(args[2])) {
                    let swearNum = 0;
                    wordArray.forEach(word => {
                        if (word === args[2].toLowerCase()) {
                            let newSwearArray = client.settings.get(message.guild.id, "swearwords")
                            newSwearArray.splice(swearNum)
                            client.settings.set(message.guild.id, newSwearArray, "swearwords")
                        } 
                        swearNum ++;
                    });
                } else {
                    embed.setTitle("There isn't a swearword recorded with that name!")
                    embed.setDescription(`For a list of swearwords in this guild run \`${prefix}automod antiswear list\``)
                    return message.channel.send(embed);
                }
            } else if (args[1] === 'exempt') { // Exempt channel, user or role from anti-swear

            } else if (args[1] === 'list' || args[1] === 'status') {
                    embed.setTitle(`Anti-Swear info for guild ${message.guild.name}`)
                    embed.addField("Anti-Swear Status", antiswearEnabled, true)
                    if (swearWords[0]) {
                        embed.addField("Swearwords (May Contain Explicit Content)", "||" + wordArray.join("||, ||") + "||")
                    } else {
                        embed.addField("Swearwords", "There are no banned words in this guild at this time.")
                    }
                    return message.channel.send(embed)
            } else {
                return message.channel.send("Unknown Command")
            }
        }
    } 
    else { // If user doesn't have enough perms
        const embed = new Discord.MessageEmbed()
        .setTitle("Not Enough Permissions")
        .setDescription(`Only moderators have access to this command.\nModerators are anyone with the Administrator Permission.\nUsers with the Administrator Permission can also give specific roles and users Moderator permissions on the bot.\nTo learn how to add moderators, run \`${prefix}help moderators\``)
        embed.addField("Moderator Roles", "WIP")
        embed.addField("Moderator Users", "WIP")
        return message.channel.send(embed);
        }   



    }

  module.exports.help = {
        name: "automod",
        aliases: ['auto-mod', 'automoderator', 'auto-moderator', 'auto-moderation', 'automoderation'],
        class: "utility",
        usage: `To-Do`,
        description: "Configure all Auto-Mod settings.",
        guildOnly: true,
        status: "Working"
    }