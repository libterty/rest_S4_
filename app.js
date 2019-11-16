const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const Handlebars = require('handlebars');
const H = require('just-handlebars-helpers');
const cors = require('cors');
const BlackList = require('./redis');
const app = express();
const port = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const blackList = new BlackList(REDIS_URL);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

blackList.connect();

// 設定 view engine 使用 handlebars
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
  })
);
app.set('view engine', 'handlebars');
app.use(cors());
app.use('/upload', express.static(__dirname + '/upload'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  res.locals.user = req.user;
  next();
});
app.use(methodOverride('_method'));
H.registerHelpers(Handlebars);

const server = app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

require('./routes')(app);

module.exports = server;
