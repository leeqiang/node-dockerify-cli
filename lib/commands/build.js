// const debug = require('debug')('tbt:build')
const Task = require('../task')
const logger = require('../logger')

const build = function (cmd, options) {
  logger.minfo('start build image')
  const { app } = cmd
  if (app) {
    const task = new Task()
    task.build(app)
    logger.minfo('finish build image')
  } else {
    logger.merror('app is reuqired')
  }
}

module.exports = build
