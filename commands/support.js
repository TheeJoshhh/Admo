const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
    
    const embed = new Discord.MessageEmbed()
    .setTitle("Need help with something or have a suggestion?")
    .setDescription("Then [click here](https://discord.gg/pAznpWu) to join the support server!")

    if (message.guild) {
        embed.setColor(client.settings.get(message.guild.id, "embedColour"))
    } else {
        embed.setColor('82CAFA')
    }

    return message.channel.send(embed)

}

  module.exports.help = {
        name: "support",
        aliases: ["server"],
        class: "utility",
        usage: `*support`,
        description: "Get a link to the support server!.",
        status: "Working",
        guildOnly: false
    }
