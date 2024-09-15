// Import the Express module, passport for authentication, and create a router instance
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Import controller modules for handling user-related and dashboard-related actions
const usersController = require('../controllers/users_controller');
const dashboardsController = require('../controllers/dashboard_controller');

// Define routes and associate them with controller functions

// GET request to '/' will be handled by the signIn function from the usersController
router.get('/', usersController.signIn);

// GET request to '/sign-up' will be handled by the signUp function from the usersController
router.get('/sign-up', usersController.signUp);

// GET request to '/sign-out' will be handled by the destroySession function from the usersController
router.get('/sign-out', usersController.destroySession);

// GET request to '/admin-dashboard' will be handled by the adminDashboard function from the dashboardsController
router.get('/admin-dashboard', dashboardsController.adminDashboard);

// GET request to '/employee-dashboard/:id' will be handled by the employeeDashboard function from the dashboardsController
router.get('/employee-dashboard/:id', dashboardsController.employeeDashboard);

// GET request to '/add-employee' will be handled by the addEmployee function from the usersController
router.get('/add-employee', usersController.addEmployee);

// GET request to '/edit-employee/:id' will be handled by the editEmployee function from the usersController
router.get('/edit-employee/:id', usersController.editEmployee);

// POST request to '/update-employee/:id' will be handled by the updateEmployee function from the usersController
router.post('/update-employee/:id', usersController.updateEmployee);

// POST request to '/create' will be handled by the create function from the usersController
router.post('/create', usersController.create);

// POST request to '/create-employee' will be handled by the createEmployee function from the usersController
router.post('/create-employee', usersController.createEmployee);

// POST request to '/create-session' uses Passport middleware to authenticate, and on failure, redirects to '/'
router.post(
  '/create-session',
  passport.authenticate('local', { failureRedirect: '/' }),
  usersController.createSession
);

// GET request to '/destroy/:id' will be handled by the destroy function from the usersController
router.get('/destroy/:id', usersController.destroy);

// Export the router to be used in other parts of your application
module.exports = router;
