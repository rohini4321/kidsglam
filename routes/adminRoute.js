const express = require("express");
const admin_route = express.Router();
const adminController = require("../controller/adminController");

admin_route.get("/", adminController.loadloginpage);
admin_route.post('/',adminController.verifyAdmin);
admin_route.get('/homepage2',adminController.loadadminpage);
admin_route.get('/userManagement',adminController.loadUserManagement);
admin_route.put('/blockUser/:userId',adminController.blockUser)
admin_route.put('/unblockUser/:userId',adminController.unblockUser)
admin_route.get('/categoryPage',adminController.loadCategoryPage)
admin_route.post('/categoryPage',adminController.createCategory)
admin_route.get('/productPage',adminController.loadProductPage)
admin_route.get('/orderPage',adminController.loadOrderPage)
admin_route.put('/listUser/:categoryId',adminController.listcategory)
admin_route.put('/unlistUser/:categoryId',adminController.unlistcategory)
admin_route.delete('/deletecategory/:categoryId', adminController.deleteCategory);
admin_route.put('/editcategory/:categoryId', adminController.editCategory);
admin_route.get('/addProduct', adminController.addProduct);
admin_route.post('/addProduct', adminController.productController);
admin_route.delete('/deleteproduct/:productId',adminController.deleteProduct);
admin_route.get('/editproduct',adminController.loadEditProduct);
admin_route.post('/editproduct',adminController.editProduct);

admin_route.post('/deleteimage', adminController.deleteImage)



module.exports=admin_route;