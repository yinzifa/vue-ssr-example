const http = require('http');
const hostname = global.hostname;
const port = global.port;
let tokenStr = "";

/*获取图形验证码*/
let getAuthCoedFn = async (ctx, next) => {
  let data = await asyncGetAuthCode();
  ctx.set("Content-Type", "application/json");
  ctx.body = JSON.parse(data);
  next();
};
function asyncGetAuthCode() {
  return new Promise((resolve, reject)=> {
    let authCodedData = "";
    let req = http.request({
      path: '/api/backstage/authCode',
      port: port,
      method: 'GET',
      hostname: hostname
    },(res)=> {
      res.on('data', (chunk)=> {
        authCodedData += chunk
      });
      res.on('end', ()=> {
        authCodedData = JSON.stringify(authCodedData)
        resolve(authCodedData)
      })
    });
    req.on("error", (e)=> {
      console.log("api:/backstage/authCode error")
      reject(e.message)
    });
    req.end();
  })
}

/*登录*/
let loginFn = async (ctx, next) => {
  let param = ctx.request.body;
  let authcodekey = ctx.request.header.authcodekey;
  let postData = {
    userName: param.userName,
    authCode: param.authCode,
    password: param.password
  };
  let loginData = await asyncPostLogin(authcodekey, JSON.stringify(postData));
  ctx.set("Content-Type", "application/json");
  ctx.set("Connection", "keep-alive");
  ctx.body = JSON.parse(loginData);
  next()
};
function asyncPostLogin(authcodekey, postData) {
  return new Promise((resolve, reject)=> {
    let loginData = "";
    let req = http.request({
      path: '/api/backstage/login',
      port: port,
      method: 'POST',
      hostname: hostname,
      headers: {
        'Content-Type': 'application/json',
        'authCodeKey': authcodekey
      }
    },(res)=> {
      res.on('data', (chunk)=> {
        loginData += chunk
      }).on('end', ()=> {
        loginData = JSON.stringify(loginData);
        tokenStr = res.headers['set-cookie'];
        resolve(loginData)
      })
    });
    req.on('error', (e)=> {
      console.log("api:/backstage/login error");
      reject(e.message)
    });
    req.write(postData);
    req.end();
  })
}

/*获取菜单及权限列表*/
let getPowerListFn = async (ctx, next) => {
  let menuList = await asyncGetPowerList();
  ctx.body = JSON.parse(menuList);
  next()
};
function asyncGetPowerList() {
  return new Promise((resolve, reject)=> {
    let listData = "";
    let req = http.request({
      path: '/api/backstage/getPowerList',
      method: 'get',
      port: port,
      hostname: hostname,
      headers: {
        'Cookie': tokenStr.toString()
      }
    },(res)=> {
      res.on('data', (chunk)=> {
        listData += chunk;
      }).on('end', ()=> {
        listData = JSON.stringify(listData);
        resolve(listData)
      })
    });
    req.on("error", (e)=> {
      console.log("api: /backstage/getPowerList error");
      reject(e.message)
    });
    req.end()
  })
}


module.exports = {
  'GET/api/backstage/authCode': getAuthCoedFn,
  'POST/api/backstage/login': loginFn,
  'GET/api/backstage/getPowerList': getPowerListFn
}
