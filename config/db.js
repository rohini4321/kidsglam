const mongoose = require("mongoose");
function connectdb()
{

  mongoose.connect("mongodb://localhost:27017/kidsglam");
}
module.exports= connectdb