module.exports = {
    "ensureData": (client, guildID) => {
        client.settings.ensure(guildID, {
            prefix: client.config.defaultPrefix, // This will allow servers to change their servers prefix.
            disabledChannels: [], // The bot will ignore all channels with their ID in this array.
            commandChannels: [], // (Overrides disabledChannels) If there are any channel ID's in this array ONLY those channels will be able to be used for commands.
            modCommandPerms: {roles: [], users: []},  // Which roles, users or perms have access to moderator commands. By default kick and prune needs manage messages and ban needs admin.
            embedColour: "#e91e63",  // The embeds will always be this colour, admins can configure it
            warnsBeforeKick: 5,
            warnsBeforeBan: 10,
            antiswear: true,
            swearwords: [{word: "fuck", aliasWords: ["fuk", "fucc"], punishment: "default", punishmentSettings: {}}, {word: "retard", aliasWords: [], punishment: "default", punishmentSettings: {}}], // warning, kick, ban, nothing or mute
            defaultSwearPunishment: "warning", 
            defaultPunishmentSettings: {}, 
            allowedToSwear: [], // The ID's of chann
            muteRole: "", // Just the ID of the mute role
            muteRoleAuto: false,
            unmuteDM: false,
            antilink: true, // AllLinks, true or false (All links = ban all links, true = ban specific links, false = off)
            links: [],
            logs: {enabled: false, channel: ""},
            autoRole: {enabled: false, role: ""}
        })
    },


    "ensureGuildUserData": (client, guildID, userID) => {
        client.guildUserData.ensure(`${guildID}-${userID}`, {
            muted: {enabled: false, endTime: false},
        })
    },

    "setup_autorole": async (client, message) => {
            const Discord = require("discord.js");
            const autoEmbed = new Discord.MessageEmbed()
              autoEmbed.setColor(client.settings.get(message.guild.id, "embedColour"))
              autoEmbed.setTitle("Would you like to enable autorole? (yes to enable / no to disable)")
              autoEmbed.setDescription("Enabling this means the bot will automatically give new users that join the server a role of your choice.")
              await message.channel.send(autoEmbed)
              .then(() => {
                  message.channel.awaitMessages(response => response.author.id === message.author.id && response.content.toLowerCase() === "yes" || response.content.toLowerCase() === "y" || response.content.toLowerCase() === "no" || response.content.toLowerCase() === "n", {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                  })
                  .then((response) => {
    
                    const embed = new Discord.MessageEmbed()
                    embed.setColor(client.settings.get(message.guild.id, "embedColour"))
      
                        if (response.first().content.toLowerCase() === "yes" || response.first().content.toLowerCase() === "y") {
                            embed.setTitle("What role would you like new members to have?")
                            embed.setDescription("Please enter the role's name (case sensitive)")
                            message.channel.send(embed)
                            .then(() => {
                                message.channel.awaitMessages(response => response.author.id === message.author.id, {
                                  max: 1,
                                  time: 120000,
                                  errors: ['time'],
                                })
                                .then((response) => {
                                    const role = message.guild.roles.find(role => role.name === response.first().content)
                                    if (!role) {
                                        embed.setTitle("Error: Role not found")
                                        embed.setDescription(`The role ${response.first().content} could not be found, please restart setup (to skip to the autorole section run \`*setup autorole\`)\nPlease keep in mind this is case sensitive.`)
                                        return message.channel.send(embed)
                                    } else {
                                        client.settings.set(message.guild.id, true, "autoRole.enabled")
                                        client.settings.set(message.guild.id, role.id, "autoRole.role")
                                        embed.setTitle("AutoRole now enabled!")
                                        embed.setDescription("Users joining your server will now automatically get this role.\nIf the role is deleted, autorole will be disabled automatically however changing the roles name will not effect autorole and new users will still recieve the role.")
                                        return message.channel.send(embed)
                                    }
                                })
                            })
                        } else if (response.first().content.toLowerCase() === "no" || response.first().content.toLowerCase() === "n") {
                            client.settings.set(message.guild.id, false, "autoRole.enabled")

                        } else {
                            embed.setTitle("Error: Invalid Input")
                            embed.setDescription("This error should be literally impossible to get but if you manage to get it, please run the command *support and join the support server and provide the following code: `#agg34`")
                            return message.channel.send(embed)
                        }
      
                    })
                    .catch((e) => {
                        console.log(e)
                      const embed = new Discord.MessageEmbed()
                      .setTitle("Timed Out")
                      .setColor(client.settings.get(message.guild.id, "embedColour"))
                      .setDescription("You took too long to respond, please begin setup again. To just do the autorole section of the setup, run `*setup autorole`")
                      return message.channel.send(embed)
                    });
                })
  
      
    },

    "setup_mute_channel": async (client, message) => {
        const Discord = require("discord.js");
        const roleEmbed = new Discord.MessageEmbed()
        roleEmbed.setColor(client.settings.get(message.guild.id, "embedColour"))
        roleEmbed.setTitle("What is the name of the role you want muted users to have?")
        roleEmbed.setDescription("Please enter the name exactly as this is case sensitive.\nIf the role doesn't exist one will be created with the name you provide.\nYou have two minutes to respond or this will timeout.")
        await message.channel.send(roleEmbed)
        .then(() => {
            message.channel.awaitMessages(response => response.author.id === message.author.id, {
              max: 1,
              time: 120000,
              errors: ['time'],
            })
            .then((response) => {

                if (!message.guild.roles.find(role => role.name === response.first().content)) {
                    try {
                        const createdRole2 = message.guild.roles.create({ data: {
                            name: response.first().content,
                            color: "#000000",
                            permissions: []
                        }, reason: "Auto-Creating Mute Role"}).then(() => {
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Mute Role Created and Set`)
                            .setColor(client.settings.get(message.guild.id, "embedColour"))
                            .setDescription("A role with the name you defined was not found so one was created and set as the mute role. Users that are muted will now recieve this role.")
                            message.channel.send(embed)
                            client.settings.set(message.guild.id, message.guild.roles.find(role => role.name === response.first().content).id, "muteRole")
                            return client.functions.setup_mute_autoconfig(client, message)
                        })

                    } catch (e) {
                        console.log(e)
                        const embed = new Discord.MessageEmbed()
                        .setTitle("Error: Couldn't Create that Role")
                        .setColor(client.settings.get(message.guild.id, "embedColour"))
                        .setDescription("A role with the name you defined was not found so I attempted to create one but failed, please give me permissions to create roles and make sure you have a valid role name.")
                        return message.channel.send(embed)
                    }
                } else {
                    const role = message.guild.roles.find(role => role.name === response.first().content).id
                    client.settings.set(message.guild.id, role, "muteRole")
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Mute Role Set")
                    .setColor(client.settings.get(message.guild.id, "embedColour"))
                    .setDescription("Users that are muted will now recieve this role")
                    message.channel.send(embed)
                    return client.functions.setup_mute_autoconfig(client, message)
                }

              })
              .catch(() => {
                const embed = new Discord.MessageEmbed()
                .setTitle("Timed Out")
                .setColor(client.settings.get(message.guild.id, "embedColour"))
                .setDescription("You took too long to respond, please begin setup again.")
                return message.channel.send(embed)
              });
          })

        },

        "setup_mute_autoconfig": async (client, message) => {
          const Discord = require("discord.js");
          const autoEmbed = new Discord.MessageEmbed()
            autoEmbed.setColor(client.settings.get(message.guild.id, "embedColour"))
            autoEmbed.setTitle("Would you like the bot to automatically configure your mute role? (yes/no)")
            autoEmbed.setDescription("This means the bot will automatically change the settings for all the channels in the server to prevent muted members talking in them. This will also automatically configure new channels when they are created however beware that this will not work when the bot is offline. If you turn auto configure on and want muted members to be able to speak in specific chennels then simply undo the bots changes to the mute roles permissions in the channel.")
            await message.channel.send(autoEmbed)
            .then(() => {
                message.channel.awaitMessages(response => response.author.id === message.author.id && response.content.toLowerCase() === "yes" || response.content.toLowerCase() === "y" || response.content.toLowerCase() === "no" || response.content.toLowerCase() === "n", {
                  max: 1,
                  time: 60000,
                  errors: ['time'],
                })
                .then((response) => {
  
                  const embed = new Discord.MessageEmbed()
                  embed.setColor(client.settings.get(message.guild.id, "embedColour"))
    
                      if (response.first().content.toLowerCase() === "yes" || response.first().content.toLowerCase() === "y") {
                        client.settings.set(message.guild.id, true, "muteRoleAuto")
                            const muteRole2 = message.guild.roles.find(role => role.id === client.settings.get(message.guild.id, "muteRole"))
                          if (!muteRole2) {
                              embed.setTitle("Error: No Mute Role");
                              embed.setDescription(`The mute role previously configured in this server can no longer be found.\nTo reconfigure your mute role, please run the command: \`*setup mute\``);
                              return message.channel.send(embed);
                          }
                          try {
                              message.guild.channels.forEach((channel) => {
                                  channel.createOverwrite(muteRole2, {
                                      SEND_MESSAGES: false,
                                      ADD_REACTIONS: false,
                                      SPEAK: false
                                  });
                              });
                          } catch (e) {
                              embed.setTitle("Error: Failed to Auto-Configure channels.")
                              embed.setDescription("Please make sure I have permissions to modify channels and their permissions then begin the setup again, if you are unsure what this means then feel free to run the command `*support` to join the support server for Admo!")
                              return message.channel.send(embed)
                          }
                          embed.setTitle("Auto-Config Mute Permissions has been Enabled!")
                          embed.setDescription("If you change your mind and want to disable it in the future just run the command `*setup mute`")
                          return message.channel.send(embed)
                      } else if (response.first().content.toLowerCase() === "no" || response.first().content.toLowerCase() === "n") {
                          client.settings.set(message.guild.id, false, "muteRoleAuto")
                          embed.setTitle("Auto-Config Mute Permissions has been Disabled!")
                          embed.setDescription("If you change your mind and want to enable it in the future just run the command `*setup mute`")
                          return message.channel.send(embed)
                      } else {
                          embed.setTitle("Error: Invalid Input")
                          embed.setDescription("This error should be literally impossible to get but if you manage to get it, please run the command *support and join the support server and provide the following code: `#ayug1`")
                          return message.channel.send(embed)
                      }
    
                  })
                  .catch((e) => {
                      console.log(e)
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Timed Out")
                    .setColor(client.settings.get(message.guild.id, "embedColour"))
                    .setDescription("You took too long to respond, please begin setup again.")
                    return message.channel.send(embed)
                  });
              })

    },

    "log": (client, guild, title, message) => {
        const Discord = require("discord.js");
        if (client.settings.get(guild.id, "logs.enabled") === true) {
            if (guild.channels.find(channel => channel.id === client.settings.get(guild.id, "logs.channel"))) {
                const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setColor(client.settings.get(guild.id, "embedColour"))
                .setDescription(message)
                return guild.channels.find(channel => channel.id === client.settings.get(guild.id, "logs.channel")).send(embed)
            } else {
                client.settings.set(guild.id, false, "logs.enabled")
                client.settings.set(guild.id, '', "logs.channel")
            }
        }
    },

    "setup_prefix": (client, message) => {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setTitle("Set a new prefix!")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("What would you like your new prefix to be? (Prefixes aren't case sensitive)\nA prefix is the character / short phrase you put before a command.\nMy default prefix is \*")
        message.channel.send(embed)
        .then(() => {
            message.channel.awaitMessages(response => response.author.id === message.author.id, {
              max: 1,
              time: 60000,
              errors: ['time'],
            })
            .then((response) => {
                if (response.first().content.length > 0 && response.first().content.length < 5) {
                    client.settings.set(message.guild.id, response.first().content, "prefix")
                    embed.setTitle("Prefix Set")
                    embed.setDescription(`From now on you must lead commands by the new prefix\nFor example; \`${response.first().content}ping\``)
                    return message.channel.send(embed)
                } else {
                    embed.setTitle("Error: Invalid Prefix Length")
                    embed.setDescription("Your prefix must be less than 5 characters long.")
                    return message.channel.send(embed)
                }
            })
        })
    },

    "setup_modLogs": (client, message) => {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setTitle("Set up a mod logs channel!")
            .setColor(client.settings.get(message.guild.id, "embedColour"))
            .setDescription("Respond with the name of the channel you want your modlogs to be in or \`--skip\` to skip setting up modlogs.\nModlogs are mutes, kicks, bans and anything the automoderator does eg anti-swear and it's resulting punishments.")
        message.channel.send(embed)
        .then(() => {
            message.channel.awaitMessages(response => response.author.id === message.author.id, {
              max: 1,
              time: 60000,
              errors: ['time'],
            })
            .then((response) => {
                if (response.first().content.toLowerCase() === '--skip') {

                } else {
                    const channel = message.guild.channels.find(channel => channel.name === response.first().content.toLowerCase());
                    if (!channel) {
                        embed.setTitle("Error: Couldn't find that channel.")
                        embed.setDescription("Please make sure the channel exists and try again. (To do just this part of setup run the command `*setup modlogs`)")
                        return message.channel.send(embed)
                    }
                    if (channel.type !== "text") {
                        embed.setTitle("Error: Must be a text channel")
                        embed.setDescription("The channel must be a text channel and not a voice channel or category. (To do just this part of setup run the command `*setup modlogs`)") 
                        return message.channel.send(embed)
                    }
                    
                    client.settings.set(message.guild.id, true, "logs.enabled")
                    client.settings.set(message.guild.id, channel.id, "logs.channel")
                    embed.setTitle("Logs channel set")
                    embed.setDescription("From now on moderation based logs will be sent to the channel " + channel.name) 
                    return message.channel.send(embed)
                }
            })
        })
    }

}