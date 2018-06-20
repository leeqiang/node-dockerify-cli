#!/usr/bin/env node

const program = require('commander')
const { build, deploy, clean, init } = require('./commands')
const pkg = require('../package')
const logger = require('./logger')

program.version(pkg.version)
  .usage('<command>')

program.command('build')
  .alias('b')
  .description('Build an image from a Dockerfile')
  .option('-a, --app <app>', 'the application name')
  .action(build)

program.command('deploy')
  .alias('d')
  .description('Deploy a new stack or update an existing stack')
  .option('-a, --app <app>', 'the application name')
  .option('-e, --env <env>', 'the env where app to deploy to')
  .action(deploy)

program.command('clean')
  .alias('c')
  .description('Clean Dummy')
  .option('-a, --app <app>', 'the application name, tdt will clean APP images')
  .action(clean)

program.command('init')
  .alias('i')
  .option('-a, --app <app>', 'the application name')
  .option('-m, --maintainer <maintainer>', 'Specific MAINTAINER for Dockerfile')
  .option('-p, --nodeport <nodeport>', 'Specific NodePort for k8s.app.yml')
  .description('Geneate the Dockerfile, .dockerignore, k8s.app.yml')
  .action(init)

program.parse(process.argv)

if (!process.env.K8S_LOCAL_REGISTRY ||
  !process.env.K8S_PRODUCTION_REGISTRY ||
  !process.env.K8S_NAMESPACE
) {
  logger.error('Please set Enviroment Variables, if you are nodejs engineer')
  logger.info('K8S_LOCAL_REGISTRY      = registry.teambition.corp')
  logger.info('K8S_PRODUCTION_REGISTRY = docker-registry.teambition.net')
  logger.info('K8S_NAMESPACE           = ng')
}

if (!process.argv.slice(2).length) {
  program.outputHelp()
}