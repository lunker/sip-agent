/*
HEPIPE-JS
(c) 2015 QXIP BV
For License details, see LICENSE

Edited by:
Giacomo Vacca <giacomo.vacca@gmail.com>
Federico Cabibbu <federico.cabiddu@gmail.com>
*/

var fs = require("fs");
var debug = false;

var preHep;
var config;

var hep_id;
var hep_pass;

function watchFile(logSet){
  var path = logSet.path;
  // var currSize = 0;
  var currSize = (fs.statSync(path).size);

  console.log("["+new Date+"]"+ " Watching '"+path+"' ("+currSize+")");

  var i, rgx;
  var patternList = [];

  if (logSet.pattern.constructor == Array) {
    for (i = 0; i < logSet.pattern.length; i++) {
      console.log("Processing pattern [" + logSet.pattern[i] +"]");
      rgx = new RegExp(logSet.pattern[i], "");
      patternList.push(rgx);
    }
  } else {
    console.log("Processing pattern [" + logSet.pattern +"]");
    rgx = new RegExp(logSet.pattern, "");
    patternList.push(rgx);
  }

  setInterval(function() {
    var newSize = fs.statSync(path).size;
    if (newSize > currSize) {
      readChanges(logSet, patternList, currSize, newSize);
      currSize = newSize;
    }
    else {
      if (newSize < currSize) {
        currSize = newSize;
      }
    }
  }, 1000);
}

function readChanges(logSet, patternList, from, to){
  console.log('[readChanges()]');
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
    //
    var pattern = new RegExp('(\\[RECEIVED\\]:|\\[SENT\\]:)\n(.*\r\n)*','g');

    var splitMsg = raw.match(pattern);

    if(splitMsg != undefined && splitMsg != null){
      var counts = splitMsg.length;
      var sipMsg = null;
      var currentDate = null;
      var sipMessagePattern = new RegExp('\\[SENT\\]:|\\[RECEIVED\\]:','g');
      var srcInfoPattern = new RegExp('\\[SENT\\]:|\\[RECEIVED\\]:','g');
      var destInfoPattern = new RegExp('\\[SENT\\]:|\\[RECEIVED\\]:','g');
      var callIdPattern = new RegExp('Call-ID:.*','g');
      var callId = null;

      for(var index=0; index<counts; index++){
        // sipMsg = splitMsg[index];
        // console.log("Before Erase prefix result : " + sipMsg);
        sipMsg = splitMsg[index].split(prefixPattern)[1];

        callId = sipMsg.match(callIdPattern);
        if(callId != undefined && callId != null){
          if(callId.length != 0){
            callId = callId[0].split('Call-ID:')[1];
          }
          else{
            console.log('no call-id');
          }
        }
        else{
          console.log('no call-id');
        }

        var message = prepareMessage(tag, sipMsg, callId, host, new Date().getTime());
        preHep(message);
      }
    }
    else{
      console.log('split fail');
    }
  });
}

function prepareMessage(tag, data, cid, host, datenow) {
  if (debug) console.log('CID: ' + cid + ' DATA:' + data);

  var t_sec = Math.floor(datenow / 1000);

  var message = {
    rcinfo: {
      type: 'HEP',
      version: 3,
      payload_type: 'SIP',
      ip_family: 2,
      protocol: 17,
      proto_type: 1,
      srcIp: '127.0.0.1',
      dstIp: '127.0.0.1',
      srcPort: 0,
      dstPort: 0,
      captureId: hep_id,
      capturePass: hep_pass,
      correlation_id: cid
    },
    payload: data
  };

  return message;
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
