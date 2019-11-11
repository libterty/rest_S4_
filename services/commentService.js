const db = require('../models');
const Comment = db.Comment;

const commentService = {
  getComments: (req, res, callback) => {
    return Comment.findAll().then(comments => {
      callback({ comments });
    });
  },

  postComment: (req, res, callback) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then(() => {
        callback({
          status: 'success',
          message: 'Comment was successfully created'
        });
      })
      .catch(err => {
        callback({
          status: 'error',
          message: err.message
        });
      });
  },

  deleteComment: (req, res, callback) => {
    return Comment.findByPk(req.params.id).then(comment => {
      comment
        .destroy()
        .then(comment => {
          callback({
            status: 'success',
            message: 'Comment was successfully delete',
            comment
          });
        })
        .catch(err => {
          callback({
            status: 'error',
            message: err.message
          });
        });
    });
  }
};

module.exports = commentService;
