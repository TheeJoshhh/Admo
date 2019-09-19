const Discord = require("discord.js");
module.exports.run = async (client, message) => {

  const startDate = Date.now()
  message.channel.send('Pinging...').then(sent => {
    return sent.edit(`Pong! Took ${Date.now() - startDate}ms \`Web Socket: ${Math.round(client.ws.ping)}\``);
  });

}

 module.exports.help = {
        name: "ping",
        aliases: ['latency'],
        class: "utility",
        usage: `;ping`,
        description: "Why are you even here, it's literally just a ping command.\nIt replies with latency.",
        status: true,
        guildOnly: true
 }