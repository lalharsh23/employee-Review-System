// Import and connect to the database using the connect() function from './config/database'
require('./config/database').connect();

// Import necessary modules and create an instance of Express
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

// Destructure environment variables for PORT, MONGODB_URL, and SESSION_SECRET_KEY
const { PORT, MONGODB_URL, SESSION_SECRET_KEY } = process.env;

// Import Express EJS Layouts
const expressLayouts = require('express-ejs-layouts');

// Import modules for session management, authentication, and middleware
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

// Import MongoStore for session storage, flash for flash messages, and custom middleware
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Parse URL-encoded request bodies with body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Parse cookies with cookie-parser
app.use(cookieParser());

// Use Express EJS Layouts
app.use(expressLayouts);

// Set up the view engine as EJS and specify the views directory
app.set('view engine', 'ejs');
app.set('views', './views');

// Configure session management with express-session
app.use(
  session({
    name: 'employee-review-system',
    secret: SESSION_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URL,
      autoRemove: 'disabled',
    }),
    function(err) {
      console.log(err || 'connect-mongodb setup ok');
    },
  })
);

// Initialize and use Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set the authenticated user in the response
app.use(passport.setAuthenticatedUser);

//for static file use
app.use(express.static('./assets'));

// Use connect-flash for flash messages
app.use(flash());

// Middleware to set flash messages
app.use(customMware.setFlash);

// Use the routes defined in './routes'
app.use('/', require('./routes'));

// Start the server and listen on the specified PORT or default to 5000
app.listen(PORT || 5000, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${PORT}`);
});
