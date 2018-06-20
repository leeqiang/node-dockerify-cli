NodeJS Dockerify CLI - NodeJS 项目 Dockerify 命令行工具
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
ndc -h

Usage: ndc <command>

Options:

  -V, --version               output the version number
                              输出当前版本号
  -a, --app <app>             the application name
                              指定应用名称
  -h, --help                  output usage information
                              获取帮助信息

Commands:

  build|b                    Build an image from a Dockerfile
                             编译镜像
  publish|p                  Publish a new image to registry
                             发布镜像
  deploy|d                   Deploy a new stack or update an existing stack
                             部署镜像(目前仅支持部署到本地的k8s)
  clean|c                    Clean Dummy
                             清理过期文件及镜像
  init|i                     Geneate the Dockerfile, .dockerignore, k8s.app.yml
                             初始化默认文件
```

## 生成默认的 Dockerfile & .dockerignore & k8s.app.yml
```
ndc init -m MAINTAINER -a APP_NAME -p NODE_PORT
```

## 生成镜像
```
ndc build -a APP_NAME
```

## 发布到开发 registry
```
ndc publish -a APP_NAME -e dev
```

## 发布到生产的 registry
```
ndc publish -a APP_NAME -e prod|production
```

## 部署到开发环境的 k8s
```
ndc deploy -a APP_NAME
```

## 清理
```
ndc clean
```

若指定服务名称，则同时会清除相关的镜像及`none`的镜像
```
ndc clean -a APP_NAME
```
