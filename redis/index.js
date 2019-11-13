const redis = require('redis');

class BlackList {
  constructor(url) {
    this.url = url;
    this.client = redis.createClient(this.url);
    this.data = [];
  }

  connect() {
    this.client.on('connect', () => console.log('Redis client connected'));
    this.client.on('error', err => console.log(`Redis error ${err}`));
  }

  addList(token) {
    this.client.lpush('blacklist', token);
  }

  getList() {
    return this.client.hgetall('blacklist', function(err, data) {
      if (err) throw err;
      return function(callback) {
        callback(data);
      };
    });
  }

  debug() {
    this.client.lrange('blacklist', 0, -1, (err, data) => {
      if (err) throw err;
      console.log('BlackList :', data);
    });
  }
}

module.exports = BlackList;
