// Import the Express module and create a router instance
const express = require('express');
const router = express.Router();

// Log a message when this router module is reloaded
console.log('router reloaded');

// Use the 'users' route defined in './users' for requests at the root path '/'
router.use('/', require('./users'));

// Use the 'reviews' route defined in './reviews' for requests at the '/review' path
router.use('/review', require('./reviews'));

// Export the router to be used in other parts of your application
module.exports = router;
