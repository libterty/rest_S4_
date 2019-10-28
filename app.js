const express = require('express');
const handlebars = require('express-handlebars');
const db = require('./models');
const app = express();
const port = 3000;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// 設定 view engine 使用 handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.listen(port, () => {
    db.sequelize.sync();
    console.log(`Example app listening on port http://localhost:${port}`);
});

require('./routes')(app);