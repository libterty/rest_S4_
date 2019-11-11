const commentService = require('../../services/commentService');

const commentController = {
  getComments: (req, res) => {
    commentService.getComments(req, res, data => {
      return res.json(data);
    });
  },

  postComment: (req, res) => {
    commentService.postComment(req, res, data => {
      return res.json(data);
    });
  },

  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, data => {
      return res.json(data);
    });
  }
};
module.exports = commentController;
