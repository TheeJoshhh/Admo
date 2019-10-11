module.exports = (client) => {
    console.log(`Admo is online in ${client.guilds.size} guilds.`)

    client.guilds.forEach(guild => {
        guild.members.forEach(member => {
            if (!client.guildUserData.get(`${guild.id}-${member.user.id}`)) {
                client.functions.ensureGuildUserData(client, guild.id, member.user.id)
            }

            if (client.guildUserData.get(`${guild.id}-${member.user.id}`, "muted.enabled") === true) {
                if (client.guildUserData.get(`${guild.id}-${member.user.id}`, "muted.endTime") !== false) {
                    if (Date.now() >= client.guildUserData.get(`${guild.id}-${member.user.id}`, "muted.endTime")) { // If the members mute is over
                        const muteRole = guild.roles.find(role => role.id === client.settings.get(guild.id, "muteRole"))
                        if (muteRole) { // If mute role exists
                            if (muteRole.editable){
                                member.roles.remove(muteRole.id);
                                client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.endTime");
                                client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.enabled");
                                client.functions.log(client, guild, `User ${member.user.tag}'s mute period is over`, `The user has automatically been unmuted.`)
                                member.send(`You are no longer muted in the server \`${guild.name}\`.`)
                                return;
                            } else {
                                client.functions.log(client, guild, `Error: Cannot remove the mute role from \`${member.user.tag}\`!`, `${member.user.tag}'s mute is up but I can't remove the mute role from them, most likely due to my permissions or position in the hierarchy. If you don't understand how to fix this, feel free to join the support server using the \`*support\` command!`);
                                client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.endTime");
                                client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.enabled");
                                return;
                            }
                        } else { // If mute role doesn't exist
                            client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.endTime");
                            client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.enabled");
                            return client.functions.log(client, guild, `Error: Cannot remove the mute role from \`${member.user.tag}\`!`, `${member.user.tag}'s mute is up but the mute role cannot be found. Please reconfigure the mute role using the \`*setup mute\` command.`);
                        }
                    } else { // If the users mute isn't over yet
                    const muteRole = guild.roles.find(role => role.id === client.settings.get(guild.id, "muteRole"))
                        setTimeout(function(){
                            if (!muteRole) {

                            }
                            try {
                                if (muteRole.editable){
                                    member.roles.remove(muteRole.id)
                                    client.functions.log(client, guild, `User ${member.user.tag}'s mute period is over`, `The user has automatically been unmuted.`)
                                    member.send(`You are no longer muted in the server \`${guild.name}\`.`)
                                    client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.enabled")
                                    client.guildUserData.set(`${guild.id}-${member.user.id}`, false, "muted.endTime")
                                    return;
                                } else { // If mute role isn't editable
                                    return client.functions.log(client, guild, `Error: Cannot remove the mute role from \`${member.user.tag}\`!`, `${member.user.tag}'s mute is up but I can't remove the mute role from them, most likely due to my permissions or position in the hierarchy. If you don't understand how to fix this, feel free to join the support server using the \`*support\` command!`)
                                }
                            } catch (e) {
                                return client.functions.log(client, guild, `Error: Cannot remove the mute role from \`${member.user.tag}\`!`, `${member.user.tag}'s mute is up but I can't remove the mute role from them, most likely due to my permissions or position in the hierarchy. If you don't understand how to fix this, feel free to join the support server using the \`*support\` command!`)
                            }
                        }, client.guildUserData.get(`${guild.id}-${member.user.id}`, "muted.endTime") - Date.now());
                    }
                }
            }
        });
    });

}





