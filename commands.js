var url = require("url");
var http = require("http");
var https = require("https");
var querystring = require("querystring");

var Cleverbot = require("./cleverbot");
var cleverbot = new Cleverbot();

var countdown = {
  channel: "C03QGP7PW",
  message: null,
  interval: null,
  js: require("./lib/countdown.js")
};

module.exports = function(bot, slack){
  /*
  bot.addCommand("dozer countdown", "Show a countdown to CodeDay!", function(msg, args, channel, username){
    var cd = slack.getChannelGroupOrDMByID(countdown.channel);

    if(args[0] === "stop"){
      cd.send("Stopping countdown...");
      clearInterval(countdown.interval);
      slack._apiCall("chat.delete", {ts: countdown.message, channel: countdown.channel});
    }else{
      var codeDay = new Date();

      codeDay.setTime(1432407600*1000);

      cd.send("[countdown_start]");

      countdown.interval = setInterval(function(){
        if(countdown.message){
          // console.log("Tick " + countdown.message);
          slack._apiCall("chat.update", {ts: countdown.message, channel: countdown.channel, text: countdown.js(codeDay).toString()});
        }
      }, 1000);
    }
  });
  */

  bot.addCommand("dozer help", "Show this help.", function(msg, args, channel, username){
    var message = "I'm dozer, the Saints Robotics Spontaneous Self-Operating System. Here's what I can do:";
    for(var i in bot.commands){
      var command = bot.commands[i];
      message += "\n" + command.trigger + " - " + command.help;
    }
    bot.sendMessage(message, channel);
  });

  bot.addCommand("dozer ready", "Ready.", function(msg, args, channel, username){
    bot.sendMessage("Ready.", channel);
  });

  /*
  bot.addTrigger(/(regional manager|rm|evangelist) for ([A-z ]+)/gi, function(msg, matches, channel, username){
    if(matches[2]){
      matches[2] = matches[2].replace(/CodeDay/gi, "").trim();
      switch(matches[1].toLowerCase()){
        case "regional manager":
          getRegionalManager(msg, matches[2].split(" "), channel, username, bot);
          break;
        case "rm":
          getRegionalManager(msg, matches[2].split(" "), channel, username, bot);
          break;
        case "evangelist":
          getEvangelist(msg, matches[2].split(" "), channel, username, bot);
          break;
      }
    }else{
      bot.sendMessage("To search for an Evangelist/RM, use either `dozer rm [region]` or `dozer evangelist [region]`.", channel);
    }
  });
  */

  bot.on('unknownResponse', function(msg, channel, username, extra){
    if(msg.indexOf("dozer") === 0){
      cleverbot.write(msg.substr(3).trim(), channel, function(d){
        bot.sendMessage(d.message.replace(/Cleverbot/gi, "dozer"), channel);
      });
    }
  });

  slack.on('open', function(){
    slack.ws.on('message', function(message){
      message = JSON.parse(message);
      if(message.text && message.text === "[countdown_start]" && message.ok){
        console.log("Countdown message ts: " + message.ts);
        countdown.message = message.ts;
      }
    });
  });
};
