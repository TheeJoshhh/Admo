const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {

    if (!message.mentions.members.first()) {
        client.functions.checkWarnThreshold (client, message.guild, message.member, false) 
    } else {
        client.functions.checkWarnThreshold (client, message.guild, message.mentions.members.first(), false) 
    }

    

    

    }
    

  module.exports.help = {
        name: "warnings",
        aliases: ['warns'],
        class: "moderation",
        usage: `;warnings @Someone`,
        description: "View your own or someone elses warnings.",
        status: "Working",
        guildOnly: true
    }
