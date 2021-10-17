var log4js = require('log4js');
log4js.configure({
  appenders: {
    console:{ type: 'console' },
    errorLogs:{ type: 'file', filename: './error.log', category: 'error' }
  },
     categories: {

        default: {appenders: ['console', 'errorLogs'], level: 'info'}

    }
});
var logger = log4js.getLogger('default');

module.exports = logger;
