const bcrypt = require('bcryptjs');
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

const userController = {
  signInPage: (req, res) => {
    return res.render('signin');
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    req.user.dataValues.isAdmin
      ? res.redirect('/admin/restaurants')
      : res.redirect('/restaurants');
  },

  signUpPage: (req, res) => {
    return res.render('signup');
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！');
      return res.redirect('/signup');
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！');
          return res.redirect('/signup');
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            )
          }).then(() => {
            req.flash('success_messages', '成功註冊帳號！');
            return res.redirect('/signin');
          });
        }
      });
    }
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      if (req.params.id) {
        Comment.findAll().then(comments => {
          let userComment = [];
          comments.map(comment => {
            if (comment.dataValues.UserId === Number(req.params.id)) {
              userComment.push(comment.dataValues);
            }
          });
          const id = userComment.map(c => c.RestaurantId);
          Restaurant.findAll({
            where: {
              id: {
                [Op.in]: id
              }
            }
          }).then(restlists => {
            return res.render('users', { user, userComment, restlists });
          });
        });
      }
    });
  },

  getTopUser: (req, res) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }));
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      return res.render('topUser', { users });
    });
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('create', { user });
    });
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist");
      return res.redirect('back');
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
              req.flash(
                'success_messages',
                `${user.name} successfully to update`
              );
              res.redirect(`/users/${user.id}`);
            });
        });
      });
    } else {
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name
          })
          .then(user => {
            req.flash(
              'success_messages',
              `${user.name} successfully to update`
            );
            res.redirect(`/users/${user.id}`);
          });
      });
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      Restaurant.findByPk(req.params.restaurantId).then(restaurant => {
        restaurant
          .update({
            favCounts: restaurant.favCounts ? restaurant.favCounts + 1 : 1
          })
          .then(() => {
            return res.redirect('back');
          });
      });
    });
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      favorite.destroy().then(() => {
        Restaurant.findByPk(req.params.restaurantId).then(restaurant =>
          restaurant.update({
            favCounts: restaurant.favCounts ? restaurant.favCounts - 1 : 0
          })
        );
        return res.redirect('back');
      });
    });
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return res.redirect('back');
    });
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      like.destroy().then(() => {
        return res.redirect('back');
      });
    });
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(() => {
      return res.redirect('back');
    });
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy().then(() => {
        return res.redirect('back');
      });
    });
  }
};

module.exports = userController;
