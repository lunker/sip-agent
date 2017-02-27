var Patterns = require('./Patterns.js');
var Constants = require('./Constants');
var hepBuilder = require('../hep/HEPBuilder');

var Parser = function(){

  // parsing LOGFiles
  // params : LOG byte data
  // return : HEP Message Array
   this.parse = function(data){

    var result = [];
    var appLogChunks = data.match(Patterns.applicationLogPattern);

    if(appLogChunks != undefined && appLogChunks != null){

      var callId = null;
      var originalCallId = '';

      var srcIp = '';
      var srcPort = 0;
      var dstIp = '';
      var dstPort = 0;

      var counts = appLogChunks.length;
      var appLog = '';
      var sipMsg = null;

      // parse APP LOG Messages
      for(var index=0; index<counts; index++){

        appLog = appLogChunks[index].split(Patterns.applicationLogPrefixPattern)[Constants.APP_MESSAGE];

        callId = appLog.match(Patterns.SIPCallIdPattern);
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

        originalCallId = appLog.match(Patterns.SIPOriginalCallIdPattern);
        if(originalCallId != undefined && originalCallId != ''){
          if(originalCallId.length != 0){
            originalCallId = originalCallId[0].split('original_call_id:')[1];
            console.log('original_call_id :: ' + originalCallId);
          }
          else{
            console.log('no original call id');
            originalCallId = callId;
          }
        }
        else{
          console.log('no original call id');
          originalCallId = callId;
        }

        var terminalInfos = appLog.match(Patterns.terminalInfoPattern);
        if(terminalInfos != undefined && terminalInfos.length != null){

          // debug terminal info
          var srcInfo = ((terminalInfos[0].split('['))[1].split(']'))[0].split(':');
          var dstInfo = ((terminalInfos[1].split('['))[1].split(']'))[0].split(':');

          srcIp = srcInfo[0];
          srcPort = srcInfo[1];
          dstIp = dstInfo[0];
          dstPort = dstInfo[1];

          // get sip message
          sipMsg = appLog.split(Patterns.applicationLogSuffixPattern)[Constants.SIP_MESSAGE];

          // complete parse raw sip message
          // sipMsg :: raw sip message
          var message = hepBuilder.prepareMessage('tag', sipMsg, srcIp, srcPort, dstIp, dstPort, originalCallId, new Date().getTime());
          result.push(message);
        }
        else{
          console.log('terminal info parse error :: ' + terminalInfos);
        }// end of terminalinfo parse
      }// end loop :: handle Raw SIP message
    }
    else{
      console.log('split fail');
    }

    return result;
  };// end method

  var getAttribute = function(data, name){

  };
}

module.exports = new Parser();
