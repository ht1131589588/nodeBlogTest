const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
mongolass.connect(config.mongodb);

// 根据 id 生产创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function(results) {
    results.forEach(function (item){
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function (result) {
    if(result){
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
})

// 用户模型结构
exports.User = mongolass.model('User', {
  name: { type: 'string', required: true }, // 用户名
  password: { type: 'string', required: true },// 密码
  avatar: { type: 'string', required: true },// 头像
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },// 性别
  bio: { type: 'string', required: true } // 个人简介
});

exports.User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一

// 文章模型结构
exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId, required: true },// 作者id
  title: { type: 'string', required: true },// 标题
  content: { type: 'string', required: true },// 正文
  pv: { type: 'number', default: 0 } // 点击量
})

exports.Post.index({ author: 1, _id: -1 }).exec() // 按创建时间降序查看用户的文章列表

// 留言板模型结构设计
exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId, required: true }, // 作者 id
  content: { type: 'string', required: true }, // 留言内容
  postId: { type: Mongolass.Types.ObjectId, required: true }, // 关联文章 id
})

exports.Comment.index({ postId: 1, _id: 1 }) // 通过文章 id 获取该文章下所有留言，按留言创建时间升序

