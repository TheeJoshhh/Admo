const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {

    /*
        This command is for users to check their or another users warnings
    */

    let warningList = '```asciidoc\n== Active Warnings ==\n'; // This variable is used as one large string to send to the user and is added to in different places in this code
    let activeWarnings = 0; // This is used both to number warnings and to determine whether or not to  put "No Active Warnings"
    let inactiveWarnings = 0; // Same as above but for inactive warnings

    
    if (!message.mentions.members.first()) { // If no user is mentioned (The user is checking their own warnings)
        

        client.functions.checkWarnThreshold (client, message.guild, message.member, false) // Run the check warn threshhold function in false mode (meaning they don't recive punishment if they're over) in order to update the users warnings and make sure all expired warnings are set to inactive.
        const warnings = client.guildUserData.get(`${message.guild.id}-${message.member.id}`, "warnings");
        
        warnings.forEach(warning => {
            if (warning.active) {
                activeWarnings ++;
                warningList = warningList + `#${activeWarnings} :: [Issued by]: ${warning.moderator} [Reason]: ${warning.reason}\n`
            }
        });

        if (activeWarnings === 0) warningList = warningList + '[ No Active Warnings ]'

        warningList = warningList + '\n== Inactive Warnings =='

        warnings.forEach(warning => {
            if (warning.active === false) {
                activeWarnings ++;
                warningList = warningList + `#${activeWarnings + inactiveWarnings} :: [Issued by]: ${warning.moderator} [Reason]: ${warning.reason}`
            }
        });

        if (inactiveWarnings === 0) warningList = warningList + '\n[ No Inactive Warnings ]```'
    
    
    } else {


        if (message.mentions.members.first().id === client.user.id) return message.channel.send("❌ Bot's can't get warnings ❌")

        client.functions.checkWarnThreshold (client, message.guild, message.mentions.members.first(), false)
        const warnings = client.guildUserData.get(`${message.guild.id}-${message.mentions.members.first().id}`, "warnings");

        warnings.forEach(warning => {
            if (warning.active) {
                activeWarnings ++;
                warningList = warningList + `#${activeWarnings} :: [Issued by]: ${warning.moderator} [Reason]: ${warning.reason}`
            }
        });

        if (activeWarnings === 0) warningList = warningList + '[ No Active Warnings ]'

        warningList = warningList + '\n\n== Inactive Warnings =='

        warnings.forEach(warning => {
            if (warning.active === false) {
                activeWarnings ++;
                warningList = warningList + `#${activeWarnings + inactiveWarnings} :: [Issued by]: ${warning.moderator} [Reason]: ${warning.reason}`
            }
        });
        
        if (inactiveWarnings === 0) warningList = warningList + '\n[ No Inactive Warnings ]```'
    
    
    }

    message.channel.send(warningList)    

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
