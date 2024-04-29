const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const Helpers = require('./helpers');
const i18n = require('i18n')
const port = 5000
const rememberLogin = require('app/http/middleware/rememberLogin');
const methodOverride = require('method-override');
const { Server } = require('socket.io');


module.exports = class Application {
    constructor() {
        this.setupExpress();
        this.setMongoConnection();
        this.setConfig();
        this.setRouters();
    }

    setupExpress() {
        const server = http.createServer(app);
        const io = new Server(server);

        let onlineUsers = 0;

        // Socket.io connection
        io.on('connection', (socket) => {
            onlineUsers++; // Increment the number of online users

            // Broadcast the number of online users to all clients
            io.emit('updateUserCount', onlineUsers);

            // When a user disconnects
            socket.on('disconnect', () => {
                onlineUsers--; // Decrement the number of online users

                // Broadcast the number of online users to all clients
                io.emit('updateUserCount', onlineUsers);
            });
        });
        server.listen(port, () => console.log(`Listening on port ${port}`));
    }

    setMongoConnection() {
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://127.0.0.1:27017/asastech');
    }

    /**
     * Express Config
     */
    setConfig() {
        require('app/passport/passport-local');
        // require('app/passport/passport-google');

        app.use(express.static(config.layout.public_dir));
        app.use('/images', express.static('images'));
        app.set('view engine', config.layout.view_engine);
        app.set('views', config.layout.view_dir);
        app.use(config.layout.ejs.expressLayouts);
        app.set("layout extractScripts", config.layout.ejs.extractScripts);
        app.set("layout extractStyles", config.layout.ejs.extractStyles);
        app.set("layout", config.layout.ejs.master);


        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(methodOverride('_method'));
        app.use(validator());
        app.use(session({ ...config.session }));
        app.use(cookieParser('mysecretkey'));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(rememberLogin.handle);
        i18n.configure({
            locales: ['en', 'fa'],
            directory: config.layout.locales_directory,
            defaultLocale: 'fa',
            cookie: 'lang',
            objectNotation: true,
        });
        app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
            next();
        });

        app.use(i18n.init);
        app.use((req, res, next) => {
            app.locals = new Helpers(req, res).getObjects();
            next();
        });
    }

    setRouters() {
        app.use(require('app/routes/web'));
        // app.use(require('app/routes/errorHandler'));

    }
}