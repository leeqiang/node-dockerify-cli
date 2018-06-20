const logger = require('graceful-logger')
const moment = require('moment')

logger.minfo = function () {
  const args = Array.prototype.slice.call(arguments)
  logger.info.apply(logger, [moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')].concat(args))
}

logger.merror = function () {
  const args = Array.prototype.slice.call(arguments)
  logger.error.apply(logger, [moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')].concat(args))
}

module.exports = logger
