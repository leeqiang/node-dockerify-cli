// const debug = require('debug')('tbt:build')
const Task = require('../task')
const logger = require('../logger')

const publish = function (cmd, options) {
  logger.minfo('start publish image')
  const { app, env } = cmd
  if (app) {
    logger.minfo(`publish to ${env || 'dev'}`)
    const task = new Task()
    switch (env) {
      case 'production':
      case 'prod':
        task.publish(app)
        break
      default:
        task.publishDev(app)
    }
    logger.minfo('finish publish image')
  } else {
    logger.merror('app is reuqired')
  }
}

module.exports = publish
