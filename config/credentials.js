//This stores
var twitchInfo = {
username: "TacBot2",
//username: "TacticalBacon00",
//oauthKey: "oauth:nod7wifyq69y406evp829lqng7juml",
oauthKey: "oauth:528zqw538nshwnyj2up9yep2rc4k3w",
channelToJoin: ["tacbackup"] //You can add additional channels by putting them in quotes and separating them with a comma
}










//DO NOT MODIFY ANYTHING BELOW THE LINE!
//______________________________________________________
var exports = module.exports = {};

exports.twitchLoginInfo = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: twitchInfo.username,
    password: twitchInfo.oauthKey
  },
  channels: twitchInfo.channelToJoin
}
