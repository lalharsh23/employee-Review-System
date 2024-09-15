// Middleware function to set flash messages in the response locals
module.exports.setFlash = function (req, res, next) {
  // Create a 'flash' object in the response locals to store flash messages
  res.locals.flash = {
    success: req.flash('success'), // Get success flash messages from the request
    error: req.flash('error'),     // Get error flash messages from the request
  };

  next(); // Continue to the next middleware in the request/response cycle
};
