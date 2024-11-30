[![npm version](https://img.shields.io/npm/v/reaux-scripts.svg?style=flat)](https://www.npmjs.com/package/reaux-scripts)

## reaux-scripts
reaux-scripts 是一个为 React 项目提供默认配置的工具集，旨在简化开发、构建和部署的流程。它提供了对 React 项目的常见配置和脚本支持，避免了手动配置 Webpack、Babel 等工具，开发者只需专注于编写代码，其他配置和构建过程由 reaux-scripts 自动处理。

### 主要功能
- 开发服务器：启动一个本地开发服务器，支持热重载。
- 构建工具：自动配置 Webpack、Babel 等工具，用于打包和优化 React 应用。
- 暴露配置：通过 eject 命令暴露 Webpack 和其他工具的配置，便于自定义。

### 安装
```bash
npm i reaux-scripts -g
```

### 使用
```bash
reaux-scripts dev ## 应用启动
reaux-scripts build ## 应用打包
reaux-scripts eject ## 暴露配置
```

如果使用 .ts 或 .tsx 文件，请确保在项目根目录下新建 tsconfig.json 文件来配置 TypeScript 编译选项。

在使用 pnpm 作为包管理工具时，默认的依赖管理策略可能会导致某些依赖无法正确解析。为了确保依赖能够正常解析并按预期工作，在未执行 `pnpm reaux-scripts eject` 之前，需要使用 `pnpm install --shamefully-hoist` 命令强制提升依赖至项目根目录，从而避免潜在的解析问题。

### 环境变量
ASSET_PREFIX: 静态资源前缀
PORT: 端口号
SOURCE_DIR: 资源目录
STATIC_SOURCE_DIR: 静态资源目录
