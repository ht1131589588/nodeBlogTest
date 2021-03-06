const marked = require('marked');
const Comment = require('../lib/mongo').Comment;

// 将 Comment 的 content 从 markdown 转换为 html
Comment.plugin('contentToHtml', {
  afterFind (comments) {
    return comments.map(comment => {
      comment.content = marked(comment.content);
      return comment;
    })
  },
})

module.exports = {
  // 新建留言
  create(comment) {
    return Comment.create(comment).exec();
  },
  // 通过留言 id 获取一个留言
  getCommentById(commentId) {
    return Comment.findOne({ _id: commentId }).exec();
  },
  // 通过留言 id 删除一个留言
  delCommentById(commentId) {
    return Comment.deleteOne({ _id: commentId }).exec();
  },
  // 通过文章 id 删除该文章下所有留言
  delCommentsByPostId(postId) {
    return Comment.deleteMany({ postId: postId }).exec()
  },
  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getComments(postId) {
    return Comment
      .find({ postId: postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 通过文章 id 获取该文章下的留言数
  getCommentsCount(postId) {
    return Comment.count({ postId: postId }).exec();
  }
}
