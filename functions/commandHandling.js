var fs = require('fs');
var commandListGenerator = require('./commandListGenerator.js');



//DO NOT MODIFY ANYTHING BELOW THE LINE!
//______________________________________________________
var exports = module.exports = {

  //**Pull the first word in a chat message, then return it as a string**
  commandChecker: function(userMessage){
    if (userMessage.charAt(0) !== '!') return null;
    var firstWord = [];
    for (var i=0;i<userMessage.length;i++){
      var word = userMessage[i].split(" ");
      firstWord.push(word[0]);
      return firstWord;
  }}
}
