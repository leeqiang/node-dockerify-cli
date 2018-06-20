// const debug = require('debug')('tbt:build')
const Task = require('../task')
const logger = require('../logger')

const deploy = function (cmd, options) {
  logger.minfo('start deploy image')
  const { app, env } = cmd
  if (app) {
    logger.minfo(`deploy to ${env || 'dev'}`)
    const task = new Task()
    switch (env) {
      case 'production':
      case 'prod':
        task.deploy(app)
        break
      default:
        task.deployDev(app)
    }
    logger.minfo('finish deploy image')
  } else {
    logger.merror('app is reuqired')
  }
}

module.exports = deploy
