const path = require('path')
const {execSync} = require('child_process')
const {EventEmitter} = require('events')
const logger = require('./logger')
const fs = require('fs')
const moment = require('moment')

class Task extends EventEmitter {
  /**
   * @desc 获取 git commit hash
   */
  getCommitTag () {
    const commitTag = execSync('git rev-parse HEAD').toString().trim()
    logger.minfo(`set commitTag = ${commitTag}`)
    return commitTag
  }

  /**
   * @desc 获取当前时间
   */
  getTimeTag () {
    const timeTag = moment().format('YYYY-MM-DDTHH:mm:ssZ')
    logger.minfo(`set timeTag = ${timeTag}`)
    return timeTag
  }

  /**
   * @desc 从 package.json 中获取当前发布服务的版本号
   */
  getPackageVersion () {
    logger.minfo('set application version')
    const pkg = require(`${process.cwd()}/package.json`)
    return pkg.version
  }

  preDocker () {
    logger.minfo('preDocker, generate dummy with package.json & yarn.lock')
    ;[
      'rm -rf dummy',
      'mkdir -p dummy',
      `cat package.json | sed 's/^  "version":.*$/  "version": "1.0.0",/' > dummy/package.json`,
      'cat yarn.lock > dummy/yarn.lock'
    ].map(execSync)
  }

  afterDocker () {
    logger.minfo('afterDocker, rm dummy & version.json')
    ;[
      'rm -rf dummy',
      'rm -rf version.json'
    ].map(execSync)
  }

  before () {
    process.chdir(process.cwd())
  }

  /**
   * @desc 打包 docker image
   * @param {String} registry 仓库地址
   * @param {String} group 所属空间
   * @param {String} application 服务名称
   * @example tbt build -r registr.b.com -g node -a abc-app
   */
  build (appname) {
    const registry = process.env.K8S_LOCAL_REGISTRY
    const namespace = process.env.K8S_NAMESPACE

    this.before()

    const COMMIT = this.getCommitTag()
    const TIME = this.getTimeTag()
    const PACKAGE_VERSION = this.getPackageVersion()

    const COMMIT_IMAGE = `${registry}/${namespace}/${appname}:${COMMIT}`
    const IMAGE = `${registry}/${namespace}/${appname}:v${PACKAGE_VERSION}`

    this.preDocker()

    const version = JSON.stringify({ TIME: TIME, COMMIT: COMMIT })
    logger.minfo(`Generate version.json = ${version}`)
    fs.writeFileSync('version.json', version)

    logger.minfo(`Exec docker build, image hash = ${COMMIT_IMAGE}`)
    execSync(`docker build -t ${COMMIT_IMAGE} .`)

    logger.minfo(`Exec docker tag, image tag = ${PACKAGE_VERSION}`)
    execSync(`docker tag ${COMMIT_IMAGE} ${IMAGE}`)

    this.afterDocker()
  }

  /**
   * @desc 部署到 k8s
   */
  deploy (appname) {
    const localRegistry = process.env.K8S_LOCAL_REGISTRY
    const productionRegistry = process.env.K8S_PRODUCTION_REGISTRY
    const namespace = process.env.K8S_NAMESPACE

    this.before()

    const PACKAGE_VERSION = this.getPackageVersion()

    const LOCAL_IMAGE = `${localRegistry}/${namespace}/${appname}:v${PACKAGE_VERSION}`
    const REMOTE_IMAGE = `${productionRegistry}/${namespace}/${appname}:v${PACKAGE_VERSION}`

    execSync(`docker tag ${LOCAL_IMAGE} ${REMOTE_IMAGE}`)
    execSync(`docker push ${REMOTE_IMAGE}`)
  }

  /**
   * @desc 部署到开发环境
   */
  deployDev (appname) {
    const registry = process.env.K8S_LOCAL_REGISTRY
    const namespace = process.env.K8S_NAMESPACE

    this.before()
    const COMMIT = this.getCommitTag()
    const COMMIT_IMAGE = `${registry}/${namespace}/${appname}:${COMMIT}`

    execSync(`docker push ${COMMIT_IMAGE}`)
    execSync(`cat k8s.app.yml | sed -e "s/COMMIT/${COMMIT}/g" | kubectl apply -f -`)
  }

  /**
   * @desc 清除本服务产生的文件
   * @param {String} appname 服务名称
   */
  clean (appname) {
    this.before()

    if (appname) {
      logger.minfo(`Clean Images: ${appname} && none`)
      execSync(`docker images | grep ${appname} | awk '{s=$1":"$2; print s}' | xargs docker rmi`)
      execSync(`docker images | grep none | awk '{print $3}' | xargs docker rmi`)
      logger.minfo(`Clean Images: ${appname} && none, Done`)
    }

    this.afterDocker()
  }

  /**
   * @desc 生成文件
   * @param {String} fileName 文件名
   * @example tbt g .dockerignore
   */
  generate (fileName) {
    this.before()

    logger.minfo(`Generate file: ${fileName}`)

    const getFilePath = path.resolve(__dirname, `./templates/${fileName}.template`)
    execSync(`cp ${getFilePath} ${fileName}`)

    logger.minfo(`Generate file: ${fileName}, Done`)
  }

  /**
   * @desc 生成 Dockerfile
   * @param {String} maintainer "Smith <smith@smith.com>"
   * @param {String} appname "服务名称"
   * @example tbt g -m "LeeQiang <leesumiir#gmail.com>" -a hello-app
   */
  generateDockerfile (maintainer, appname) {
    this.before()
    logger.minfo('Generate file: Dockerfile')

    const getFilePath = path.resolve(__dirname, `./templates/Dockerfile.template`)
    const fileString = fs.readFileSync(getFilePath).toString()
    const newFileString = fileString
      .replace(/MAINTAINER/g, `"${maintainer}"` || '')
      .replace(/APP_NAME/g, appname || '')
    fs.writeFileSync('Dockerfile', newFileString)

    logger.minfo('Generate file: Dockerfile, Done')
  }

  /**
   * @desc 生成 k8s.app.yml
   * @param {String} appname "服务名称"
   * @param {String} namespace "服务空间"
   * @param {String} nodeport "外部暴露端口"
   * @example tbt g -n ng -p 40000 -a hello-app
   */
  generateK8sAppYml (appname, nodeport) {
    const registry = process.env.K8S_LOCAL_REGISTRY
    const namespace = process.env.K8S_NAMESPACE

    this.before()
    logger.minfo('Generate file: k8s.app.yml')

    const getFilePath = path.resolve(__dirname, `./templates/k8s.app.yml.template`)
    const fileString = fs.readFileSync(getFilePath).toString()
    const newFileString = fileString
      .replace(/REGISTRY/g, registry || '')
      .replace(/APP_NAME/g, appname || '')
      .replace(/NAMESPACE/g, namespace || '')
      .replace(/NODE_PORT/g, nodeport || '')
    fs.writeFileSync('k8s.app.yml', newFileString)

    logger.minfo('Generate file: k8s.app.yml, Done')
  }
}

module.exports = Task
