var dgram = require('dgram');
var socket = dgram.createSocket("udp4");
var config = require('../../config/config.js').hep_config;

var NetworkManager = function(){

  this.hepSocket = null;
  this.hepServerIp = '';
  this.hepServerPort = 0;

  this.init = function(){
    this.hepServerIp = config.HEP_SERVER;
    this.hepServerPort = config.HEP_PORT;

    this.hepSocket = dgram.createSocket("udp4");
    console.log('create hep socket');
  };
  
  // param : encoded HEP Message
  this.send = function(hepMessage){
    socket.send(hepMessage, 0, hepMessage.length, this.hepServerPort, this.hepServerIp, function(err) {
      console.log('send HEP message');
    });
  }
};

var instance = new NetworkManager();
instance.init();
module.exports = instance;
