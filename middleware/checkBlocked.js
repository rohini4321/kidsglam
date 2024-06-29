
const User = require('../models/userDataModel');



const isBlocked = async (req, res, next) => {
  if (req.session.user) {
    try {
      const user = await User.findById(req.session.user);
      if ( user.isBlocked) {
        res.render('loginPage',{username:"", message:"user is blocked by admin"})
      } else {
        next();
      }
    } catch (error) {
      console.error('Error checking user block status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    next();
  }
};
module.exports={
  isBlocked
}