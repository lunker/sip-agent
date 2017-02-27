var Patterns = function(){

    this.applicationLogPattern = new RegExp('(\\[RECEIVED\\]|\\[SENT\\])(\\[([0-9]{1,3}\\.?){4,4}:[0-9]{1,5}\\]){2,2}\n(.*\r\n)*','g');
    this.applicationLogPrefixPattern = new RegExp('\\[SENT\\]|\\[RECEIVED\\]','g');
    this.applicationLogSuffixPattern = new RegExp('\\]\n','g');

    this.terminalInfoPattern = new RegExp('\\[([0-9]{1,3}\\.?){4,4}:[0-9]{1,5}\\]','g');
    this.SIPCallIdPattern = new RegExp('Call-ID:.*','g');
    this.SIPOriginalCallIdPattern = new RegExp('original_call_id:.*','g');
};

module.exports = new Patterns();
