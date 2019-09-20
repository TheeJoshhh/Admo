const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {


    const prefix = client.settings.get(message.guild.id, "prefix");
    const permissions = client.settings.get(message.guild.id, "modCommandPerms");
    const embed = new Discord.MessageEmbed();
    embed.setColor(client.settings.get(message.guild.id, "embedColour"))

    if (permissions.users.includes(message.author.id) || message.member.roles.find(role => permissions.roles.includes(role.id)) || message.member.hasPermission("ADMINISTRATOR")) {
        if (!args[0]) return message.channel.send(`Not enough input!\nIf you're not sure how to use this command run \`${prefix}help\``)
            if (args[0] === 'enable' || args[0] === 'on') {
                if (client.settings.get(message.guild.id, "autoModerator") === false) {
                    try {
                        client.settings.set(message.guild.id, true, "autoModerator");
                        embed.setTitle("Auto-Mod is now Enabled");
                        embed.setDescription(`To learn how to configure Auto-Mod run \`${prefix}help auto-mod\``);
                        return message.channel.send(embed)
                    } catch (e) {
                        console.log(e.stack)
                        return message.channel.send("An error has occured.");
                    }
                } else {
                    embed.setTitle("Auto-Mod is Enabled!");
                    embed.setDescription(`The Auto-Mod is already enabled!\nTo learn how to configure Auto-Mod run \`${prefix}help auto-mod\`\nTo disable automod run \`${prefix}auto-mod disable\``)
                    return message.channel.send(embed);
                }
            } else if (args[0] === 'disable' || args[0] === 'off') {
                if (client.settings.get(message.guild.id, "autoModerator") === true) {
                    try {
                        client.settings.set(message.guild.id, false, "autoModerator");
                        embed.setTitle("Auto-Mod is now Disabled");
                        embed.setDescription(`To learn how to configure Auto-Mod run \`${prefix}help auto-mod\``);
                        return message.channel.send(embed)
                    } catch (e) {
                        console.log(e.stack)
                        return message.channel.send("An error has occured.");
                    }
                } else {
                    embed.setTitle("Auto-Mod is Disabled!");
                    embed.setDescription(`The Auto-Mod is already disabled!\nTo learn how to configure Auto-Mod run \`${prefix}help auto-mod\`\nTo enable automod run \`${prefix}auto-mod disable\``)
                    return message.channel.send(embed);
                }
        }
    } 
    else {
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