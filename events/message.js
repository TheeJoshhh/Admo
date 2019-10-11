module.exports = (client, message) => {
    if (message.author.bot) return;
    let isOwner = false;

    if (message.guild) {

        if (!client.settings.get(message.guild.id)) {
            client.functions.ensureData(client, message.guild.id)
        }

        if (!client.guildUserData.get(`${message.guild.id}-${message.author.id}`)) {
          client.functions.ensureGuildUserData(client, message.guild.id, message.author.id)
        }

        let argsLower = message.content.toLowerCase().split(/ +/);
        let args = message.content.split(/ +/);

        const prefixes = [client.settings.get(message.guild.id, "prefix")];
        let prefix = false;
        for(const thisPrefix of prefixes) {
          if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
        }
        if (prefix) {
          args = message.content.slice(prefix.length).split(/ +/);
          argsLower = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        }

        const command = args.shift().toLowerCase();
  
        const cmd = client.commands.get(command)
          || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));
    
        if (!cmd) {
        
        if (client.settings.get(message.guild.id, "antiswear") === true) {
          let swears = [];
          let punishments = [];

          client.settings.get(message.guild.id, "swearwords").forEach(swear => {
            if (argsLower.includes(swear.word)) {
              if (!swears.includes(swear.word)) {
                swears.push(swear.word)
                if (swear.punishment === 'default') punish (client, message, client.settings.get(message.guild.id, "defaultSwearPunishment"), client.settings.get(message.guild.id, "defaultPunishmentSettings"))
                else punish (client, message, swear.punishment, swear.punishmentSettings)
              }
            }
            swear.aliasWords.forEach(alias => {
              if (argsLower.includes(swear.word) || argsLower.includes(alias)) {
                if (!swears.includes(swear.word)) {
                  swears.push(swear.word)
                  if (swear.punishment === 'default') punish (client, message, client.settings.get(message.guild.id, "defaultSwearPunishment"), client.settings.get(message.guild.id, "defaultPunishmentSettings"))
                  else punish (client, message, swear.punishment, swear.punishmentSettings)
                }
              }
            });
          });
        }


        function punish (client, message, punishment, settings) {
          console.log("You Swore!")
        }

      } else {

        if (cmd.help.class === 'owner') {
          client.config.ownerIDs.forEach(ID => {
            if (ID === message.author.id) {
              isOwner = true;
            }
          });
          if (isOwner == false) return;
        }
        
        cmd.run(client, message, args)

      }
    
    } else {

        prefix = client.config.defaultPrefix
        
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
    
        const cmd = client.commands.get(command)
          || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));
    
        if (!cmd) return;

        if (cmd.help.class === 'owner') {
          client.config.ownerIDs.forEach(ID => {
            if (ID === message.author.id) {
              isOwner = true;
            }
          });
          if (isOwner == false) return;
        }


        if (cmd.help.guildOnly === true) {
            message.channel.send(`Sorry this command can only be used in servers! Here is a list of commands that should work in Direct Messages:`)
            return client.commands.get("help").run(client, message, args)
          } else cmd.run(client, message, args)
      

    }
}   