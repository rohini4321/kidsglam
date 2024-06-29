// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace

  // Determine the status code based on the error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set the status and send the error message as JSON
  res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = errorHandler;
