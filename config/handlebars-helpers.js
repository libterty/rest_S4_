'use strict';
const moment = require('moment');

module.exports = {
  moment: function(a) {
    return moment(a).fromNow();
  },
  replace: function(a) {
    return a.replace(/@example.com/g, '');
  }
};
