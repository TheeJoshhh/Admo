module.exports = async (client, message) => {
    if (message.author.bot) return;
    let isOwner = false;

    if (message.guild) {

        client.functions.ensureData(client, message.guild.id)
        
          client.functions.ensureGuildUserData(client, message.guild.id, message.author.id)
        

        if (message.mentions.members.first()) {
          message.mentions.members.forEach(member => {
            client.functions.ensureGuildUserData(client, message.guild.id, member.user.id)
          });
        }

        let argsLower = message.content.toLowerCase().split(/ +/);
        let args = message.content.split(/ +/);
        
        // AntiSpam System
        if (client.settings.get(message.guild.id, "antispam.enabled") === true) {
          if (!antiSpamCache[`${message.guild.id}-${message.author.id}`]) antiSpamCache[`${message.guild.id}-${message.author.id}`] = {messages: [], timestamps: [], violations: [], working: false}
          let userCache = antiSpamCache[`${message.guild.id}-${message.author.id}`]
          userCache.messages.push(message.content.toLowerCase())
          userCache.timestamps.push(Date.now())
  
          if (userCache.timestamps[9]) {
            userCache.messages.shift()
            userCache.timestamps.shift()
          }
  
          if (userCache.timestamps[4]) {
            console.log(Date.now() - userCache.timestamps[0])
            if (Date.now() - userCache.timestamps[0] < 4000) {
              if (!userCache.working) {
                userCache.working = true;
                // await message.channel.send("Please Stop Spamming, if further spamming occurs punishment may be applied.");
                console.log(`User ${message.author.tag} is spamming (Speed)`)
                await userCache.violations.push(Date.now() + client.settings.get(message.guild.id, "antispam.messageWarnsActiveTime"));
              }
            }
          }
  
          if ((userCache.messages.length -2) > -1) {
            if (userCache.messages[userCache.messages.length - 3] === userCache.messages[userCache.messages.length - 2] && userCache.messages[userCache.messages.length - 2] === userCache.messages[userCache.messages.length - 1]) {
              if (!userCache.working) {
                userCache.working = true;
                // await message.channel.send("Please Stop Spamming, if further spamming occurs punishment may be applied.");
                console.log(`User ${message.author.tag} is spamming (Duplicates)`)
                await userCache.violations.push(Date.now() + client.settings.get(message.guild.id, "antispam.messageWarnsActiveTime"));
              }
            }
          }

          let violationCount = 0;
          let arrNum = 0

          userCache.violations.forEach(violation => {
            if (violation > Date.now()) violationCount ++;
            else userCache.violations.splice(violation)
            arrNum ++;
          });

          if (violationCount >= client.settings.get(message.guild.id, "antispam.messageWarnsTillPunish")) {
            client.functions.punish(client, message, "Admo Auto Moderator", client.settings.get(message.guild.id, "antispam.spamPunishment"), client.settings.get(message.guild.id, "antispam.spamPunishmentSettings"))
          }

          if (userCache.working) {
            setTimeout(function(){
              userCache.working = false
            }, 3000)
          }

        }
        // Antispam END

      
        const prefixes = [client.settings.get(message.guild.id, "prefix")];
        let prefix = false;
        for(const thisPrefix of prefixes) {
          if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
        }
        if (prefix) {
          args = message.content.slice(prefix.length).split(/ +/);
          argsLower = message.content.toLowerCase().slice(prefix.length).split(/ +/);
        } else return;

        const command = args.shift().toLowerCase();
  
        const cmd = client.commands.get(command)
          || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));
    
        if (!cmd) {
        
        if (client.settings.get(message.guild.id, "antiswear.enabled") === true) {
          let swears = [];
          let punishments = [];

          client.settings.get(message.guild.id, "swearwords").forEach(swear => {
            if (argsLower.includes(swear.word)) {
              if (!swears.includes(swear)) {
                swears.push(swear)
              }
            }
            swear.aliasWords.forEach(alias => {
              if (argsLower.includes(swear.word) || argsLower.includes(alias)) {
                if (!swears.includes(swear)) {
                  swears.push(swear)
                }
              }
            });
          });

          if (swears) {
            if (swears.length > 0) {
              message.delete();
              if (swears.length === 1) {
                if (swears[0].punishment === 'default') client.functions.punish(client, message, client.settings.get(message.guild.id, "antiswear.defaultPunishment"), client.settings.get(message.guild.id, "defaultPunishmentSettings"))
                else client.functions.punish(client, message, "Admo Auto Moderator", swears[0].punishment, swears[0].punishmentSettings)
              } else {
                let maxPun = {name: '', num: 1}
                let arrayNum = -1
                swears.forEach(swear => { 
                  arrayNum ++;
                  if (swear.punishment === 'default') {
                    swear.punishment = client.settings.get(message.guild.id, "antiswear.defaultPunishment")
                    swear.punishmentSettings = client.settings.get(message.guild.id, "antiswear.defaultPunishmentSettings")
                  } 

                  if (swear.punishment === 'warning') {
                    if (maxPun.name === 'warning') {
                      if (swears[maxPun.num].punishmentSettings.amount < swears[arrayNum].punishmentSettings.amount) {
                        maxPun = {name: swears[arrayNum].punishment, num: arrayNum}
                      }
                    } else if (maxPun.name === '' || maxPun.name === 'none') maxPun = {name: 'warning', num: arrayNum};
                  
                  
                  } else if (swear.punishment === 'kick') {
                    
                    
                    if (maxPun.name === '' || maxPun.name === 'warning' || maxPun.name === 'none') maxPun.name = {name: 'kick', num: arrayNum};
                  
                  
                  } else if (swear.punishment === 'ban') {
                    
                    
                    if (maxPun.name === '' || maxPun.name === 'kick', maxPun.name === 'warning' || maxPun.name === 'none') maxPun.name = {name: 'ban', num: arrayNum};
                    else if (maxPun.name === 'ban') {
                      if (swears[maxPun.num].punishmentSettings.days < swears[arrayNum].punishmentSettings.days) {
                        maxPun = {name: swears[arrayNum].punishment, num: arrayNum}
                      }
                    } 
                  
                  
                  } else if (swear.punishment === 'mute') {
                    
                    
                    if (maxPun.name === 'mute') {
                      if (swear[arrayNum].punishmentSettings.time > swear[maxPun.num].punishmentSettings.time) maxPun.num = arrayNum;
                      
                    }
                    if (maxPun.name === '' || maxPun.name === 'warn' || maxPun.name === 'none') {
                      maxPun = {name: "mute", num: arrayNum};
                    }
                  
                  }
                  console.log(maxPun)
                });
                
                client.functions.punish(client, message, "Admo Auto Mod", swears[maxPun.num].punishment, swears[maxPun.num].punishmentSettings)
              }
            }
          }
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