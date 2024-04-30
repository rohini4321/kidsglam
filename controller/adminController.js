
// Function to load home page
const loadloginpage = async (req, res) => {
  try {
    res.render("adminLogin");
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};
module.exports={
                loadloginpage
}