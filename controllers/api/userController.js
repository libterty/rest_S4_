const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../models');
const userService = require('../../services/userService');
const User = db.User;

let userController = {
  signIn: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: "required fields didn't exist"
      });
    }
    let username = req.body.email;
    let password = req.body.password;

    User.findOne({ where: { email: username } }).then(user => {
      if (!user)
        return res.status(401).json({
          status: 'error',
          message: 'no such user found or passwords did not match'
        });
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'no such user found or passwords did not match'
        });
      }
      var payload = { id: user.id, iat: Date.now() };
      var token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    });
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' });
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' });
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
            return res.json({ status: 'success', message: '成功註冊帳號！' });
          });
        }
      });
    }
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.json(data);
    });
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.json(data);
    });
  },

  editUser: (req, res) => {
    userService.editUser(req, res, data => {
      return res.json(data);
    });
  },

  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      return res.json(data);
    });
  },

  addFavorite: (req, res) => {
    userService.addFavorite(req, res, data => {
      return res.json(data);
    });
  },

  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, data => {
      return res.json(data);
    });
  },

  addLike: (req, res) => {
    userService.addLike(req, res, data => {
      return res.json(data);
    });
  }
};

module.exports = userController;
