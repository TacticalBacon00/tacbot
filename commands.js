var everyoneJSON = require('./commands/fulllist.js');
//var modJSON  = require('./commands/fulllist.js');
//var broadcasterJSON = require('./commands/fulllist.js');

var everyone = JSON.stringify(everyoneJSON);
//console.log(everyone)
var mod;
var broadcaster;

//console.log(everyoneJSON);


//DO NOT MODIFY ANYTHING BELOW THE LINE!
//______________________________________________________
var exports = module.exports = {};

exports.allcommands = {
  everyone: everyoneJSON,
  mod: mod,
  broadcaster: broadcaster
}
