const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const apiControler = require('./apiControler');

// const webpack = require('webpack'); // webpack模块
// const config = require('../build/webpack.dev.conf'); // 开发环境模块
// 中间件容器，把webpack处理后的文件传递给一个服务器
// const devMiddleware = require('./middleware/devmiddleware');
// const hotMiddleware = require('./middleware/hotmiddleware');
const koaStatic = require('koa-static');
// let compiler;

let app = new Koa();
global.hostname = "172.16.100.15";
global.port = 8070;

//既然导出的是promise，那就用相应的方式来处理就好了
// config.then(function(s){
  // compiler = webpack(s);
  // app.use(devMiddleware(compiler));
  // app.use(hotMiddleware(compiler));
// });

app.use(async (ctx, next) => {
  await next();
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
});

app.use(koaStatic(path.join(__dirname, "../dist")));

//bodyParser必须在router之前注册到app上
app.use(bodyParser());

app.use(apiControler());

app.listen(8099);

