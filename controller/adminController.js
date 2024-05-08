const User = require("../models/userDataModel")
const bcrypt = require("bcrypt")
const Category = require("../models/categoryModel")
// Function to load home page
const loadloginpage = async (req, res) => {
  try {
    res.render("adminLogin");
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};

const loadadminpage =async(req, res) => {
  try {
    console.log(`rendering admin home page`)
    res.render("homePage2", {username: ""});
    
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};

const verifyAdmin = async (req, res) => {
 
  console.log(`verifying admin.`);
    // const username = req.session.userName;
   
    try {
      const {email , password}=req.body;
      
      const findUser = await User.findOne({ isAdmin: "1", email: email });
      console.log(findUser);
   
    if (findUser) {
          const passwordMatch = await bcrypt.compare(password, findUser.password);
          if (passwordMatch) {
            req.session.user = findUser._id;
            req.session.userName = findUser.username;
  
            
            res.redirect("/admin/homepage2" );
          } else {
            console.log("Password is not matching");
            res.render("adminLogin", {message: "Password is not matching" });
          } 
      } else {
        console.log("User is not found");
        res.render("adminLogin", {message: "Invalid email or password" });
      }
    } catch (error) {
      // res.redirect("/pageNotFound");
      console.log(`error in try : ${error}`);
      res.render("adminLogin", {message: "Invalid email or password" });
    }
  };



  const loadUserManagement = async(req,res)=>{
    try {
      console.log(`rendering usermanagement`)
  
      

      const userData= await User.find({isAdmin:0});
      console.log(userData)
      res.render('userManagement',{user:userData});
      
    } catch (error) {
      res.status(500).send('Error loading User management page. Please try again later.');
    }
  };
  


  const blockUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { isBlocked } = req.body;

        // Update user's status in the database
        await User.findByIdAndUpdate(userId, { isBlocked });

        res.sendStatus(200); // Send success status
    } catch (error) {
        console.error("Error blocking user:", error);
        res.sendStatus(500); // Send error status
    }
};

const unblockUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { isBlocked } = req.body;

        // Update user's status in the database
        await User.findByIdAndUpdate(userId, { isBlocked });

        res.sendStatus(200); // Send success status
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.sendStatus(500); // Send error status
    }
};


    

const loadCategoryPage = async (req, res) => {
  try {
  
   
const categories = await Category.find({isDeleted:false})
res.render('categoryPage',{category:categories})
   

  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};



const createCategory = async (req, res) => {
  try {
    console.log(`creating a category...`)
      const { categoryName } = req.body;
      const newCategory = new Category({ categoryName: categoryName });
      await newCategory.save();
      res.status(201).json(newCategory);
  } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Server error' });
  }
};




const loadProductPage = async (req, res) => {
  try {
    res.render("productPage");
   
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};

const loadOrderPage = async (req, res) => {
  try {
    res.render("orderPage");
   
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};


const listcategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { isUnlisted } = req.body;
  console.log(`unlisting cat: ${categoryId} and isUnli: ${isUnlisted}`)

  try {
      // Find the category by ID
      const category = await Category.findById(categoryId);

      if (!category) {
          return res.status(404).json({ error: 'Category not found' });
      }

      // Update the category's isUnlisted field
      category.isUnlisted = isUnlisted;

      // Save the updated category
      await category.save();

      // Send success response
      res.status(200).json({ message: 'Category listed successfully' });
  } catch (error) {
      console.error('Error unlisting category:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};





const unlistcategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { isUnlisted } = req.body;
  console.log(`unlisting cat: ${categoryId} and isUnli: ${isUnlisted}`)

  try {
      // Find the category by ID
      const category = await Category.findById(categoryId);

      if (!category) {
          return res.status(404).json({ error: 'Category not found' });
      }

      // Update the category's isUnlisted field
      category.isUnlisted = isUnlisted;

      // Save the updated category
      await category.save();

      // Send success response
      res.status(200).json({ message: 'Category listed successfully' });
  } catch (error) {
      console.error('Error unlisting category:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};




const deleteCategory = async (req, res) => {
  try {
      const categoryId = req.params.categoryId;
      // Find the category by ID in your database and update the isDeleted field to true
      const category = await Category.findByIdAndUpdate(categoryId, { isDeleted: true });
      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }
      // Optionally, you can also perform additional checks or validations here
      res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};



const editCategory = async (req, res) => {
  try {
      const categoryId = req.params.categoryId;
      const { newName } = req.body;

      // Find the category by ID in your database and update its name
      const updatedCategory = await Category.findByIdAndUpdate(categoryId, { categoryName: newName }, { new: true });

      if (!updatedCategory) {
          return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ message: 'Category name updated successfully', updatedCategory });
  } catch (error) {
      console.error('Error editing category:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const addProduct =async(req, res) => {
  try {
    console.log(`rendering product detailpage`)
    res.render("productDetail");
    
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading product detail page. Please try again later.');
  }
};

const getCategories = async (req, res) => {
  try {
      const categories = await Category.find();
      res.json(categories);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};




module.exports={
                loadloginpage,
                verifyAdmin,
                loadadminpage,
                loadUserManagement,
                blockUser,
                unblockUser,
                loadCategoryPage,
                createCategory,
                loadProductPage,
                loadOrderPage,
                listcategory,
                unlistcategory,
                deleteCategory ,
                editCategory,
                addProduct,
                getCategories 

                

}