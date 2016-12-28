//**Establishes important variables**
var tmi = require('tmi.js'); //Twitch API
var creds = require('./config/credentials.js'); //Login/OAuth/authentication stuff
var social = require('./config/socialmedia.js'); //Social media usernames for easy reference
var commandListGenerator = require('./functions/commandListGenerator.js'); //Command master list function generator (may change in the future)
var fileOpener = require('./functions/fileOpener.js'); //Functions to read files and return their contents
var commandHandling = require('./functions/commandHandling.js'); //Contains the functions for generating the list of commands
const fs = require('fs'); //Allows filesystem access

//**Making easier variables to work with**
var speakingChannel = creds.twitchLoginInfo.channels[0]; //indicates the channel that the bot will speak in
var userType; //Will hold the user type of the speaking user: null = normal; broadcaster = channel owner; etc...
var activeCommand; //Holds the command being actively processed
var commandResponse; //Will hold the string containing the response that the bot will say
var everyoneCommands, modCommands, modOnlyCommands, broadcasterCommands, broadcasterOnlyCommands; //Holds the arrays containing the list of commans, separated by permissions

//**Functions that need to have global access**
function rebuildCommandDatabase(){ //**Build the command database and separate it off based on permissions**
  everyoneCommands = commandListGenerator.everyone();
  modOnlyCommands = commandListGenerator.moderator();
  broadcasterOnlyCommands = commandListGenerator.broadcaster();

  modCommands = everyoneCommands.concat(modOnlyCommands);
  broadcasterCommands = modCommands.concat(broadcasterOnlyCommands); //Generates complete list of available commands for each permission level

  console.log("Database refreshed and updated successfully.");
}
function commandChecker(userMessage){ //**Pull the first word in a chat message, then return it as a string**
  if (userMessage.charAt(0) !== '!') return null;
  var firstWord = [];
  for (var i=0;i<userMessage.length;i++){
    var word = userMessage[i].split(" ");
    firstWord = userMessage.split(" ", 1);
    //console.log("console log word: " + word);
    activeCommand = firstWord.toString();
    activeCommand = activeCommand.toLowerCase(); //Converts activeCommand to lowercase, so it's not case sensitive
    //console.log("console log activeCommand: " + activeCommand);
    console.log(activeCommand);
    return firstWord;
  }
}
function searchCommand(commandToSearch){ //**Confirms the permission level and folder path of the requested command**
  //console.log(everyoneCommands.indexOf(commandToSearch.toString()));
  //console.log(modOnlyCommands.indexOf(commandToSearch.toString()));
  //console.log(broadcasterOnlyCommands.indexOf(commandToSearch.toString()));
  //console.log("searchCommand has been called " + commandToSearch);
  if(everyoneCommands.indexOf(commandToSearch.toString()) !== -1 && userType >= 1) return 'Everyone';
  if(modOnlyCommands.indexOf(commandToSearch.toString()) !== -1 && userType >= 2) return 'Mod Only';
  if(broadcasterOnlyCommands.indexOf(commandToSearch.toString()) !== -1 && userType >= 4) return 'Broadcaster';
}
function directoryPermission(permissionLevel){ //**Returns the directory associated with the permission level of a new command**
  var permissionDirectory;
  if (permissionLevel == 1) { permissionDirectory = "Everyone";
 } else if (permissionLevel == 2) { permissionDirectory = "Mod Only";
 } else if (permissionLevel == 4) { permissionDirectory = "Broadcaster";
 } else {permissionDirectory = null;
 }
 return permissionDirectory;
}
function convertStringToEachWord(input){ //**Converts a string into an array of each word in the string**
  var partialString;
  var arrayOfString = input.split(" ");
  return arrayOfString;
  //console.log(convertArrayToString(arrayOfString, 3));
}
function convertArrayToString(arrayToConvert, indexToStartFrom){ //***Converts an array from the convertStringToEachWord() function back into normal text**
  var returnString = "";
  for (i=indexToStartFrom; i < arrayToConvert.length; i++){
    returnString = returnString.concat(arrayToConvert[i]) + " ";
  }
  return returnString;
}
function writeCommand(commandInput, permissionLevel, commandResult){ //**Writes command to specified file and assigns appropriate permission**
  var permissionDirectory = directoryPermission(permissionLevel);
 if (permissionDirectory !== null) {
  fs.writeFile('./commands/' + permissionDirectory + '/' + commandInput, commandResult, function(err){
    if (err) {
      return console.error(err);
    }
    console.log("Command Saved!");
    rebuildCommandDatabase();
  })
} else { return;}}
function deleteCommand(commandToDelete){ //**Deletes the specified command from the correct directory**
  fs.unlink('./commands/' + searchCommand(commandToDelete) + '/' + commandToDelete);
  return "Command " + commandToDelete + " has been successfully deleted from the database."
}
function editCommand(commandToEdit, commandToEditContent){
  var permissionDirectory = searchCommand(commandToEdit);
  if (permissionDirectory !== null) {
  fs.writeFile('./commands/' + searchCommand(commandToEdit) + '/' + commandToEdit, commandToEditContent, function(err){
    if (err) {
      return console.error(err);
    }
    //console.log("Command Edited!");
    rebuildCommandDatabase();
  })} else {return;}
  return "Command " + commandToEdit + " has been successfully edited and the database has been reloaded."
}



