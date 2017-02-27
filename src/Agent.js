var fs = require("fs");
var Patterns = require('./utils/Patterns.js');
var parser = require('./utils/Parser.js');
var networkManager = require('./utils/NetworkManager');
var hepBuilder = require('./hep/HEPBuilder');

var debug = false;

function watchFile(logSet){
  var path = logSet.path;
  // var currSize = 0;
  var currSize = (fs.statSync(path).size);

  console.log("["+new Date+"]"+ " Watching '"+path+"' ("+currSize+")");

  setInterval(function() {
    var newSize = fs.statSync(path).size;
    if (newSize > currSize) {
      readChanges(logSet, currSize, newSize);
      currSize = newSize;
    }
    else {
      if (newSize < currSize) {
        currSize = newSize;
      }
    }
  }, 1000);
}

// TODO:: FS logic 개선
function readChanges(logSet, from, to){
  var file = logSet.path;
  var tag = logSet.tag;
  var host = logSet.host;
  var pattern = logSet.pattern;

  // 이전까지 읽었던 부분부터 새롭게 추가된 log까지 읽는다.
  var rstream = fs.createReadStream(file, {
    encoding: 'utf8',
    start: from,
    end: to
  });

  rstream.on('data', function(chunk) {
    var last = "";
    var raw = last+chunk;

    start(raw);
  });// end file stream
}// end method

function start(data){

  // Parse
  var messages = parser.parse(data);

  var counts = messages.length;
  var hepMessage = null;

  // Send
  for(var idx=0; idx < counts; idx++){
    hepMessage = hepBuilder.generateHEPMessage(messages[idx]);
    networkManager.send(hepMessage);
  }
}

module.exports = {
  watchFiles:function(logs_config, callback_preHep) {

    debug = logs_config.debug;
    config = logs_config;

    for (var i = 0; i < logs_config.logs.length; i++) {
      watchFile(logs_config.logs[i]);
    }
  }
};
