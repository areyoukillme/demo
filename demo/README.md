# pas-portal

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

> 代码默认遵循eslint(default)的规范 不习惯的可以在自己本地webpack.base.conf.js 关闭相应规则，但是请不要上传

> iview 组件地址： https://www.iviewui.com/docs/guide/install
> es6学习地址： http://es6.ruanyifeng.com/
> router : https://router.vuejs.org/zh-cn/essentials/nested-routes.html

## 项目结构
```bash
├─build                 // 打包环境
│
├─config                // 开发部署配置
│
├─node_modules          //安装包
│
├─src                   // 项目源文件
│  │  main.js           // 入口文件
│  ├─api                // 请求接口
│  │
│  ├─assets             // 组件静态资源
│  │  └─styles          // 样式
│  │      ├─base        // 基础样式
│  │      ├─cover       // iview覆盖样式
│  │      ├─layout      // 布局样式
│  │      └─variable    // 样式变量
│  │
│  ├─common             // 公共
│  │
│  │
│  ├─components
│  │  │
│  │  ├─layout          // 布局组件
|  |  |   common        // 公共布局组件
│  │  │      MainHeader // 主要头部
│  │  │      Container  // 主要的容器
│  │  │      CNav       // 左侧的导航
│  │  └─views           // 页面组件
│  │      Login         //登录页面
│  │      merchant      // 商户管理模块文件夹下面在建里面的子模块
│  │      ...
│  │
│  │
│  ├─router             // 路由管理
│  │
│  └─store              // 状态管理（各个模块之间状态的保存）
│
├─static                // 业务静态资源
│
│  .babelrc             // babel配置
│  .editorconfig        // editor配置
│  .gitignore           // git忽略配置
│  .eslintrc.js         // eslint配置
│  .postcssrc.js        // postcss配置
│  index.html           // 项目首页
│  package.json         // 依赖配置
│  prod.server.js       // 打包后启动文件



