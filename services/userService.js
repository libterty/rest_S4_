const imgur = require('imgur-node-api');
const Sequelize = require('sequelize');
const IMGUR_CLIENT_ID = process.env.imgur_id;
const db = require('../models');
const User = db.User;
const Comment = db.Comment;
const Restaurant = db.Restaurant;
const Favorite = db.Favorite;
const Like = db.Like;
const Followship = db.Followship;
const Op = Sequelize.Op;

const userService = {
  getUser: (req, res, callback) => {
    let userComment = [];
    let userFavorite = [];
    return User.findByPk(req.params.id).then(user => {
      if (req.params.id) {
        Comment.findAll().then(comments => {
          Favorite.findAll().then(favorites => {
            favorites.map(f => {
              if (f.dataValues.UserId === Number(req.params.id)) {
                userFavorite.push(f.dataValues);
              }
            });
            comments.map(c => {
              if (c.dataValues.UserId === Number(req.params.id)) {
                userComment.push(c.dataValues);
              }
            });
            const userFavId = userFavorite.map(f => f.RestaurantId);
            const userCommentId = userComment.map(c => c.RestaurantId);
            Restaurant.findAll({
              where: {
                id: {
                  [Op.in]: userCommentId
                }
              }
            }).then(restComLists => {
              Restaurant.findAll({
                where: {
                  id: {
                    [Op.in]: userFavId
                  }
                }
              }).then(restFavLists => {
                Followship.findAll().then(follows => {
                  let followerId = [];
                  let followingId = [];
                  follows
                    .map(f => ({ ...f.dataValues }))
                    .map(c => {
                      if (c.followerId === user.id) {
                        followingId.push(c.followingId);
                      }
                      if (c.followingId === user.id) {
                        followerId.push(c.followerId);
                      }
                    });
                  User.findAll().then(users => {
                    let followers = [];
                    let followings = [];
                    users
                      .map(u => ({ ...u.dataValues }))
                      .map(c => {
                        followerId.map(f =>
                          f === c.id ? followers.push(c) : null
                        );
                        followingId.map(f =>
                          f === c.id ? followings.push(c) : null
                        );
                      });
                    callback({
                      user,
                      userComment,
                      userFavorite,
                      restComLists,
                      restFavLists,
                      followers,
                      followings
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  },

  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }));
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      callback({ users });
    });
  }
};

module.exports = userService;
