// Import the Express module and create a router instance
const express = require('express');
const router = express.Router();

// Import the reviewsController module from '../controllers/review_controller'
const reviewsController = require('../controllers/review_controller');

// Define routes and associate them with controller functions

// POST request to '/assign-review/:id' will be handled by the assignReview function from the reviewsController
router.post('/assign-review/:id', reviewsController.assignReview);

// POST request to '/create/:id' will be handled by the submitReview function from the reviewsController
router.post('/create/:id', reviewsController.submitReview);

// POST request to '/update-review/:id' will be handled by the updateReview function from the reviewsController
router.post('/update-review/:id', reviewsController.updateReview);

// Export the router to be used in other parts of your application
module.exports = router;
