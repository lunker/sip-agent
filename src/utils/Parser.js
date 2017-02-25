var Patterns = require('./Patterns.js');
var Constants = require('./Constants');

var Parser = function(){

  // parsing LOGFiles
  // params : LOG byte data
  // return : HEP Message Array
   this.parse = function(data){

    var appLogChunks = data.match(Patterns.applicationLogPattern);

    if(appLogChunks != undefined && appLogChunks != null){

      // for(var idx=0; idx < appLogChunks.length; idx++){console.log('test parsed result ::\n' + appLogChunks[idx]);}

      var callIdPattern = new RegExp('Call-ID:.*','g');

      var callId = null;
      var srcIp = '';
      var srcPort = 0;
      var dstIp = '';
      var dstPort = 0;

      var counts = appLogChunks.length;
      var appLog = '';
      var sipMsg = null;

      // parse APP LOG Messages
      for(var index=0; index<counts; index++){
        console.log(Constants.APP_MESSAGE);
        appLog = appLogChunks[index].split(Patterns.applicationLogPrefixPattern)[Constants.APP_MESSAGE];
        console.log('test appLog :: \n' + appLog);

        callId = appLog.match(callIdPattern);
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

// ======================================

        var terminalInfos = appLog.match(Patterns.terminalInfoPattern);
        if(terminalInfos != undefined && terminalInfos.length != null){

          // debug terminal info
          var srcInfo = terminalInfos[0].split(":");
          var dstInfo = terminalInfos[1].split(":");

          srcIp = srcInfo[0];
          srcPort = srcInfo[1];
          dstIp = dstInfo[0];
          dstPort = dstInfo[1];

          // get sip message
          sipMsg = appLog.split(Patterns.applicationLogSuffixPattern)[Constants.SIP_MESSAGE];
          console.log('test sip message :: \n' + sipMsg);
          // complete parse raw sip message
          // sipMsg :: raw sip message
          return ; // test for break;

          var message = prepareMessage(tag, sipMsg, srcIp, srcPort, dstIp, dstPort, callId, new Date().getTime());
          preHep(message);
        }
        else{
          console.log('terminal info parse error :: ' + terminalInfos);
        }
      }// end loop :: handle Raw SIP message
    }
    else{
      console.log('split fail');
    }

  };// end method

  var getAttribute = function(data, name){

  }
}

module.exports = new Parser();
