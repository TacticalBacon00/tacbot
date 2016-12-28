const fs = require('fs');
var fileContents;

//DO NOT MODIFY ANYTHING BELOW THE LINE!
//______________________________________________________
var exports = module.exports = {
  readResponse: function(permissionLevel, command){
    fileContents = fs.readFileSync(('./commands/' + permissionLevel + "/" + command));
    return fileContents;
  },
  readFunction: function(){
    //CODE HERE
  }

// otherCodeToExport: returnResultHere{}
}