//**Initialization functions**
rebuildCommandDatabase(); //Invokes the function to build the command database


//**Connect the bot and listen for commands**
var twitchClient = new tmi.client(creds.twitchLoginInfo);
twitchClient.connect();

twitchClient.on("chat", function(channel, user, message, self){ //Listening for chat events
  if (commandChecker(message) !== null){ //Checks to see if the messsage contains a command

    if (user.username == creds.twitchLoginInfo.username) return; //Prevent bot from responding to iteself
    if (user.badges == null){ //Checks if the speaking user is not special at all
      console.log("Speaker is not special in any way.");
      userType = 1;
      if (searchCommand(activeCommand) !== undefined){ //Checks if the command is valid
        twitchClient.say(speakingChannel, fileOpener.readResponse(searchCommand(activeCommand), commandChecker(message)).toString());
      }
    }
    else if (user.badges.moderator == 1){ //Checks if the speaking user is a moderator
      console.log("Speaker is a Moderator.");
      userType = 2;
      if (searchCommand(activeCommand) !== undefined){ //Checks if the command is valid
        if (activeCommand == '!addcommand' || activeCommand == '!addcomm') { //Checks if !addcommand is being called
          //console.log("command add requested");
          var commandToWriteInfo = convertStringToEachWord(message); //Stores the message in individual words, for easy reference later
          //commandToWriteInfo[1]==Command to write; commandToWriteInfo[2]==permission level; commandToWriteInfo[3+]== text to write to the command
          if(commandToWriteInfo[1].charAt(0)== "!" && commandToWriteInfo[2]<= 4 && commandToWriteInfo.length >= 4){
            //Write command runs here
            //console.log("command add context correct");
            var commandToWriteResponse = convertArrayToString(commandToWriteInfo, 3); //Saves *only* the response into a variable to pass into the write function.
            writeCommand(commandToWriteInfo[1].toLowerCase(), commandToWriteInfo[2], commandToWriteResponse); //runs the writeCommand function to actually save the command and makes it lowercase
            twitchClient.say(speakingChannel, "Command " + commandToWriteInfo[1] + " has been successfully added to the database!");
          }
          else {
            twitchClient.say(speakingChannel, "Correct usage for !addcommand: '!addcommand [!CommandToAdd] [Permission Level 1-4] [Whatever you want the command to say]'");
          }


          //console.log(writeCommand(message);
          //activeCommand =
          //console.log(convertStringToEachWord(message)); //Converts each word of the user's message into a separate entry in an array
          //console.log(convertStringToEachWord(message)[1]); //Calls the second word in the message
          //writeCommand()
        }
        else if (activeCommand == '!editcommand' || activeCommand == '!editcomm') {
          var commandWeAreEditingInThisFunction = convertStringToEachWord(message)[1].toLowerCase(); //Stores the command that we are attempting to edit
          if (modCommands.indexOf(commandWeAreEditingInThisFunction) !== -1){
            //EDIT COMMAND CODE HERE
            var commandToEditInfo = convertStringToEachWord(message);
            if(commandToEditInfo[1].charAt(0)== "!" && commandToEditInfo.length >= 3){ //Verifies that the command is in the right context
              var commandToEditResponse = convertArrayToString(commandToEditInfo, 2); //Converts the array of the command back into a string
              twitchClient.say(speakingChannel, editCommand(commandWeAreEditingInThisFunction, commandToEditResponse)); //Runs the command edit function
            }
            else {
              twitchClient.say(speakingChannel, "Correct usage for !editcommand: '!editcommand [!CommandToEdit] [Whatever you want the command to say]'");
            }

          }
        }
        else if (activeCommand == '!removecommand' || activeCommand == '!delcomm') { //Checks if !removecommand is being called
          var commandToRemove = convertStringToEachWord(message)[1].toLowerCase(); //Stores the command that we are attempting to remove
         if(modCommands.indexOf(commandToRemove) !== -1){
           twitchClient.say(speakingChannel, deleteCommand(commandToRemove)); //Runs the command delete function and replies in chat to confirm a successful deletion
         }}
        else if (activeCommand == '!refresh') { //Checks if !refresh is being called
          rebuildCommandDatabase();
          twitchClient.say(speakingChannel, "Command list has been refreshed");
        }
        else { //Checks for all other commands
          twitchClient.say(speakingChannel, fileOpener.readResponse(searchCommand(activeCommand), commandChecker(message)).toString());
        }}
      //if(modCommands.indexOf(commandChecker(message).toString()) == -1) return;
      //commandResponse = fileOpener.readResponse(userType, commandHandling.commandChecker(message)).toString();
      //twitchClient.say(speakingChannel, user["display-name"] + " this is a test message." + Math.random());
      //twitchClient.say(speakingChannel, "[STRING RESPONSE HERE]" + Math.random());
      //KEEP THIS ONE twitchClient.say(speakingChannel, fileOpener.readResponse(userType, commandChecker(message)).toString());
    }
    else if (user.badges.premium == 1){ //Checks if the speaking user is a Prime/Turbo user
      console.log("Speaker is Prime or Turbo.");
    }
    else if (user.badges.broadcaster == 1){ //Checks if the speaking user is the broadcaster
      console.log("Speaker is the Broadcaster.");
      userType = 4;
      if (searchCommand(activeCommand) !== undefined){ //Checks if the command is valid
        twitchClient.say(speakingChannel, fileOpener.readResponse(searchCommand(activeCommand), commandChecker(message)).toString()); //Compiles a combination of the !command and folder path into a string, then says the text inside the file.
      }
    }
    else {console.log ("I have no idea what just happened.");
  }
 }
 //if (message=="!twitter") {twitchClient.action(speakingChannel, social.twitter.url);}
  //twitchClient.action(speakingChannel, user["display-name"] + " this is a test message." + Math.random());
})

//**Runs upon connection to chat**
twitchClient.on("connected", function(address, port){
  console.log("Address: " + address + " Port: " + port);
  twitchClient.say(speakingChannel, "TacBot2 is now online.");

console.log("Command list: " + broadcasterCommands);
//console.log("App.js: " + fileOpener.readResponse('Mod Only', '!modtest2'));
/*
console.log("Broadcaster ONLY commands: " + broadcasterOnlyCommands);
console.log("Moderators ONLY commands: " + modOnlyCommands);
console.log("Everyone ONLY commands: " + everyoneCommands);
console.log("Broadcaster has access to: " + broadcasterCommands);
console.log("Moderators have access to: " + modCommands);
console.log("Everyone has access to: " + everyoneCommands);
*/
  //console.log(creds.twitchLoginInfo.identity.username);
  //console.log(creds.twitchLoginInfo.identity.password);
  //twitchClient.action("tacbackup", social.twitter.url);
  //console.log(twitchClient.action);
});
