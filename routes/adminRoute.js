const express = require("express");
const admin_route = express.Router();
const adminController = require("../controller/adminController");

admin_route.get("/", adminController.loadloginpage);

module.exports=admin_route;