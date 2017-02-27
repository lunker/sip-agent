var HEPjs = require('hep-js');

function HEPBuilder(){

  this.prepareMessage = function(tag, data, srcIp, srcPort, dstIp, dstPort, cid, datenow) {

    var message = {
      rcinfo: {
        type: 'HEP',
        version: 3,
        payload_type: 'SIP',
        ip_family: 2,
        protocol: 17,
        proto_type: 1,
        srcIp: srcIp,
        dstIp: dstIp,
        srcPort: srcPort,
        dstPort: dstPort,
        captureId: 'hep_id',
        capturePass: 'hep_pass',
        correlation_id: cid
      },
      payload: data
    };

    return message;
  };// end method

  this.generateHEPMessage = function(message){

    var rcinfo = message.rcinfo;
    var msg = message.payload;
    if (rcinfo.correlation_id == null || !(rcinfo.correlation_id.toString().length)) return;

    var hrTime = process.hrtime();
    var datenow = new Date().getTime();
    rcinfo.time_sec = Math.floor( datenow / 1000);
    rcinfo.time_usec = datenow - (rcinfo.time_sec*1000);

    if (! typeof msg === 'string' || ! msg instanceof String) msg = JSON.stringify(msg);
    var hep_message = HEPjs.encapsulate(msg.toString(),rcinfo);

    return hep_message;
  };
}


module.exports = new HEPBuilder();
