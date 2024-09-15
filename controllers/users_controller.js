// Import the 'User' and 'Review' models
const User = require('../models/user');
const Review = require('../models/review');

// Controller function to render the sign-in page
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      return res.redirect('/admin-dashboard');
    }
    // If the user is not an admin, redirect to their employee dashboard
    return res.redirect(`/employee-dashboard/${req.user.id}`);
  }
  // Render the 'user_sign_in' view for signing in
  return res.render('user_sign_in', {
    title: 'Review system | Sign In',
  });
};

// Controller function to render the sign-up page
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      return res.redirect('/admin-dashboard');
    }
    // If the user is not an admin, redirect to their employee dashboard
    return res.redirect(`/employee-dashboard/${req.user.id}`);
  }
  // Render the 'user_sign_up' view for signing up
  return res.render('user_sign_up', {
    title: 'Review system | Sign Up',
  });
};

// Controller function to render the page for adding an employee
module.exports.addEmployee = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      // Render the 'add_employee' view for adding an employee
      return res.render('add_employee', {
        title: 'Add Employee',
      });
    }
  }
  return res.redirect('/');
};

// Controller function to render the page for editing an employee
module.exports.editEmployee = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        // Populate the employee with all the reviews (feedback) given by other users
        const employee = await User.findById(req.params.id).populate({
          path: 'reviewsFromOthers',
          populate: {
            path: 'reviewer',
            model: 'User',
          },
        });

        // Extract reviews given by others from the employee variable
        const reviewsFromOthers = employee.reviewsFromOthers;

        // Render the 'edit_employee' view with employee data
        return res.render('edit_employee', {
          title: 'Edit Employee',
          employee,
          reviewsFromOthers,
        });
      }
    }
    return res.redirect('/');
  } catch (err) {
    console.log('error', err);
    return res.redirect('back');
  }
};

// Controller function to handle user sign-up
module.exports.create = async (req, res) => {
  try {
    const { username, email, password, confirm_password, role } = req.body;

    // Check if the password matches the confirm_password
    if (password != confirm_password) {
      req.flash('error', 'Password and Confirm password are not the same');
      return res.redirect('back');
    }

    // Check if the user already exists
    User.findOne({ email }, async (err, user) => {
      if (err) {
        console.log('Error in finding user in signing up');
        req.flash('error', 'Error in finding user in signing up');
        return;
      }

      // If the user is not found in the database, create one
      if (!user) {
        await User.create(
          {
            email,
            password,
            username,
            role,
          },
          (err, user) => {
            if (err) {
              req.flash('error', "Couldn't sign up");
            }
            req.flash('success', 'Account created!');
            return res.redirect('/');
          }
        );
      } else {
        req.flash('error', 'User already registered!');
        return res.redirect('back');
      }
    });
  } catch (err) {
    console.log('error', err);
    return res.redirect('back');
  }
};

// Controller function to add an employee
module.exports.createEmployee = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    // Check if the password matches the confirm_password
    if (password != confirm_password) {
      req.flash('error', 'Password and Confirm password are not the same');
      return res.redirect('back');
    }

    // Check if the user already exists
    User.findOne({ email }, async (err, user) => {
      if (err) {
        console.log('Error in finding user in signing up');
        return;
      }

      // If the user is not found in the database, create one
      if (!user) {
        await User.create(
          {
            email,
            password,
            username,
          },
          (err, user) => {
            if (err) {
              req.flash('error', "Couldn't add employee");
            }
            req.flash('success', 'Employee added!');
            return res.redirect('back');
          }
        );
      } else {
        req.flash('error', 'Employee already registered!');
        return res.redirect('back');
      }
    });
  } catch (err) {
    console.log('error', err);
    return res.redirect('back');
  }
};

// Controller function to update employee details
module.exports.updateEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    const { username, role } = req.body;

    if (!employee) {
      req.flash('error', 'Employee does not exist!');
      return res.redirect('back');
    }

    // Update data coming from req.body
    employee.username = username;
    employee.role = role;
    employee.save(); // Save the updated data

    req.flash('success', 'Employee details updated!');
    return res.redirect('back');
  } catch (err) {
    console.log('error', err);
    return res.redirect('back');
  }
};

// Controller function to delete a user
module.exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    // Delete all the reviews in which this user is a recipient
    await Review.deleteMany({ recipient: id });

    // Delete all the reviews in which this user is a reviewer
    await Review.deleteMany({ reviewer: id });

    // Delete this user
    await User.findByIdAndDelete(id);

    req.flash('success', `User and associated reviews deleted!`);
    return res.redirect('back');
  } catch (err) {
    console.log('error', err);
    return res.redirect('back');
  }
};

// Controller function to create a session for the user when signing in
module.exports.createSession = (req, res) => {
  req.flash('success', 'Logged in successfully');
  if (req.user.role === 'admin') {
    return res.redirect('/admin-dashboard');
  }
  // If the user is not an admin, redirect to their employee dashboard
  return res.redirect(`/employee-dashboard/${req.user.id}`);
};

// Controller function to clear the user's session (log out)
module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged out successfully!');
    return res.redirect('/');
  });
};
