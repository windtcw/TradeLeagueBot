'use strict';

const Discord = require('discord.js'),
bot = new Discord.Client(),
fs = require('fs'),
datadir = "./users";

bot.login('MzA2NTYwODk1NTA3NjI4MDQy.C-Fimg.6Ckvl7SCiBSUK8SNHIITJruDQpc');

const commands = {
  '+rep' : (msg) => {
    try{
    let arr = msg.content.split(" ").slice(1);
    if (!arr[0]) return msg.channel.sendMessage("Please specify the target user by a mention.");
    let feedback = arr.join(" ").split(" ").slice(1).join(" ");
    if (!feedback) feedback = "None.";

    let user = msg.mentions.users.first();
    if (user.id == msg.author.id) return msg.channel.sendMessage(`${msg.author}, you can't add a reputation point to yourself.`);
      var file = require("./users/" + user.id + ".json");
      console.log(file);
      file["plus"] = file["plus"] + 1;
      file["feedback"].push(feedback);
      file["last"].push("plus");

      fs.writeFile(("./users/" + user.id + ".json"), JSON.stringify(file, null, 2), (err) => {
        if (err) throw err;
        console.log(JSON.stringify(file, null, 2));
      });

      showData(msg, user, 'plus');
    } catch (e) {
      msg.channel.sendMessage("A problem occured while processing. Did you make any mistakes typing the command?");
      console.error(e);
    }
    },
  '-rep' : (msg) => {
    try{
    let arr = msg.content.split(" ").slice(1);
    if (!arr[0]) return msg.channel.sendMessage("Please specify the target user by a mention.");
    let feedback = arr.join(" ").split(" ").slice(1).join(" ");
    if (!feedback) feedback = "None.";

    let user = msg.mentions.users.first();
    if (user.id == msg.author.id) return msg.channel.sendMessage(`${msg.author}, you can't deduce a reputation point from yourself.`);
    var file = require("./users/" + user.id + ".json");
    console.log(file);
    file["minus"] = file["minus"] + 1;
    file["feedback"].push(feedback);
    file["last"].push("minus");

  fs.writeFile(("./users/" + user.id + ".json"), JSON.stringify(file, null, 2), (err) => {
    if (err) throw err;
    console.log(JSON.stringify(file, null, 2));
  });

  showData(msg, user, 'minus');
} catch (e) {
  msg.channel.sendMessage("A problem occured while processing. Did you make any mistakes typing the command?");
  console.error(e);
}
  },
  '!rep' : (msg) => {
    let user = msg.mentions.users.first();
    if (!user) return msg.channel.sendMessage("Please specify the target user by a mention.");
    showData(msg, user, 'check');
  },
  '/dataflush' : (msg) => {
    var i = 0,
    j = 0;
    if (msg.author.id != 197733648403791872) return msg.channel.sendMessage("Command limited to bot owner only.");
    msg.guild.fetchMembers().then((guild) => {
      var arr = guild.members.keyArray();
      var p = ".";
      var keyarr = guild.members.array();
      for (i = 0; i < arr.length; i++){
        var data = {
          "name" : (`${keyarr[i].user.username}`),
          "plus" : 0,
          "minus" : 0,
          "feedback" : [p,p,p,p,p],
          "last" : []
        };
        fs.writeFile((`./users/${arr[i]}.json`), JSON.stringify(data, null, 2), (err) => {
          if (err) throw err;
          console.log(JSON.stringify(data, null, 2));
        });
        j = i;
      }
    });
    setTimeout(function(){
    const embed = new Discord.RichEmbed()
    .setTitle('Database refresh results')
    //.addField('\u200b', '\u200b', true)
    /*
     * Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
     */
    .setColor(0x00FF00)
    /*
     * Takes a Date object, defaults to current date.
     */
    .setTimestamp()
    .addField('\u200b', (`Logged \`\`\`${j}\`\`\` users.`));

  msg.channel.sendEmbed(
    embed,
    { disableEveryone: true }
  );
}, 2000);
},
  '/undo' : (msg) => {
    var user, id;
    try {
    user = msg.mentions.users.first;
    id = msg.mentions.users.first().id;
  } catch (e) {
    if (!user || !id) return msg.channel.sendMessage("Please specify the member you want to clear their last reputation change.");
  }
    var _flag = false;
   msg.member.roles.filter( (role) => {
      console.log(role.name);
      if(role.name == "Staff member"){
        _flag = true;
      }});

      if (_flag === false) return msg.channel.sendMessage("You do not have permission to issue this command!");
      //console.log(id);
      var dir = ("./users/" + id + ".json");
      var dirobj = require(dir);
      let type = dirobj.last[dirobj.last.length - 1];

      if (type === "plus"){
        dirobj["plus"] = dirobj["plus"] - 1;
      } else if (type === "minus") {
        dirobj["minus"] = dirobj["minus"] - 1;
      } else {
        return;
      }
      dirobj["last"] = dirobj["last"].slice(0, -1);
      dirobj["feedback"] = dirobj["feedback"].slice(0, -1);

      user = msg.mentions.users.first();
      console.log(user.id);

      fs.writeFile((`./users/${user.id}.json`), JSON.stringify(dirobj, null, 2), (err) => {
        if (err) return console.error(err);
        console.log(JSON.stringify(dirobj, null, 2));
      });

      showData(msg, user, 'check');
  }
};
bot.on('ready', () => {
  console.log("READY!");
});
bot.on('message', (msg) => {
  // Gets message content, split it, then take in the first keyword and checks if it's valid.
  if (commands.hasOwnProperty(msg.content.split(" ")[0])) return commands[msg.content.split(" ")[0]](msg);
});
bot.on('guildMemberAdd', (member) => {
  var p = ".";
    var data = {
      "name" : (`${member.user.username}`),
      "plus" : 0,
      "minus" : 0,
      "feedback" : [p,p,p,p,p],
      "last" : []
    };
    fs.writeFile((`./users/${member.id}.json`), JSON.stringify(data, null, 2), (err) => {
      if (err) throw err;
      console.log(JSON.stringify(data, null, 2));
    });
    bot.channels.get("297408095137562625").sendMessage(`${member}, your data have been saved. Welcome!`);
});

function showData(msg, user, type){
  var dir = (`./users/${user.id}.json`);
  var file = require(dir);
  var color;
  var perc = round((file["plus"] / (file["plus"] + file["minus"])) * 100, 2);
  if (type == "minus") color = 0xFF0000;
  if (type == "plus") color = 0x00FF00;
  if (type == "check") color = 0x0000FF;
  var embed = new Discord.RichEmbed()

  .setTitle('Showing data.')
  //.addField('\u200b', '\u200b', true)
  .setColor(color)
  .setTimestamp()
  // array - x = 5
  // [g]
  .addField('User', (`${user.username}#${user.discriminator}`))
  .addField('Feedback', (`\`\`\`xl
\"${file.feedback.slice((file.feedback.length <= 10) ? 5 : 5 + ((file.feedback.length - 5) - 5)).join("\"\n\"")}\"
\`\`\``))
  .addField('Point Count', (`+${file["plus"]} : -${file["minus"]}`))
  .addField('Percentage', (`${perc}%`));
//slice((file.feedback.length <= 5) ? 0 : file.feedback.length - 5)
// Current array length: 6. n - x = 5
  msg.channel.sendEmbed(
    embed,
    { disableEveryone: true }
  );
}
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
