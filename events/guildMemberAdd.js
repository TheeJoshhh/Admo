module.exports = (client, member) => {

    client.functions.ensureGuildUserData(client, member.guild.id, member.id)

    if (client.settings.get(member.guild.id, "autoRole.enabled") === true) {
        if (member.guild.roles.find(role => role.id === client.settings.get(member.guild.id, "autoRole.role"))) {
            return member.roles.add(member.guild.roles.find(role => role.id === client.settings.get(member.guild.id, "autoRole.role")))
        } else {
            client.settings.set(member.guild.id, '', "autoRole.role")
            client.settings.set(member.guild.id, false, "autoRole.enabled")
            client.functions.log(client, member.guild, "Error: Couldn't find AutoRole role.", "Auto-Role has been disabled since a member has joined the server and the auto-role role couldn't be found. Run `*setup autorole` to set it up again")
        }
    }

}