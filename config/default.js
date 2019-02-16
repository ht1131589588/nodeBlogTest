module.exports = {
  port: 80, // 程序启动要监听的端口号
  session: { // express-session 的配置信息
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2952000000,
  },
  // mongodb 的地址，以 mongodb:// 协议开头，myblog 为 db 名
  mongodb: 'mongodb://localhost:27017/myblog',
}
