const fs = require('fs');
var everyoneArray, moderatorArray, broadcasterArray;

//DO NOT MODIFY ANYTHING BELOW THE LINE!
//______________________________________________________
var exports = module.exports = {
  everyone: function(){
    //CODE HERE
    everyoneArray = fs.readdirSync('./commands/Everyone/');
    return everyoneArray;
  },
  moderator: function(){
    //CODE HERE
    moderatorArray = fs.readdirSync('./commands/Mod Only/');
    return moderatorArray;
  },
  broadcaster: function(){
    //CODE HERE
    broadcasterArray = fs.readdirSync('./commands/Broadcaster/');
    return broadcasterArray;
  }
};
