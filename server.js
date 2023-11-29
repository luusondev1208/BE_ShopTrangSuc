const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

const app = express()
const port = process.env.PORT || 5000

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ANGULAR_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({ secret: 'sha5', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

dbConnect()
initRoutes(app)
app.use('/', (req, res) => { res.send('SERVER ONNNNN') })

app.listen(port, () => {
    console.log('Server running rồi đó <3 port : ' + port);
})