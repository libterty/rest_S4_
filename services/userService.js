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
  },

  editUser: (req, res, callback) => {
    return User.findByPk(req.params.id).then(user => {
      callback({ user });
    });
  },

  putUser: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" });
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Upload Img Error: ', err.message);
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
            .then(user => {
              callback({
                status: 'success',
                message: `${user.name} was successfully update to date`,
                user: user.id
              });
            })
            .catch(err => {
              callback({
                status: 'error',
                message: err.message
              });
            });
        });
      });
    } else {
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            image: user.image
          })
          .then(user => {
            callback({
              status: 'success',
              message: `${user.name} was successfully update to date`,
              user: user.id
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
  },

  addFavorite: async (req, res, callback) => {
    const isFavorited = await Favorite.findAll({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      return favorite;
    });

    console.log('isFav', isFavorited.length);

    if (isFavorited.length !== 0) {
      return callback({ status: 'error', message: 'Bad Request' });
    } else {
      return Favorite.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }).then(() => {
        Restaurant.findByPk(req.params.restaurantId)
          .then(restaurant => {
            restaurant
              .update({
                favCounts: restaurant.favCounts ? restaurant.favCounts + 1 : 1
              })
              .then(() => {
                callback({
                  status: 'success',
                  message: 'Adding to your favorite lists'
                });
              })
              .catch(err => {
                callback({
                  status: 'error',
                  message: err.message
                });
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
  },

  removeFavorite: async (req, res, callback) => {
    const isRemoved = await Favorite.findAll({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(remove => {
      return remove;
    });

    if (isRemoved.length === 0) {
      return callback({ status: 'error', message: 'Bad Request' });
    } else {
      return Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      }).then(favorite => {
        favorite
          .destroy()
          .then(() => {
            Restaurant.findByPk(req.params.restaurantId)
              .then(restaurant =>
                restaurant.update({
                  favCounts: restaurant.favCounts ? restaurant.favCounts - 1 : 0
                })
              )
              .catch(err => {
                callback({
                  status: 'error',
                  message: err.message
                });
              });
            callback({
              status: 'success',
              message: 'Removing from your favorite lists'
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
  },

  addLike: async (req, res, callback) => {
    const isLiked = await Like.findAll({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      return like;
    });

    if (isLiked.length !== 0) {
      return callback({ status: 'error', message: 'Bad Request' });
    } else {
      return Like.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
        .then(() => {
          callback({
            status: 'success',
            message: 'Adding to your like lists'
          });
        })
        .catch(err => {
          callback({
            status: 'error',
            message: err.message
          });
        });
    }
  }
};

module.exports = userService;
