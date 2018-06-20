const Task = require('../task')

const init = function (cmd) {
  const task = new Task()
  if (cmd.maintainer && cmd.app) {
    task.generateDockerfile(cmd.maintainer, cmd.app)
  }
  if (cmd.app && cmd.nodeport) {
    task.generateK8sAppYml(cmd.app, cmd.nodeport)
  }
  task.generate('.dockerignore')
}

module.exports = init
