const User = require("../models/userDataModel")
const bcrypt = require("bcrypt")
const Category = require("../models/categoryModel")
const Product = require("../models/productDataModel")
const multer = require("multer")
const path = require('path');
const sharp = require('sharp');
const fs = require('fs')
const Order = require ("../models/orderModel")
// Function to load home page
const loadloginpage = async (req, res) => {
  try {
    res.render("adminLogin");
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Destination folder for storing uploads
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Use current timestamp + original filename as filename
  }
});
const upload = multer({ storage: storage }).array("images", 10);

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
    console.log(`creating a category...`);
    let { categoryName } = req.body;
    
    // Capitalize the first letter and make the rest lowercase
    categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();

    // Check if the category already exists
    const existingCategory = await Category.findOne({ categoryName ,isDeleted:false});
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    // Create a new category
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
    
    const Products = await Product.find({isUnlisted:false})
    res.render('productpage',{product:Products })
   
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading home page. Please try again later.');
  }
};

// const loadOrderPage = async (req, res) => {
//   try {
//     res.render("orderManagement",{username:""});
   
//   } catch (error) {
//     console.log('Error loading home page:', error.message);
//     res.status(500).send('Error loading order page.');
//   }
// };



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





const loadOrderPage = async (req, res) => {
  try {
    // Fetch all orders from the database and populate necessary fields
    const orders = await Order.find()
      .populate('products.productId')
      

    // Render the orderPage EJS template with orders data
    res.render('orderManagement', { orders, username: "", user: req.session.user }); // Assuming you have a user session
  } catch (error) {
    console.error('Error loading order page:', error);
    res.status(500).send('Server error');
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
    console.log(`rendering  product detailpage`)
    const categories = await Category.find({isUnlisted : false});
    res.render('addproduct', {categories});
  
    
  } catch (error) {
    console.log('Error loading home page:', error.message);
    res.status(500).send('Error loading product detail page. Please try again later.');
  }
};

  


const productController = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error(`Multer error: ${err}`);
        res.status(500).send("Error uploading the image");
        return;
      } else if (err) {
        console.error(`Unknown error: ${err}`);
        res.status(500).send(`Unknown error occurred: ${err.message}`);
        return;
      }

      if (!req.files || req.files.length === 0) {
        res.status(400).send("No images uploaded.");
        return;
      }

      console.log('Uploaded files:', req.files);
      try {
        const processedImages = [];
        for (const file of req.files) {
          const filename = `${file.originalname}`;
          const imagePath = path.join(__dirname, "..", "public", "uploads", filename);
          
          try {
            const imageBuffer = await sharp(file.path)
              .resize(440, 440)
              .toBuffer();
            
            fs.writeFileSync(imagePath, imageBuffer);
            console.log(`Processed and saved image: ${filename}`);
            fs.unlinkSync(file.path); // Remove the original file
            processedImages.push(filename);
          } catch (error) {
            console.error(`Error occurred while processing the image: ${error}`);
            res.status(500).send("Error processing the image");
            return;
          }
        }

        const { productName, description, price, category, stock } = req.body;
        const newProduct = new Product({
          productName,
          description,
          price,
          category,
          stock,
          image: processedImages,
          createdOn: new Date(),
        });

        await newProduct.save();
        res.redirect("/admin/productpage");
      } catch (err) {
        console.error(`Error occurred while saving the product: ${err}`);
        res.status(500).send(`Error saving product: ${err.message}`);
      }
    });
  } catch (err) {
    console.error(`Error adding product: ${err}`);
    res.status(500).send("Error adding product");
  }
};


    

    
   const deleteProduct = async (req, res) => {
  try {
    console.log(`deleting product...`)
      const productId = req.params.productId;
      console.log(productId)
    
      const product = await Product.findByIdAndUpdate(productId, { isUnlisted:true});
      if (!product) {
          return res.status(404).json({ message: 'product not found' });
      }
      // Optionally, you can also perform additional checks or validations here
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

  
    


const loadEditProduct = async (req, res) => {
  try {
    

    const productId = req.query.id;
    console.log(productId);
        const product = await Product.findById(productId);
        const categories = await Category.find({isUnlisted : false});
      
        res.render('editProduct', { product ,categories,});

   
  } catch (error) {
    console.log('Error loading editproduct page:', error.message);
    res.status(500).send('Error loading editproduct page. Please try again later.');
  }
};







const editProduct = async (req, res) => {
  try {
    const processedImage =[];

    upload(req,res,async function (err){
      if(err instanceof multer.MulterError){
        console.log(`Multer error: ${err}`)
        res.status(500).send("Error uploading the image")
        return;
      }
      else if(err){
        console.log(`unknown Error: ${err}`);
        res.status(500).send("unknown error occcurred. The Error:",err);
        return;
      }
     
      console.log(req.files)
      try{
        for(const file of req.files){
          const filename =`${file.originalname}`;
          const imagePath =path.join(
            __dirname,
            "..",
            "public",
            "uploads",
            filename
          );
          // processedImage.push(filename);
          try{
            const imageBuffer = await sharp(file.path)
            .resize(440,440)
            .toBuffer();
            fs.writeFileSync(imagePath,imageBuffer);
            // console.log(imageBuffer)
            fs.unlinkSync(file.path);
            processedImage.push(filename);


          }
          catch(error){
            console.log(`Error occured while processing the image:${error}`);
            res.status(500).send("error processing the image");
            return;
          }
        }

        const productId = req.query.id;
    const { productName, price, stock, category, description } = req.body;

    let product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    product.productName = productName;
    product.price = price;
    product.stock = stock;
    product.category = category;
    product.description = description;
    product.image = [...product.image,...processedImage];

    await product.save();

    res.redirect(`/admin/editproduct?id=${productId}`);
      
      
      }catch(err){
        console.log(`Error occured while processing the image using sharp: ${err}`);
        res.status(500).send(`error processing image using sharp ${err.message}`);
      }

      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const deleteImage = async (req, res) => {
  
  try {
  const productid  = req.body.productid
  const index= req.body.index;
  const product= await Product.findById(productid)

  product.image.splice(index ,1);



  product.save();

      
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};


const changeOrderStatus = async (req, res) => {
  try {
      const { orderId } = req.params;
      console.log(req.params)
      const { status } = req.body;

      // Find the order by ID and update the status
      const order = await Order.findByIdAndUpdate(
          orderId,
          { orderStatus: status },
         
      );

      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
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
                productController,
                deleteProduct,
                loadEditProduct,
                editProduct,
                deleteImage,
                changeOrderStatus
                
                
                

                

}