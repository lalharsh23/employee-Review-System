// Import the 'User' and 'Review' models
const User = require('../models/user');
const Review = require('../models/review');

// Controller function to assign a review to a user
module.exports.assignReview = async (req, res) => {
  const { recipient_email } = req.body;
  try {
    if (req.isAuthenticated()) {
      // Find the reviewer and recipient by their IDs
      const reviewer = await User.findById(req.params.id);
      const recipient = await User.findOne({ email: recipient_email });

      // Check if the review is already assigned
      const alreadyAssigned = reviewer.assignedReviews.includes(recipient.id);

      // If already assigned, show an error message
      if (alreadyAssigned) {
        req.flash('error', `Review already assigned!`);
        return res.redirect('back');
      }

      // Update the reviewer's assignedReviews field by adding a reference to the recipient
      await reviewer.updateOne({
        $push: { assignedReviews: recipient },
      });

      req.flash('success', `Review assigned successfully!`);
      return res.redirect('back');
    } else {
      req.flash('error', `Couldn't assign the review`);
    }
  } catch (err) {
    console.log('error: ', err);
  }
};

// Controller function to submit a review
module.exports.submitReview = async (req, res) => {
  const { recipient_email, feedback, jobPerf, skl, bvr } = req.body;
  try {
    const recipient = await User.findOne({ email: recipient_email });
    const reviewer = await User.findById(req.params.id);

    // Create a new review
    const review = await Review.create({
      review: feedback,
      jobPerformance: jobPerf,
      skills: skl,
      behavior: bvr,
      reviewer,
      recipient,
    });

    // Remove all extra spaces from the review
    const reviewString = review.review.trim();

    // Prevent from submitting an empty feedback
    if (reviewString === '') {
      req.flash('error', `Feedback section can't be empty!`);
      return res.redirect('back');
    }

    // Add a reference of the newly created review to the recipient's reviewsFromOthers field
    await recipient.updateOne({
      $push: { reviewsFromOthers: review },
    });

    // Remove the reference of the recipient from the reviewer's assignedReviews field
    await reviewer.updateOne({
      $pull: { assignedReviews: recipient.id },
    });

    req.flash('success', `Review submitted successfully!`);
    return res.redirect('back');
  } catch (err) {
    console.log('error', err);
  }
};

// Controller function to update a review
module.exports.updateReview = async (req, res) => {
  try {
    const { feedback } = req.body;
    console.log(req.body);
    console.log("review id", req.params.id);

    // Find the review to be updated by its ID
    const reviewToBeUpdated = await Review.findById(req.params.id);

    // If the review is not found, show an error message
    if (!reviewToBeUpdated) {
      req.flash('error', 'Review does not exist!');
    }

    // Extract the specific data based on req.params.id
    const jobPerfKey = `jobPerf_${req.params.id}`;
    const sklKey = `skl_${req.params.id}`;
    const bvrKey = `bvr_${req.params.id}`;

    const jobPerfValue = req.body[jobPerfKey];
    const sklValue = req.body[sklKey];
    const bvrValue = req.body[bvrKey];

    // Assign the extracted data to the review object
    reviewToBeUpdated.review = feedback;
    reviewToBeUpdated.jobPerformance = jobPerfValue;
    reviewToBeUpdated.skills = sklValue;
    reviewToBeUpdated.behavior = bvrValue;

    // Save the updated review
    await reviewToBeUpdated.save();

    req.flash('success', 'Review updated!');
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};
