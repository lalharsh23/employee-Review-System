// Import the Mongoose module
const mongoose = require('mongoose');

// Define a Mongoose schema for the Review model
const reviewSchema = new mongoose.Schema(
  {
    // Define a field 'review' of type String to store the review text
    review: {
      type: String,
    },
    jobPerformance: {
      type: Number,
      min: 0, // Minimum rating value (0)
      max: 5, // Maximum rating value (5)
    },
    skills: {
      type: Number,
      min: 0, // Minimum rating value (0)
      max: 5, // Maximum rating value (5)
    },
    behavior: {
      type: Number,
      min: 0, // Minimum rating value (0)
      max: 5, // Maximum rating value (5)
    },
    // Define a field 'reviewer' of type ObjectId, referencing the 'User' model
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the 'User' model
    },
    // Define a field 'recipient' of type ObjectId, referencing the 'User' model
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the 'User' model
    },
  },
  {
    // Enable timestamps to automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Create a Mongoose model 'Review' based on the reviewSchema
const Review = mongoose.model('Review', reviewSchema);

// Export the 'Review' model to be used in other parts of your application
module.exports = Review;
