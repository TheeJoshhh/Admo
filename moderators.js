const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {



    }

  module.exports.help = {
        name: "moderators",
        aliases: ['mods'],
        class: "utility",
        usage: `*moderators <Add/Remove> <Role/User> <Name>`,
        description: "Add or remove a role or user as a moderator.\nUsers that are moderators or users with moderator roles can access the bots moderation commands and configure the auto-moderator settings.",
        guildOnly: true,
        status: "Working"
    }