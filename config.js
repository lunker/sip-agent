var config = {
  hep_config: {
    debug: true,
    HEP_SERVER: '58.229.204.201',
    HEP_PORT: 10852
  },
  logs_config: {
    debug: true,
    HEP_PASS: 'multipass',
    HEP_ID: 2232,
    logs: [
      {
        tag : 'opus_decoder',
        host : '127.0.0.1',
        pattern: '.*\[(SENT|RECEIVED)\]:\n',
        path : '/Users/voiceloco/Downloads/load-balancer.log.1'
      }
    ]
  }
};

module.exports = config;
