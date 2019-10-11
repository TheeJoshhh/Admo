module.exports = (client, channel) => {

    if (channel.guild) {
        const role = channel.guild.roles.find(role => role.id === client.settings.get(channel.guild.id, "muteRole"))
    
        if (role && client.settings.get(channel.guild.id, "muteRoleAuto") === true) {
            channel.createOverwrite(role, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        }
    }

}