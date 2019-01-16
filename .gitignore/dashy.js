const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({disableEveryone: true});
const bot = client;
const xp = require("./xp.json");
const prefix = "d!"

client.login(process.env.TOKEN);

client.on("ready", async () => {

	// Console

  console.log(`\n\nConnection ========== \nConnecté en tant que ${client.user.tag} !(ID : ${client.user.id})\n=====================`)

	// Game

	var game = [
    `Dashy !`, 
    `https://discordapp.com/invite/kMghwaY`];

  setInterval(function(){

    var jeux = game[Math.floor(Math.random() * game.length)];

    client.user.setPresence({ 
      game:{ 
        name: jeux, 
        type: "STREAMING",
        url: "https://twitch.tv/Dashy-Bot"
      } 
    });
}, 60000); 

});

bot.on("message", async msg => {

let message = msg;
if(message.author.bot) return;
let msgArray = msg.content.split(" ");
let args = msgArray.slice(1);



	// Suggestion

	    var suggestion = args.join(' ');

    if(message.content.startsWith(prefix + "suggestion")){

        if(!suggestion) return message.channel.send(`:x: ${msg.author}, tu dois indiquer une suggestion pour **__le serveur__!** `);

        var suggestion_embed = new Discord.RichEmbed()
        .setAuthor(client.user.tag)
  		.setFooter(`Demandée par ${msg.author.username} - Dashy`)
  		.setTimestamp()
        .setDescription("Vous pouvez réagir à cette suggestion grâce aux emojis ci-dessous !")
        .addField(`Suggestion de `, `${message.author.username} (**ID: ${msg.author.id}**)`)
        .addField("Contenu de la suggestion :", suggestion)
        message.delete().then(msg => {msg.channel.send(`\`Merci, cette suggestion à été envoyée au staff du serveur !\``)})
        bot.channels.find("name", "suggestion").send(suggestion_embed)
        .then(function (message) {
            message.react("✅")
            message.react("❌")
            })
    }

	// Reports

	if(msg.content.startsWith(prefix + "report")) {
	let reportses = client.channels.find('name', 'report')
	let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return msg.channel.send(`:x: ${msg.author}, tu dois mentionner un utilisateur !`)
    let rreason = args.join(" ").slice(22);
    if(!rreason) return msg.channel.send(`:x: ${msg.author}, tu dois indiquer une raison !`)

    let reportEmbed = new Discord.RichEmbed()
    .setDescription(":warning: Signalement")
    .addField("Utilisateur :", `${rUser} (**ID :${rUser.id})**`)
    .addField("Signalé par :", `${message.author} (**ID : ${message.author.id}**)`)
    .addField("Lieu :", message.channel)
    .addField("Moment :", message.createdAt)
	.addField("Raison :", `**${rreason}**`)
  .setAuthor(client.user.tag)
  .setFooter(`Demandée par ${msg.author.username} - Dashy`)
  .setTimestamp()
	reportses.send(reportEmbed);
}
	// XP & Levels
  let xpAdd = Math.floor(Math.random() * 3) + 1;
  console.log(xpAdd)

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 0
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp =  curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
	let levelUp = curlvl + 1
	let levelses = client.channels.find(`name`, "commandes")
    levelses.send(`:white_check_mark: Bien joué **${msg.author}**, tu viens de passer **__niveau ${levelUp}__** !`)
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
	});

if(message.content.startsWith(prefix + "level")) {
	  if(!xp[message.author.id]){
   xp[message.author.id] = {
     xp: 0,
     level: 1
  };
}
  let nxtLvlXp = curlvl * 300;
  let difference = nxtLvlXp - curxp;

  let lvlEmbed = new Discord.RichEmbed()
  .setDescription('Ton XP sur le serveur **Dashy**')
  .setThumbnail(msg.author.displayAvatarURL)
  .setAuthor(client.user.tag)
  .setFooter(`Demandée par ${msg.author.username} - Dashy`)
  .setTimestamp()
  .addField("Niveau", curlvl, true)
  .addField("XP", curxp, true)
  .addField(`XP manquant avant le niveau suivant`, `${difference} xp`);

message.channel.send(lvlEmbed)


	}
});
