const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {

    const guild = message.guild
    
    const permissions = client.settings.get(guild.id, "modCommandPerms")

    if (permissions.users.includes(message.author.id) || message.member.roles.find(role => permissions.roles.includes(role.id)) || message.member.hasPermission("ADMINISTRATOR")) {return message.channel.send("OK")} 
    else {
        const embed = new Discord.MessageEmbed()
        .setTitle("Not Enough Permissions")
        .setDescription(`Only moderators have access to this command.\nModerators are anyone with the Administrator Permission.\nUsers with the Administrator Permission can also give specific roles and users Moderator permissions on the bot.\nTo learn how to add moderators, run \`${client.settings.get(guild.id, "prefix")}help\``)
        let modRoles = []
        permissions.roles.forEach(role => {
            if (guild.roles.find(roles => roles.id === role)) {
                modRoles.push(guild.roles.find(roles => roles.id === role))
            } else {
                for (let i = 0; i < modRoles.length; i++) {
                    if (modRoles[i] === string) {
                        delete modRoles[i]
                    }
                }
            }
        });
        embed.addField("Moderator Roles", )
        embed.addField("Moderator Users", permissions.users.forEach(user => guild.members.find(member => member.id === user)))
        return message.channel.send(embed)
        }   

    if (args[0] == 'enable') {

    }

    }

  module.exports.help = {
        name: "automod",
        aliases: ['auto-mod', 'automoderator', 'auto-moderator', 'auto-moderation', 'automoderation'],
        class: "utility",
        usage: `;help [Command]`,
        description: "Configure all automod settings.",
        guildOnly: true,
        status: "Working"
    }