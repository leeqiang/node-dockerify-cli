// const debug = require('debug')('tbt:build')
const Task = require('../task')

const build = function (cmd, options) {
  const task = new Task()
  const { app } = cmd
  task.clean(app)
}

module.exports = build
