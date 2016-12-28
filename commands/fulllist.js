/*
const fs = require('fs');
var list = [];
var workingFile;

console.log(fs.readdirSync('./commands/Everyone/'));

function command(permission, commandText, commandResponse){
  this.permission = permission;
  this.commandText = commandText;
  this.commandResponse = commandResponse;
}

function generateList(){
  for (i=0; i < fs.readdirSync('./commands/Everyone/').length; i++){
    workingFile = (fs.readdirSync('./commands/Everyone/')[i]);




    //list[i][0] = fs.readFileSync(workingFile);
    //console.log(fs.readFileSync('./commands/Everyone/' + workingFile, 'utf8'));
    //list[i][0] = workingFile;
    //list[0][i] = fs.readFileSync('./commands/Everyone/' + workingFile, 'utf8');
    //list.push(workingFile, fs.readFileSync('./commands/Everyone/' + workingFile, 'utf8'));
    //console.log(list);
  }
}

generateList();
*/
var commands = '{ "Everyone" : [' +
'{ "!command":"Everyone Response" },' +
'{ "!command2":"Everyone Response2" },' +
'{ "!command3":"Everyone Response3" } ],' +
' "Moderator" : [' +
'{ "!mod":"Mod Response" },' +
'{ "!mod2":"Mod Response2" },' +
'{ "!mod3":"Mod Response3" } ],' +
' "Broadcaster" : [' +
'{ "!broad":"Broadcaster Response" },' +
'{ "!broad2":"Broadcaster Response2" },' +
'{ "!broad3":"Broadcaster Response3" } ]' +
'}';



//console.log(JSON.parse(commands));
//console.log(commands);
var exports = module.exports = {};

exports.allcommands = {
  commands: commands,
  //mod: mod,
  //broadcaster: broadcaster
}
