'use strict';

const Discord = require('discord.js'),
bot = new Discord.Client(),
fs = require('fs'),
datadir = "./users";

bot.login('MjY4NzgwODQ1OTg3Mzk3NjQy.C1fxMA.wRDQDEGSFBLRvALnelqnZszg2PU');

const commands = {
  '+rep' : (msg) => {
    console.log('TTTT');
  },
  '-rep' : (msg) => {

  },
  '!rep' : (msg) => {

  },
  '/register' : (msg) => {

  }
};
bot.on('ready', () => {
  console.log("READY!");
});
bot.on('message', (msg) => {
  // Gets message content, split it, then take in the first keyword and checks if it's valid.
  if (commands.hasOwnProperty(msg.content.split(" ")[0])) return commands[msg.content.split(" ")[0]](msg);
});
