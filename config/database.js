const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Export a function to establish a database connection
exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      // Connection successful, print a success message
      console.log('DB CONNECTED SUCCESSFULLY');
    })
    .catch((err) => {
      // Connection failed, print an error message and exit the process
      console.log('DB CONNECTION FAILED');
      console.log(err);
      process.exit(1); // Exit the process with an error code (1)
    });
};
