module.exports = {
    "ensureData": (client, guildID) => {
        client.settings.ensure(guildID, {
            prefix: client.config.defaultPrefix, // This will allow servers to change their servers prefix.
            disabledChannels: [], // The bot will ignore all channels with their ID in this array.
            commandChannels: [], // (Overrides disabledChannels) If there are any channel ID's in this array ONLY those channels will be able to be used for commands.
            modCommands: false,
            modCommandPerms: {roles: [], users: []},  // Which roles, users or perms have access to moderator commands. By default kick and prune needs manage messages and ban needs admin.
            embedColour: "#e91e63",  // The embeds will always be this colour, admins can configure it
            autoModerator: false,
            autoModeratorSettings: [{warnsBeforeKick: 5, warnsBeforeBan: 10}, {antiswear: true, swearwords: [{word: "fuck", punishment: true}], swearPunishment: "warning", allowedToSwear: {roles: [], channels: [], users: []}}]
        })
    },
}