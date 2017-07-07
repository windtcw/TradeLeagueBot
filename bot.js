'use strict';


/*
========= TO LEGACYY ==========

Please update the Discord.js module
to its latest version!

run:

npm install discord.js --save
===============================
*/

const Discord = require('discord.js'),
bot = new Discord.Client(),
fs = require('fs'),
datadir = "./users";
// )

bot.login('TOKEN GOES HERE');

const commands = {
  '+rep' : (msg) => {
    try{
    let arr = msg.content.split(" ").slice(1);
    if (!arr[0]) return msg.channel.send("Please specify the target user by a mention.");
    let feedback = arr.join(" ").split(" ").slice(1).join(" ");
    if (!feedback) feedback = "None.";

    let user = msg.mentions.users.first();
    if (user.id == msg.author.id) return msg.channel.send(`${msg.author}, you can't add a reputation point to yourself.`);
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
      msg.channel.send("A problem occured while processing. Did you make any mistakes typing the command?");
      console.error(e);
    }
    },
  '-rep' : (msg) => {
    try{
    let arr = msg.content.split(" ").slice(1);
    if (!arr[0]) return msg.channel.send("Please specify the target user by a mention.");
    let feedback = arr.join(" ").split(" ").slice(1).join(" ");
    if (!feedback) feedback = "None.";

    let user = msg.mentions.users.first();
    if (user.id == msg.author.id) return msg.channel.send(`${msg.author}, you can't deduce a reputation point from yourself.`);
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
  msg.channel.send("A problem occured while processing. Did you make any mistakes typing the command?");
  console.error(e);
}
  },
  '!rep' : (msg) => {
    let user = msg.mentions.users.first();
    if (!user) return msg.channel.send("Please specify the target user by a mention.");
    showData(msg, user, 'check');
  },
  '/dataflush' : (msg) => {
    var i = 0,
    j = 0;
    if (msg.author.id != 197733648403791872) return msg.channel.send("Command limited to bot owner only.");
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

  msg.channel.send({
    embed,
  });
}, 2000);
},
  '/undo' : (msg) => {
    var user, id, flag;
    if (msg.content === 'undo') flag = false;
    else flag = true;
    try {
    user = msg.mentions.users.first;
    id = msg.mentions.users.first().id;
  } catch (e) {
    if (!user || !id) return msg.channel.send("Please specify the member you want to clear their last reputation change.");
  }
    var _flag = false;
   msg.member.roles.filter( (role) => {
      console.log(role.name);
      if(role.name == "Staff member"){
        _flag = true;
      }});

      if (_flag === false) return msg.channel.send("You do not have permission to issue this command!");
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
      if (flag === false)showData(msg, user, 'check');
  },
  '/massundo' : (m) => {
    var _flag = false;
    m.member.roles.filter( (role) => {
      console.log(role.name);
      if(role.name == "Staff member"){
        _flag = true;
      }});
    if (_flag == false) return m.channel.send("Sudo Commands are limited to Staffs only.");

    let user = m.mentions.users.first();
    if (!user) return m.channel.send("Please specify the target user by a mention.");
    let arr = m.content.split(" ").slice(2);
    if (!arr) return m.channel.send("Please specify the amount of undos");
    if (isInt(arr) === false) return m.channel.send("That's not an integer.");
    for (var i = 0; i < arr; i++){
    commands['/undo'](m);
  }
    showData(m, user, 'check');
  },
  '/unmute' : (m) => {
      var _flag = false;
      m.member.roles.filter( (role) => {
      console.log(role.name);
      if(role.name == "Staff member"){
        _flag = true;
      }});
    if (_flag == false) return m.channel.send("Staff Commands are limited to Staffs only.");

      let user = m.mentions.users.first();
      if (!user) return m.channel.send("Please specify the target user by a mention.");
      let id = user.id;
      m.guild.fetchMember(id).then((member) => {
      m.guild.roles.filter( role => {
        if(role.name == "Muted"){
          member.removeRole(role).then(() => console.log('done'));
        }});
      let embed = new Discord.RichEmbed()

      .setTitle('Moderator Action: Unmute.')
      //.addField('\u200b', '\u200b', true)
      .setColor(0xff0077)
      .setTimestamp()
      .addField('User', (`${member.user.tag}`), true)
      .addField('Moderator Responsible', (`${m.author.tag}`), true);

      bot.channels.get('313005765184978954').send({embed});
  });

},
  '/mute' : (m) => {
    // Syntax: staff --mute @mention [time in minutes] [reason]
      var _flag = false;
      m.member.roles.filter( (role) => {
        console.log(role.name);
        if(role.name == "Staff member"){
          _flag = true;
        }});
      if (_flag == false) return m.channel.send("Staff Commands are limited to Staffs only.");

      let user = m.mentions.users.first();
      if (!user) return m.channel.send("Please specify the target user by a mention.");
      let time;
      let arr = m.content.split(" ").slice(2);
      time = ((arr[0]) && isInt(arr[0])) ? (arr[0] * 60000) : 300000;
      console.log(time);
      let reason = (function(){
        // /mute @mention
        if (!(arr[0])) return "No reason specified";
        if ((!isInt(arr[0]) && (arr[0]))) return arr.join(" ");
        else return (arr[1]) ? arr.join(" ").split(" ").slice(1).join(" ") : "No reason specified";
      })();
      //console.log(4);
      let id = user.id;
      m.guild.fetchMember(id).then((member) => {
        //console.log(5);
        m.guild.roles.filter( role => {

          if(role.name.toLowerCase() == "muted"){
            member.addRole(role).then( () => {
              //console.log(6);
              let embed = new Discord.RichEmbed()

              .setTitle('Moderator Action: Mute.')
              //.addField('\u200b', '\u200b', true)
              .setColor(0xff7700)
              .setTimestamp()
              .addField('User', (`${member.user.tag}`), true)
              .addField('Time muted', (`${time / 60000} minutes.`), true)
              .addField('Reason', (reason), true)
              .addField('Moderator Responsible', (`${m.author.tag}`), true);

              bot.channels.get('313005765184978954').send({embed});
              try{
              setTimeout(function(){
                m.guild.fetchMember(id).then((member) => {
                  m.guild.roles.filter( role => {
                    if(role.name == "Muted"){
                      member.removeRole(role).then(() => console.log('done'));
                    }});
              });
            }, time);
          } catch (e) {
            console.log(e);
          }
          });
        }
      });
    });
  },
  '/ban' : (m) => {
    var _flag = false;
    m.member.roles.filter( (role) => {
      console.log(role.name);
      if(role.name == "Staff member"){
        _flag = true;
      }});
    if (_flag == false) return m.channel.send("Staff Commands are limited to Staffs only.");


    let user = m.mentions.users.first();
    if (!user) return m.channel.send("Please specify the target user by a mention.");
    let id = user.id;

    let reason = (m.content.split(" ").slice(2).join(" ")) ? (m.content.split(" ").slice(2).join(" ")) : "Unspecified.";

    let query = new Discord.RichEmbed()

    // .setTitle('Are you sure? | Ban')
    .setAuthor('Are you sure? | Ban', bot.user.avatarURL)
    .setThumbnail(`${user.avatarURL}`)
    .setTimeStamp()
    .setColor(0x0000ff)
    .addField('User', (`${user.tag}`), true)
    .addField('Moderator Responsible', (`${m.author.tag}`), true)
    .addField('Reason', reason, true)
    .setFooter("Type y to confirm ban. Anything else to cancel.");

    m.channel.send({embed: query});
    const collector = m.channel.createCollector(m => m);

    collector.on('collect',(msg) => {

      if (msg.content.toLowerCase === 'y'){
        var _flag = false;
        m.member.roles.filter( (role) => {
          console.log(role.name);
          if(role.name == "Staff member"){
            _flag = true;
          }});
        }
        if (_flag === false) return;
      if (_flag === true) {
        m.guild.fetchMember(id).then((member) => {
        member.ban(reason);
        let embed = new Discord.RichEmbed()
        .setAuthor('Moderator Action: Ban', msg.author.avatarURL)
        .setThumbnail(`${user.avatarURL}`)
        .setColor(0xff0000)
        .setTimeStamp()
        .addField('User', (`${user.tag}`), true)
        .addField('Moderator Responsible', (`${m.author.tag}`), true)
        .addField('Reason', reason, true)
        .setFooter("Do not break the rules. Else you'll end up like this.");
        bot.channels.get('313005765184978954').send({embed});

        embed = new Discord.RichEmbed()
        .setAuthor('Oops, you have been banned!', msg.author.avatarURL)
        .setThumbnail(`${user.avatarURL}`)
        .setColor(0xff0000)
        .setTimeStamp()
        .addField('User', (`${user.tag}`), true)
        .addField('Moderator Responsible', (`${m.author.tag}`), true)
        .addField('Reason', reason, true)
        .setFooter("Too bad for you!");
        user.send({embed});
      });
    } else m.channel.send("Action canceled.");
    collector.stop();
  });
},
 '!allrep' : (m) => {
   var _flag = false;
   m.member.roles.filter( (role) => {
     console.log(role.name);
     if(role.name == "Staff member"){
       _flag = true;
     }});
   if (_flag == false) return m.channel.send("Staff Commands are limited to Staffs only.");

   let user = m.mentions.users.first();
   if (!user) return m.channel.send("Please specify the target user by a mention.");
   let id = user.id;

   var dir = (`./users/${user.id}.json`);
   var file = require(dir);
   var array = file.feedback.slice(5);
   var content = (`
Username : ${user.tag}
Total Positive Reputation: ${file.plus}
Total Negative Reputation: ${file.minus}
Feedbacks:
  ${array.join("\n\t")}
`);

  fs.writeFile('./log.txt', content, (err) => {
    if (err) throw err;
  });

  m.author.send({
    files: ["./log.txt"]
  });
},
'/softban' : (m) => {
  var _flag = false;
  m.member.roles.filter( (role) => {
    console.log(role.name);
    if(role.name == "Staff member"){
      _flag = true;
    }});
  if (_flag == false) return m.channel.send("Staff Commands are limited to Staffs only.");


  let user = m.mentions.users.first();
  if (!user) return m.channel.send("Please specify the target user by a mention.");
  let id = user.id;

  let reason = (m.content.split(" ").slice(2).join(" ")) ? (m.content.split(" ").slice(2).join(" ")) : "Unspecified.";

  let query = new Discord.RichEmbed()

  // .setTitle('Are you sure? | Ban')
  .setAuthor('Are you sure? | Ban', bot.user.avatarURL)
  .setThumbnail(`${user.avatarURL}`)
  .setTimeStamp()
  .setColor(0x0000ff)
  .addField('User', (`${user.tag}`), true)
  .addField('Moderator Responsible', (`${m.author.tag}`), true)
  .addField('Reason', reason, true)
  .setFooter("Type y to confirm ban. Anything else to cancel.");

  m.channel.send({embed: query});
  const collector = m.channel.createCollector(m => m);

  collector.on('collect',(msg) => {

    if (msg.content.toLowerCase === 'y'){
      var _flag = false;
      m.member.roles.filter( (role) => {
        console.log(role.name);
        if(role.name == "Staff member"){
          _flag = true;
        }});
      }
      if (_flag === false) return;
    if (_flag === true) {
      m.guild.fetchMember(id).then((member) => {
      member.ban({
        days: 7,
        reason: reason}).then((gmember) => {
        setTimeout(function(gmember){
          var id = gmember.user.id;
          m.guild.unban(id);
        }, 20);
      });
      let embed = new Discord.RichEmbed()
      .setAuthor('Moderator Action: Softban', msg.author.avatarURL)
      .setThumbnail(`${user.avatarURL}`)
      .setColor(0xffdd00)
      .setTimeStamp()
      .addField('User', (`${user.tag}`), true)
      .addField('Moderator Responsible', (`${m.author.tag}`), true)
      .addField('Reason', reason, true)
      .setFooter("Softbanning is a combination of banning and unbanning in a short amount of time.");
      bot.channels.get('313005765184978954').send({embed});

      embed = new Discord.RichEmbed()
      .setAuthor('Oops, you have been softbanned!', msg.author.avatarURL)
      .setThumbnail(`${user.avatarURL}`)
      .setColor(0xffdd00)
      .setTimeStamp()
      .addField('User', (`${user.tag}`), true)
      .addField('Moderator Responsible', (`${m.author.tag}`), true)
      .addField('Reason', reason, true)
      .setFooter("Don't worry! You can still join back to the server using a valid invite link.");
      user.send({embed});
    });
  } else m.channel.send("Action canceled.");
  collector.stop();
});
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
  //  bot.channels.get("297408095137562625").send(`${member}, your data have been saved. Welcome!`);
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
  .setThumbnail(user.avatarURL)
  .setColor(color)
  .setTimestamp()
  // array - x = 5
  // [g]
  .addField('User', (`${user.username}#${user.discriminator}`))
  .addField('Feedback', (`\`\`\`xl
\"${file.feedback.slice((file.feedback.length <= 10) ? 5 : 5 + ((file.feedback.length - 5) - 5)).join("\"\n\"")}\"
\`\`\``))
  .addField('Point Count', (`+${file["plus"]} : -${file["minus"]}`))
  .addField('Percentage', (`${perc}%`), true);
//slice((file.feedback.length <= 5) ? 0 : file.feedback.length - 5)
// Current array length: 6. n - x = 5
  msg.channel.send({
    embed
  });
}
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function isInt(value) {
  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
}
