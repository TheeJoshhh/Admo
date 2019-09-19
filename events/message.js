module.exports = (client, message) => {
    if (message.author.bot) return;



    if (message.guild) {

        if (!client.settings.get(message.guild.id)) {
            client.functions.ensureData(client, message.guild.id)
        }

        const prefixes = [client.settings.get(message.guild.id, "prefix")];
        let prefix = false;
        for(const thisPrefix of prefixes) {
          if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
        }
        if(!prefix) return;
        
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
    
        const cmd = client.commands.get(command)
          || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));
    
        if (!cmd) return;
        else cmd.run(client, message, args)
    
    } else {

        prefix = client.config.defaultPrefix
        
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
    
        const cmd = client.commands.get(command)
          || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(command));
    
        if (!cmd) return;

        if (cmd.help.guildOnly === true) {
            message.channel.send(`Sorry this command can only be used in servers! Here is a list of commands that should work in Direct Messages:`)
            return client.commands.get("help").run(client, message, args)
          } else cmd.run(client, message, args)
      

    }
}   