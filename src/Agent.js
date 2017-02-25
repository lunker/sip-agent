/*
HEPIPE-JS
(c) 2015 QXIP BV
For License details, see LICENSE

Edited by:
Giacomo Vacca <giacomo.vacca@gmail.com>
Federico Cabibbu <federico.cabiddu@gmail.com>
*/

var fs = require("fs");
var Patterns = require('./utils/Patterns.js');
var parser = require('./utils/Parser.js');
var debug = false;

var preHep;
var config;
var hep_id;
var hep_pass;

function watchFile(logSet){
  var path = logSet.path;
  var currSize = 0;
  // var currSize = (fs.statSync(path).size);

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
    data = chunk.trim();
    var lines, i, j;

    var raw = last+chunk;

    var messages = parser.parse(raw);
    return;

  });// end file stream
}// end method

module.exports = {
  watchFiles:function(logs_config, callback_preHep) {
    preHep = callback_preHep;
    debug = logs_config.debug;
    config = logs_config;
    hep_id = config.HEP_ID;
    hep_pass = config.HEP_PASS;

    for (var i = 0; i < logs_config.logs.length; i++) {
      watchFile(logs_config.logs[i]);
    }
  }
};
