const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
    
    let embed = new Discord.MessageEmbed();
    embed.setColor(client.settings.get(message.guild.id, "embedColour"));

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Only Administrators can use this command.");

    if (!args[0]) {
        client.functions.setup_prefix(client, message, true)
    } else if (args[0].toLowerCase() === "mute" || args[0].toLowerCase() === "muterole") {
        client.functions.setup_mute_role(client, message, false)
    } else if (args[0].toLowerCase() === "autorole" || args[0].toLowerCase() === "auto-role") {
        client.functions.setup_autorole(client, message, false)
    } else if (args[0].toLowerCase() === 'prefix') {
        client.functions.setup_prefix(client, message, false)
    } else if (args[0].toLowerCase() === 'modlogs') {
        client.functions.setup_modLogs(client, message, false)
    } else {

    }

}

  module.exports.help = {
        name: "setup",
        aliases: ["configure", "reconfigure"],
        class: "utility",
        usage: `*setup [ThingToSetup(optional)]`,
        description: "Setup or Reconfigure Admo in your server.",
        status: "Working",
        guildOnly: true
    }
