// Import the 'Review' and 'User' models
const Review = require('../models/review');
const User = require('../models/user');

// Controller function to render the admin dashboard
module.exports.adminDashboard = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // Check if the authenticated user has the 'admin' role
      if (req.user.role === 'admin') {
        // Populate all users from the database, including their 'username' field
        let users = await User.find({}).populate('username');

        // Filter out the logged-in user from the list
        let filteredUsers = users.filter(
          (user) => user.email !== req.user.email
        );

        // Render the 'admin_dashboard' view with the list of filtered users
        return res.render('admin_dashboard', {
          title: 'Admin dashboard',
          users: filteredUsers,
        });
      } else {
        // If the authenticated user is not an admin, redirect back
        return res.redirect('back');
      }
    } else {
      // If the user is not authenticated, redirect to the home page
      return res.redirect('/');
    }
  } catch (err) {
    // Handle any errors by logging them and redirecting to the home page
    console.log(err);
    return res.redirect('/');
  }
};

// Controller function to render the employee dashboard
module.exports.employeeDashboard = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // Populate the employee with reviews assigned to them and reviews from others
      const employee = await User.findById(req.params.id)
        .populate({
          path: 'reviewsFromOthers',
          populate: {
            path: 'reviewer',
            model: 'User',
          },
        })
        .populate('assignedReviews');

      // Extract the reviews assigned to the employee
      const assignedReviews = employee.assignedReviews;

      // Extract feedbacks from other employees
      const reviewsFromOthers = employee.reviewsFromOthers;

      // Populate reviews given from others
      const populatedResult = await Review.find().populate({
        path: 'reviewer',
        model: 'User',
      });

      // Render the 'employee_dashboard' view with the employee's data
      return res.render('employee_dashboard', {
        title: 'Employee dashboard',
        employee,
        assignedReviews,
        reviewsFromOthers,
      });
    } else {
      // If the user is not authenticated, redirect to the home page
      return res.redirect('/');
    }
  } catch (err) {
    // Handle any errors by logging them and redirecting back
    console.log(err);
    return res.redirect('back');
  }
};
