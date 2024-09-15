// Import the Mongoose module and bcrypt for password hashing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define a Mongoose schema for the User model
const userSchema = new mongoose.Schema(
  {
    // Define a field 'email' of type String, which is required and unique
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Define a field 'password' of type String, which is required
    password: {
      type: String,
      required: true,
    },
    // Define a field 'username' of type String, which is required
    username: {
      type: String,
      required: true,
    },
    // Define a field 'role' of type String with enum values 'employee' and 'admin', defaulting to 'employee'
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee',
      required: true,
    },
    // Define a field 'assignedReviews' as an array of ObjectIds, referencing the 'User' model
    assignedReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' model
      },
    ],
    // Define a field 'reviewsFromOthers' as an array of ObjectIds, referencing the 'Review' model
    reviewsFromOthers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review', // References the 'Review' model
      },
    ],
  },
  {
    // Enable timestamps to automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Middleware to hash the password before saving it in the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to validate the password with the one provided by the user
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};

// Create a Mongoose model 'User' based on the userSchema
const User = mongoose.model('User', userSchema);

// Export the 'User' model to be used in other parts of your application
module.exports = User;
