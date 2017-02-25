var config = {
  hep_config: {
    debug: true,
    HEP_SERVER: '58.229.204.201',
    HEP_PORT: 10852,
    HEP_PROTO:'TCP'
  },
  logs_config: {
    debug: true,
    HEP_PASS: 'multipass',
    HEP_ID: 2232,
    logs: [
      {
        tag : 'lb_parser',
        host : '127.0.0.1',
        pattern: '.*\[(SENT|RECEIVED)\]:\n',
        path : '/Users/voiceloco/Downloads/test-log.log'
      }
    ]
  }
};

module.exports = config;
