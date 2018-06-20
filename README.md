NodeJS Dockerify CLI
========================

## 支持
- [x] 打包/发布镜像
- [x] 初始化 Dockerfile, .dockerignore, k8s.app.yml
- [ ] 友好的输出（stdout / stderr）

## 安装
```
npm i -g node-dockerify-cli
```

## 配置环境变量
```
export K8S_LOCAL_REGISTRY=[local-registry-domain]
export K8S_PRODUCTION_REGISTRY=[production-registry-domain]
export K8S_NAMESPACE=[namespace]
```

## CLI

```
tdt -h

Usage: tdt <command>

Options:

  -V, --version               output the version number
  -a, --app <app>             the application name
  -h, --help                  output usage information

Commands:

  build|b                    Build an image from a Dockerfile
  deploy|d                   Deploy a new stack or update an existing stack
  clean|c                    Clean Dummy
  init|i                     Geneate the Dockerfile, .dockerignore, k8s.app.yml
```

## 生成默认的 Dockerfile & .dockerignore & k8s.app.yml
```
tdt init -m MAINTAINER -a APP_NAME -p NODE_PORT
```

## 生成镜像
```
tdt build -a APP_NAME
```

## 发布到开发环境
```
tdt deploy -a APP_NAME -e dev
```

## 发布到生产的 registry
```
tdt deploy -a APP_NAME -e prod|production
```

## 清理
```
tdt clean
```

若指定服务名称，则同时会清除相关的镜像及`none`的镜像
```
tdt clean -a APP_NAME
```
