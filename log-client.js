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

    // lines = (last+chunk).split("\n"); // 한줄씩 들어가게됨. . . . .
    // var pattern = /(?:(\[RECEIVED\]|\[SENT\]))(.*\r\n)*/g;// keep2
    // var pattern = /(?:\[RECEIVED\]:\n|\[SENT\]:\n)(.*\r\n)*/g;

    var raw = last+chunk;
    var pattern = new RegExp('(\\[RECEIVED\\]:|\\[SENT\\]:)\n(.*\r\n)*','g');

    var splitMsg = raw.match(pattern);

    if(splitMsg != undefined && splitMsg != null){
      // console.log('matched array :: ' + splitMsg.length);
      console.log('split success');
    }
    else{
      console.log('split fail');
    }

    var counts = splitMsg.length;
    var sipMsg = null;
    var currentDate = null;
    var prefixPattern = new RegExp('\\[SENT\\]:|\\[RECEIVED\\]:','g');
    var callIdPattern = new RegExp('Call-ID:','g');
    var callId = null;

    for(var index=0; index<counts; index++){
      sipMsg = splitMsg[index];
      // console.log("Before Erase prefix result : " + sipMsg);
      sipMsg = splitMsg[index].split(prefixPattern)[1];
      // callId = sipMsg.match();

      // console.log("After Erase prefix result : " + sipMsg[1]);
      var message = prepareMessage(tag, sipMsg, '12', host, new Date().getTime());
      preHep(message);
    }

    //===================================================
    //===================================================
    //===================================================

/*
1차 성공본 :: using String.split

    while(flag){
      splittedMessage = raw.split(pattern);
      if(splittedMessage != undefined && splittedMessage != null){
        if(splittedMessage.length == 1){
          // pattern not found
          flag = false;
        }
        else{
          // pattern found
          console.log("SIP message:: \n" + splittedMessage[1]);
        }
      }
    }

    splittedMessage = raw.split(pattern);
    if(splittedMessage != undefined && splittedMessage != null){
      console.log("splitted message size :: " + splittedMessage.length);
      // console.log("splitted message[0]:: \n" + splittedMessage[0]);// 필요없는 부분
      // console.log("splitted message[1]:: " + splittedMessage[1]);
      // console.log("splitted message[2]:: \n" + splittedMessage[2]);


      for (var index=1; index < splittedMessage.length; index+=2){
        console.log("SIP message :: \n" + splittedMessage[index]);
      }
    }
    else{
      console.log('no match');
    }
*/

/*
// default source

    lines = (last+chunk).split("\n"); // 한줄씩 들어가게됨. . . . .
    console.log("[readChanges()] splited lines :: \n" + lines);
    for(i = 0; i < lines.length - 1; i++) {
      var datenow =  new Date().getTime();
//      stats.rcvd++;
      for (j = 0; j < patternList.length; j++) {
        var cid = (lines[i]).match(patternList[j]);
        if (cid != undefined && cid[1] != undefined ) {
//        stats.parsed++;
          var message = prepareMessage(tag, lines[i], cid[1], host, datenow);
          preHep(message);
	  break;
        }
      }// end inner loop
    }// end outter loop
*/
  });
}

function prepareMessage(tag, data, cid, host, datenow) {
  // if (debug) console.log('CID: ' + cid + ' DATA:' + data);

  var t_sec = Math.floor(datenow / 1000);

  var message = {
    rcinfo: {
      type: 'HEP',
      version: 3,
      payload_type: 100,
      time_sec: t_sec,
      time_usec: (datenow - (t_sec*1000))*1000,
      ip_family: 2,
      protocol: 6,
      proto_type: 100,
      srcIp: '127.0.0.1',
      dstIp: '127.0.0.1',
      srcPort: 0,
      dstPort: 0,
      captureId: hep_id,
      capturePass: hep_pass,
      correlation_id: '12'
    },
    payload: data
  };

  return message;
}
