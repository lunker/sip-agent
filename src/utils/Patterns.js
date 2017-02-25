var Patterns = function(){

    this.applicationLogPattern = new RegExp('(\\[RECEIVED\\]|\\[SENT\\])(\\[(\d{0,3}.)*\\])\n(.*\r\n)*','g');
    this.applicationLogPrefixPattern = new RegExp('\\[SENT\\]|\\[RECEIVED\\]','g');
    this.applicationLogSuffixPattern = new RegExp('\\]\n','g');

    this.terminalInfoPattern = new RegExp('\\[([0-9]{1,3}\\.?){4,4}:[0-9]{1,5}\\]','g');
    this.SIPCallIdPattern = new RegExp('Call-ID:.*','g');

};

module.exports = new Patterns();
