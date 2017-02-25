function HEPBuilder(){

  this.prepareMessage = function(tag, data, srcIp, srcPort, dstIp, dstPort, cid, datenow) {
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
        srcIp: srcIp,
        dstIp: dstIp,
        srcPort: srcPort,
        dstPort: dstPort,
        captureId: hep_id,
        capturePass: hep_pass,
        correlation_id: cid
      },
      payload: data
    };

    return message;
  }// end method
}


module.exports = new HEPBuilder();
