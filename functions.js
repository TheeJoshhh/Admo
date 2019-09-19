module.exports = {
    "ensureData": (client, guildID) => {
        client.settings.ensure(guildID, {
            prefix: client.config.defaultPrefix, // This will allow servers to change their servers prefix.
            disabledChannels: [], // The bot will ignore all channels with their ID in this array.
            commandChannels: [], // (Overrides disabledChannels) If there are any channel ID's in this array ONLY those channels will be able to be used for commands.
            modCommands: client.config.defaultModCommandsSetting,
            modCommandPerms: [],
            embedColour: "",
            autoModerator: client.config.defaultAutoModSetting
        })
    }
}